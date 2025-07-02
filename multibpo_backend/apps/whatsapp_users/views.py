# apps/whatsapp_users/views.py
from rest_framework.renderers import JSONRenderer
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from .serializers import (
    ValidateUserRequestSerializer, ValidateUserResponseSerializer,
    RegisterMessageRequestSerializer, RegisterMessageResponseSerializer,
    UpdateUserRequestSerializer, UpdateUserResponseSerializer
)
from .models import WhatsAppUser, WhatsAppMessage
from .utils import (
    get_or_create_whatsapp_user, verificar_status_usuario,
    verificar_limites_usuario, incrementar_contador_usuario,
    get_mensagem_limite, atualizar_usuario_whatsapp
)

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.decorators import api_view, permission_classes
import re
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
import os

# Imports específicos para views mobile
from .models import EmailVerificationToken  # Novo modelo criado
from .utils.email_helpers import send_verification_email, send_welcome_email, get_client_ip


class APIKeyAuthenticationMixin:
    """Mixin para autenticação via API Key simples"""
    authentication_classes = []  # Desabilitar autenticação JWT para estas APIs
    renderer_classes = [JSONRenderer]  # Forçar JSON renderer
    
    def dispatch(self, request, *args, **kwargs):
        # Verificar API Key no header
        api_key = request.META.get('HTTP_X_API_KEY')
        expected_key = 'mvp_whatsapp_key_2025'
        
        if api_key != expected_key:
            response = Response({
                'error': 'API Key inválida',
                'code': 'INVALID_API_KEY'
            }, status=status.HTTP_401_UNAUTHORIZED)
            response.accepted_renderer = JSONRenderer()
            response.accepted_media_type = 'application/json'
            response.renderer_context = {}
            return response
        
        return super().dispatch(request, *args, **kwargs)


