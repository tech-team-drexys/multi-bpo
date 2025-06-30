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