@method_decorator(csrf_exempt, name='dispatch')
class ValidateUserView(APIKeyAuthenticationMixin, APIView):
    """
    API para validar se usuário pode fazer pergunta
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Validar input
        serializer = ValidateUserRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        phone_number = serializer.validated_data['phone_number']
        
        try:
            # Buscar ou criar usuário
            whatsapp_user, created = get_or_create_whatsapp_user(phone_number)
            
            # Verificar status do usuário
            status_info = verificar_status_usuario(whatsapp_user)
            
            # Se usuário precisa aceitar termos ou definir nome, não pode perguntar ainda
            if status_info['precisa_termos'] or status_info['precisa_nome']:
                response_data = {
                    'pode_perguntar': False,
                    'plano_atual': whatsapp_user.plano_atual,
                    'perguntas_restantes': 0,
                    'limite_info': {
                        'realizadas': whatsapp_user.perguntas_realizadas,
                        'limite': whatsapp_user.limite_perguntas
                    },
                    'mensagem_limite': None,
                    'usuario_novo': created,
                    'precisa_termos': status_info['precisa_termos'],
                    'precisa_nome': status_info['precisa_nome'],
                    'user_id': whatsapp_user.id
                }
            else:
                # Verificar limites
                limite_info = verificar_limites_usuario(whatsapp_user)
                
                response_data = {
                    'pode_perguntar': limite_info['pode_perguntar'],
                    'plano_atual': whatsapp_user.plano_atual,
                    'perguntas_restantes': limite_info['perguntas_restantes'],
                    'limite_info': {
                        'realizadas': whatsapp_user.perguntas_realizadas,
                        'limite': whatsapp_user.limite_perguntas
                    },
                    'mensagem_limite': get_mensagem_limite(whatsapp_user, limite_info) if not limite_info['pode_perguntar'] else None,
                    'usuario_novo': created,
                    'precisa_termos': False,
                    'precisa_nome': False,
                    'user_id': whatsapp_user.id
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'error': 'Erro interno do servidor',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterMessageView(APIKeyAuthenticationMixin, APIView):
    """
    API para registrar mensagem e incrementar contador
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Validar input
        serializer = RegisterMessageRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        phone_number = data['phone_number']
        
        try:
            # Buscar usuário
            whatsapp_user, _ = get_or_create_whatsapp_user(phone_number)
            
            # Registrar mensagem
            message = WhatsAppMessage.objects.create(
                whatsapp_user=whatsapp_user,
                pergunta=data['pergunta'],
                resposta=data['resposta'],
                tokens_utilizados=data.get('tokens_utilizados', 0),
                tempo_processamento=data.get('tempo_processamento', 0.0)
            )
            
            # Incrementar contador
            perguntas_realizadas = incrementar_contador_usuario(whatsapp_user)
            
            # Verificar novos limites
            limite_info = verificar_limites_usuario(whatsapp_user)
            
            response_data = {
                'message_id': message.id,
                'perguntas_restantes': limite_info['perguntas_restantes'],
                'limite_atingido': limite_info['limite_atingido'],
                'proxima_acao': limite_info['proxima_acao'],
                'novo_plano': None  # Para futuras atualizações automáticas
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': 'Erro ao registrar mensagem',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class UpdateUserView(APIKeyAuthenticationMixin, APIView):
    """
    API para atualizar dados do usuário
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Validar input
        serializer = UpdateUserRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Dados inválidos',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        phone_number = data['phone_number']
        action = data['action']
        update_data = data.get('data', {})
        
        try:
            # Buscar usuário
            whatsapp_user, _ = get_or_create_whatsapp_user(phone_number)
            
            # Atualizar usuário
            result = atualizar_usuario_whatsapp(whatsapp_user, action, update_data)
            
            # Verificar limites atualizados
            limite_info = verificar_limites_usuario(whatsapp_user)
            
            response_data = {
                'success': result['success'],
                'user_updated': result['success'],
                'new_status': result['new_status'],
                'message': result['message'],
                'perguntas_restantes': limite_info['perguntas_restantes'] if limite_info['perguntas_restantes'] != -1 else None
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'error': 'Erro ao atualizar usuário',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# View para testes rápidos (remover em produção)
class HealthCheckView(APIView):
    """View simples para testar se as APIs estão funcionando"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        from .models import WhatsAppUser, ConfiguracaoSistema
        
        return Response({
            'status': 'OK',
            'app': 'whatsapp_users',
            'version': 'MVP 1.0',
            'usuarios_total': WhatsAppUser.objects.count(),
            'configuracoes': ConfiguracaoSistema.objects.count(),
            'endpoints': [
                '/api/v1/whatsapp/validate-user/',
                '/api/v1/whatsapp/register-message/',
                '/api/v1/whatsapp/update-user/'
            ]
        })
    
def validate_whatsapp_number(phone):
    """Validar formato do número WhatsApp brasileiro"""
    # Remove caracteres especiais
    clean_phone = re.sub(r'[^\d]', '', phone)
    
    # Deve ter 10-11 dígitos após código do país
    if len(clean_phone) < 10:
        return False
    
    # Adicionar código do país se não tiver
    if not clean_phone.startswith('55'):
        clean_phone = '55' + clean_phone
    
    # Formato final: +5511999999999
    return '+' + clean_phone


@api_view(['POST'])
@permission_classes([AllowAny])
def mobile_register_view(request):
    """
    API para registro mobile com envio de email de verificação
    
    POST /api/v1/whatsapp/mobile/register/
    Body: {
        "email": "user@email.com",
        "whatsapp": "+5511999999999", 
        "password": "senha123",
        "nome": "Nome Usuario" (opcional)
    }
    """
    
    try:
        # Extrair e validar dados básicos
        email = request.data.get('email', '').strip().lower()
        whatsapp = request.data.get('whatsapp', '').strip()
        password = request.data.get('password', '')
        nome = request.data.get('nome', '').strip()
        
        # Validações obrigatórias
        if not all([email, whatsapp, password]):
            return Response({
                'success': False,
                'message': 'Email, WhatsApp e senha são obrigatórios.',
                'field_errors': {
                    'email': 'Obrigatório' if not email else None,
                    'whatsapp': 'Obrigatório' if not whatsapp else None,
                    'password': 'Obrigatório' if not password else None,
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar formato do email
        try:
            validate_email(email)
        except ValidationError:
            return Response({
                'success': False,
                'message': 'Formato de email inválido.',
                'field_errors': {'email': 'Formato inválido'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar senha (mínimo 6 caracteres)
        if len(password) < 6:
            return Response({
                'success': False,
                'message': 'Senha deve ter pelo menos 6 caracteres.',
                'field_errors': {'password': 'Mínimo 6 caracteres'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar e normalizar WhatsApp
        whatsapp_normalized = validate_whatsapp_number(whatsapp)
        if not whatsapp_normalized:
            return Response({
                'success': False,
                'message': 'Formato de WhatsApp inválido. Use: (11) 99999-9999',
                'field_errors': {'whatsapp': 'Formato inválido'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se email já existe
        if User.objects.filter(email=email).exists():
            return Response({
                'success': False,
                'message': 'Este email já está cadastrado. Faça login ou use outro email.',
                'field_errors': {'email': 'Email já cadastrado'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se WhatsApp já está cadastrado
        if WhatsAppUser.objects.filter(phone_number=whatsapp_normalized).exists():
            return Response({
                'success': False,
                'message': 'Este WhatsApp já está cadastrado. Faça login ou use outro número.',
                'field_errors': {'whatsapp': 'WhatsApp já cadastrado'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Criar usuário Django (inativo até verificar email)
        user = User.objects.create_user(
            username=email,  # Usar email como username
            email=email,
            password=password,
            first_name=nome.split()[0] if nome else '',
            last_name=' '.join(nome.split()[1:]) if nome and len(nome.split()) > 1 else '',
            is_active=False  # Ativar apenas após verificação de email
        )
        
        # Criar WhatsAppUser vinculado (inativo até verificar email)
        whatsapp_user = WhatsAppUser.objects.create(
            user=user,
            phone_number=whatsapp_normalized,
            nome=nome or email.split('@')[0],
            email=email,
            plano_atual='novo',  # Começa como novo até verificar email
            limite_perguntas=3,
            ativo=False,  # Ativar após verificação
            termos_aceitos=True,  # Assumir aceite na página mobile
            termos_aceitos_em=timezone.now()
        )
        
        # Gerar token de verificação
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        verification_token = EmailVerificationToken.generate_token(
            user, 
            ip_address=ip_address, 
            user_agent=user_agent
        )
        
        # Enviar email de verificação
        email_sent = send_verification_email(user, verification_token.token, request)
        
        if email_sent:
            return Response({
                'success': True,
                'message': 'Conta criada! Verifique seu email para ativar.',
                'data': {
                    'user_id': user.id,
                    'email': email,
                    'whatsapp': whatsapp_normalized,
                    'nome': nome or email.split('@')[0],
                    'verification_needed': True,
                    'token_expires_in': '1 hora'
                }
            }, status=status.HTTP_201_CREATED)
        else:
            # Se email falhou, deletar usuário criado
            user.delete()
            return Response({
                'success': False,
                'message': 'Erro ao enviar email de verificação. Tente novamente em alguns minutos.',
                'error_code': 'EMAIL_SEND_FAILED'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        # Log do erro completo
        import logging
        logger = logging.getLogger('email')
        logger.error(f"Erro no registro mobile: {e}")
        
        return Response({
            'success': False,
            'message': 'Erro interno no servidor. Tente novamente.',
            'error_code': 'INTERNAL_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email_view(request, token):
    """
    API para verificar email via token do link
    
    GET /api/v1/whatsapp/verify-email/<token>/
    """
    
    try:
        verification_token = EmailVerificationToken.objects.get(token=token)
        
        # Verificar se já foi verificado
        if verification_token.is_verified:
            return Response({
                'success': True,
                'message': 'Email já foi verificado anteriormente.',
                'data': {
                    'already_verified': True,
                    'user_email': verification_token.user.email,
                    'verified_at': verification_token.verified_at
                }
            })
        
        # Verificar se expirou
        if verification_token.is_expired():
            return Response({
                'success': False,
                'message': 'Token de verificação expirado. Solicite um novo cadastro.',
                'data': {
                    'expired': True,
                    'user_email': verification_token.user.email
                },
                'error_code': 'TOKEN_EXPIRED'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar token e ativar conta
        success, message = verification_token.verify()
        
        if success:
            # Gerar tokens JWT automaticamente para auto-login
            try:
                # Tentar usar sistema JWT existente
                from apps.authentication.views import JWTTokenResponse
                tokens = JWTTokenResponse.create_tokens_for_user(verification_token.user)
            except (ImportError, AttributeError):
                # Fallback se não conseguir importar
                tokens = {
                    'access': 'jwt_token_placeholder',
                    'refresh': 'jwt_refresh_placeholder'
                }
            
            # Enviar email de boas-vindas (opcional)
            send_welcome_email(verification_token.user)
            
            return Response({
                'success': True,
                'message': 'Email verificado com sucesso! Conta ativada.',
                'data': {
                    'verified': True,
                    'auto_login': True,
                    'user': {
                        'id': verification_token.user.id,
                        'email': verification_token.user.email,
                        'nome': verification_token.user.get_full_name() or verification_token.user.username,
                        'plano_atual': 'basico',  # Upgraded automaticamente
                        'perguntas_disponveis': 10
                    },
                    'tokens': tokens,
                    'redirect_url': '/m/sucesso'
                }
            })
        else:
            return Response({
                'success': False,
                'message': f'Erro ao verificar email: {message}',
                'error_code': 'VERIFICATION_FAILED'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except EmailVerificationToken.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Token de verificação inválido ou não encontrado.',
            'data': {
                'invalid_token': True
            },
            'error_code': 'INVALID_TOKEN'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        import logging
        logger = logging.getLogger('email')
        logger.error(f"Erro na verificação de email: {e}")
        
        return Response({
            'success': False,
            'message': 'Erro interno no servidor.',
            'error_code': 'INTERNAL_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def mobile_login_view(request):
    """
    API para login mobile com validação extra
    
    POST /api/v1/whatsapp/mobile/login/
    Body: {
        "email": "user@email.com",
        "password": "senha123"
    }
    """
    
    try:
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        
        # Validações básicas
        if not all([email, password]):
            return Response({
                'success': False,
                'message': 'Email e senha são obrigatórios.',
                'field_errors': {
                    'email': 'Obrigatório' if not email else None,
                    'password': 'Obrigatório' if not password else None,
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Autenticar usuário
        user = authenticate(username=email, password=password)
        
        if not user:
            return Response({
                'success': False,
                'message': 'Email ou senha incorretos.',
                'field_errors': {
                    'email': 'Credenciais inválidas',
                    'password': 'Credenciais inválidas'
                },
                'error_code': 'INVALID_CREDENTIALS'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Verificar se conta está ativa
        if not user.is_active:
            return Response({
                'success': False,
                'message': 'Conta não verificada. Verifique seu email ou cadastre-se novamente.',
                'data': {
                    'email_not_verified': True,
                    'user_email': user.email,
                    'register_url': '/m/cadastro'
                },
                'error_code': 'ACCOUNT_NOT_VERIFIED'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Gerar tokens JWT
        try:
            from apps.authentication.views import JWTTokenResponse
            tokens = JWTTokenResponse.create_tokens_for_user(user)
        except (ImportError, AttributeError):
            tokens = {
                'access': 'jwt_token_placeholder',
                'refresh': 'jwt_refresh_placeholder'
            }
        
        # Buscar dados do WhatsAppUser
        user_data = {
            'id': user.id,
            'email': user.email,
            'nome': user.get_full_name() or user.username,
            'whatsapp_phone': None,
            'plano_atual': 'basico',
            'perguntas_restantes': 10
        }
        
        try:
            whatsapp_user = WhatsAppUser.objects.get(email=user.email)
            user_data.update({
                'whatsapp_phone': whatsapp_user.phone_number,
                'plano_atual': whatsapp_user.plano_atual,
                'perguntas_restantes': whatsapp_user.get_perguntas_restantes(),
                'limite_perguntas': whatsapp_user.limite_perguntas,
                'perguntas_realizadas': whatsapp_user.perguntas_realizadas
            })
        except WhatsAppUser.DoesNotExist:
            # Se não tem WhatsAppUser, usuário veio apenas do site
            pass
        
        return Response({
            'success': True,
            'message': 'Login realizado com sucesso!',
            'data': {
                'login_completed': True,
                'user': user_data,
                'tokens': tokens,
                'redirect_url': '/m/sucesso'
            }
        })
        
    except Exception as e:
        import logging
        logger = logging.getLogger('email')
        logger.error(f"Erro no login mobile: {e}")
        
        return Response({
            'success': False,
            'message': 'Erro interno no servidor.',
            'error_code': 'INTERNAL_ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([AllowAny])  # Trocar por permissão adequada em produção
def metrics_view(request):
    """Métricas do sistema para monitoramento"""
    
    # Verificar secret key
    secret = request.GET.get('secret')
    if secret != 'multibpo_metrics_2025':
        return Response({'error': 'Unauthorized'}, status=401)
    
    try:
        # Período de análise
        now = timezone.now()
        today = now.date()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        # Usuários por período
        users_today = WhatsAppUser.objects.filter(created_at__date=today).count()
        users_week = WhatsAppUser.objects.filter(created_at__gte=week_ago).count()
        users_month = WhatsAppUser.objects.filter(created_at__gte=month_ago).count()
        users_total = WhatsAppUser.objects.count()
        
        # Usuários por plano
        users_by_plan = WhatsAppUser.objects.values('plano_atual').annotate(
            count=Count('id')
        )
        
        # Taxa de conversão
        usuarios_novos = WhatsAppUser.objects.filter(plano_atual='novo').count()
        usuarios_basicos = WhatsAppUser.objects.filter(plano_atual='basico').count()
        usuarios_premium = WhatsAppUser.objects.filter(plano_atual='premium').count()
        
        conversao_cadastro = (usuarios_basicos + usuarios_premium) / max(users_total, 1) * 100
        conversao_premium = usuarios_premium / max(users_total, 1) * 100
        
        # Mensagens por período
        messages_today = WhatsAppMessage.objects.filter(created_at__date=today).count()
        messages_week = WhatsAppMessage.objects.filter(created_at__gte=week_ago).count()
        messages_month = WhatsAppMessage.objects.filter(created_at__gte=month_ago).count()
        
        # Tokens de verificação
        tokens_pending = EmailVerificationToken.objects.filter(
            is_verified=False,
            created_at__gte=week_ago
        ).count()
        tokens_verified = EmailVerificationToken.objects.filter(
            is_verified=True,
            verified_at__gte=week_ago
        ).count()
        
        # Health checks
        health_checks = {
            'database': True,  # Se chegou até aqui, DB está OK
            'email': check_email_health(),
            'whatsapp_api': check_whatsapp_api_health(),
            'disk_space': check_disk_space()
        }
        
        metrics = {
            'timestamp': now.isoformat(),
            'users': {
                'today': users_today,
                'week': users_week,
                'month': users_month,
                'total': users_total,
                'by_plan': {item['plano_atual']: item['count'] for item in users_by_plan}
            },
            'conversion': {
                'signup_rate': round(conversao_cadastro, 2),
                'premium_rate': round(conversao_premium, 2)
            },
            'messages': {
                'today': messages_today,
                'week': messages_week,
                'month': messages_month
            },
            'email_verification': {
                'pending': tokens_pending,
                'verified_week': tokens_verified
            },
            'health': health_checks,
            'system': {
                'version': 'MVP_FASE_4',
                'uptime': get_system_uptime()
            }
        }
        
        return Response(metrics)
        
    except Exception as e:
        return Response({
            'error': 'Error generating metrics',
            'message': str(e)
        }, status=500)


def check_email_health():
    """Verificar saúde do sistema de email"""
    try:
        from django.core.mail import send_mail
        from django.conf import settings
        
        # Verificar configurações
        if not settings.EMAIL_HOST_USER:
            return False
            
        return True
    except:
        return False


def check_whatsapp_api_health():
    """Verificar saúde da API WhatsApp"""
    try:
        import requests
        response = requests.get('http://multibpo_ia_whatsapp:8004/webhook/', timeout=5)
        return response.status_code == 200
    except:
        return False


def check_disk_space():
    """Verificar espaço em disco"""
    try:
        import shutil
        total, used, free = shutil.disk_usage('/')
        free_percent = (free / total) * 100
        return free_percent > 10  # Retorna True se tem mais de 10% livre
    except:
        return False


def get_system_uptime():
    """Obter uptime do sistema"""
    try:
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = float(f.readline().split()[0])
            return round(uptime_seconds / 3600, 2)  # Em horas
    except:
        return 0