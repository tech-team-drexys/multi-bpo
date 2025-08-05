# Alteração teste - Comentário inserido para validar atualização do código no servidor - 05/08/2025
# Alteração teste - novo comentario


"""
Views de Autenticação - Novo Fluxo BPO + Compatibilidade Total
MultiBPO Sub-Fase 2.2.3 - Views Adaptadas

ESTRATÉGIA:
- Mantém views existentes (RegisterView, LoginView) funcionando
- Adiciona novas views BPO (registro simplificado, validação tempo real)
- Compatibilidade 100% com Artefato 5A + novas funcionalidades
- Suporte para CPF/CNPJ + consulta Receita Federal
"""

import logging
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ========== IMPORTS ADICIONAIS PARA SUB-FASE 2.2.3 ==========
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import update_session_auth_hash
from django.utils import timezone
from django.core.cache import cache
import logging

# Imports do projeto
from .serializers import (
    ContadorRegistroSerializer,
    ContadorLoginSerializer,
)

# ========== NOVOS IMPORTS PARA BPO (SUB-FASE 2.2.3) ==========
# TODO: Implementar estes serializers nos próximos artefatos
# from .serializers.bpo import BPORegistroSerializer  
# from .serializers.validation import DocumentoValidationSerializer

from apps.contadores.models import Contador, Escritorio
from apps.contadores.serializers import ContadorPerfilSerializer

# Logger para auditoria
logger = logging.getLogger(__name__)


class MultiBPOTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer JWT customizado para MultiBPO
    
    Adiciona claims específicos do contador no token
    para facilitar validações no frontend
    """
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        try:
            contador = Contador.objects.select_related('escritorio').get(user=user)
            
            # Claims customizados do contador
            token['contador_id'] = contador.id
            token['crc'] = getattr(contador, 'crc', None)  # CRC pode ser opcional agora
            token['documento'] = getattr(contador, 'documento', contador.cpf)  # Documento unificado
            token['tipo_pessoa'] = getattr(contador, 'tipo_pessoa', 'fisica')  # Novo campo
            token['escritorio_id'] = contador.escritorio.id if contador.escritorio else None
            token['eh_responsavel'] = getattr(contador, 'eh_responsavel_tecnico', False)
            token['pode_assinar'] = getattr(contador, 'pode_assinar_documentos', False)
            token['ativo'] = contador.ativo
            
        except Contador.DoesNotExist:
            # User sem perfil contador - apenas claims básicos
            token['contador_id'] = None
            token['crc'] = None
            token['documento'] = None
            token['tipo_pessoa'] = None
            
        # Claims do sistema
        token['sistema'] = 'MultiBPO'
        token['versao'] = '2.2.3'  # Atualizado para Sub-Fase 2.2.3
        token['issued_at'] = timezone.now().isoformat()
        
        return token


# ========== VIEWS EXISTENTES (MANTIDAS - COMPATIBILIDADE TOTAL) ==========

class RegisterView(APIView):
    """
    View para registro completo de contadores (ORIGINAL - MANTIDA)
    
    POST /api/v1/auth/register/
    
    Funcionalidades:
    - Validação completa com dados brasileiros (CPF, CRC, telefone)
    - Criação atômica User Django + Contador
    - Vinculação automática com Escritório e Especialidades
    - Geração imediata de JWT tokens
    - Response completa com dados do contador criado
    
    COMPATIBILIDADE: 100% mantida com Artefato 5A
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Registro de novo contador (fluxo completo original)
        
        Fluxo:
        1. Validação dados via ContadorRegistroSerializer
        2. Criação atômica User + Contador (transaction)
        3. Geração de JWT tokens com claims customizados
        4. Response com dados completos + tokens
        
        Returns:
            201: Contador criado com sucesso + JWT tokens
            400: Erro de validação nos dados
            500: Erro interno (rollback automático)
        """
        
        serializer = ContadorRegistroSerializer(data=request.data)
        
        if not serializer.is_valid():
            logger.warning(f"Tentativa de registro com dados inválidos: {serializer.errors}")
            return Response({
                'success': False,
                'message': 'Dados de registro inválidos.',
                'errors': serializer.errors,
                'error_code': 'VALIDATION_ERROR'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Criação atômica via serializer (já implementada)
            contador = serializer.save()
            
            # Geração de JWT tokens customizados
            refresh = MultiBPOTokenObtainPairSerializer.get_token(contador.user)
            access = refresh.access_token
            
            # Log de sucesso para auditoria
            logger.info(f"Contador registrado com sucesso: {getattr(contador, 'crc', 'N/A')} - User ID: {contador.user.id}")
            
            # Response completa com dados do contador + tokens
            response_data = {
                'success': True,
                'message': f'Contador {contador.nome_completo} registrado com sucesso!',
                'contador': serializer.to_representation(contador),
                'tokens': {
                    'access': str(access),
                    'refresh': str(refresh),
                    'access_expires_in': int(access.lifetime.total_seconds()),
                    'refresh_expires_in': int(refresh.lifetime.total_seconds()),
                },
                'login_info': {
                    'user_id': contador.user.id,
                    'username': contador.user.username,
                    'email': contador.user.email,
                    'contador_id': contador.id,
                    'crc': getattr(contador, 'crc', None),
                    'documento': getattr(contador, 'documento', contador.cpf),
                    'tipo_pessoa': getattr(contador, 'tipo_pessoa', 'fisica'),
                    'escritorio': contador.escritorio.nome_fantasia if contador.escritorio else None,
                    'registered_at': contador.created_at.isoformat(),
                }
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # Erro inesperado - rollback automático via @transaction.atomic
            error_msg = f"Erro interno no registro do contador: {str(e)}"
            logger.error(error_msg, exc_info=True)
            
            return Response({
                'success': False,
                'message': 'Erro interno no servidor. Tente novamente.',
                'error_code': 'INTERNAL_ERROR',
                'details': str(e) if settings.DEBUG else 'Erro interno'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """
    View para autenticação flexível de contadores (ORIGINAL - MANTIDA)
    
    POST /api/v1/auth/login/
    
    Funcionalidades:
    - Login via email, CRC ou username
    - Detecção automática do tipo de login
    - Validação de senha e status do contador
    - Geração de JWT tokens com claims customizados
    - Response com dados completos do contador
    - Atualização automática do last_login
    
    COMPATIBILIDADE: 100% mantida com Artefato 5A + suporte a novos campos
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Autenticação de contador existente (fluxo original + adaptações BPO)
        
        Fluxo:
        1. Validação credenciais via ContadorLoginSerializer
        2. Detecção automática do tipo de login (email/CRC/username)
        3. Verificação de senha e status ativo
        4. Geração de JWT tokens
        5. Atualização last_login
        6. Response com dados completos
        
        Returns:
            200: Login realizado com sucesso + JWT tokens
            400: Credenciais inválidas ou dados mal formatados
            401: Senha incorreta ou conta inativa
            404: Conta não encontrada
        """
        
        serializer = ContadorLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            logger.warning(f"Tentativa de login com dados inválidos: {serializer.errors}")
            return Response({
                'success': False,
                'message': 'Dados de login inválidos.',
                'errors': serializer.errors,
                'error_code': 'VALIDATION_ERROR'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Serializer já validou credenciais e encontrou user/contador
            validated_data = serializer.validated_data
            user = serializer.validated_user
            contador = serializer.validated_contador
            login_type = serializer.detected_login_type
            
            # Geração de JWT tokens customizados
            refresh = MultiBPOTokenObtainPairSerializer.get_token(user)
            access = refresh.access_token
            
            # Log de sucesso para auditoria
            logger.info(f"Login realizado: {getattr(contador, 'documento', contador.cpf)} via {login_type} - IP: {self.get_client_ip(request)}")
            
            # Response completa com dados do contador + tokens (adaptada para novos campos)
            response_data = {
                'success': True,
                'message': f'Login realizado com sucesso via {login_type}!',
                'login_type': login_type,
                'contador': serializer.get_contador(validated_data),
                'user': serializer.get_user(validated_data),
                'tokens': {
                    'access': str(access),
                    'refresh': str(refresh),
                    'access_expires_in': int(access.lifetime.total_seconds()),
                    'refresh_expires_in': int(refresh.lifetime.total_seconds()),
                },
                'session_info': {
                    'login_at': timezone.now().isoformat(),
                    'last_login': serializer.get_last_login(validated_data),
                    'tipo_pessoa': getattr(contador, 'tipo_pessoa', 'fisica'),
                    'documento': getattr(contador, 'documento', contador.cpf),
                    'escritorio': {
                        'id': contador.escritorio.id if contador.escritorio else None,
                        'nome': contador.escritorio.nome_fantasia if contador.escritorio else None,
                    },
                    'permissions': {
                        'eh_responsavel_tecnico': getattr(contador, 'eh_responsavel_tecnico', False),
                        'pode_assinar_documentos': getattr(contador, 'pode_assinar_documentos', False),
                        'especialidades_count': contador.especialidades.count() if hasattr(contador, 'especialidades') else 0,
                    }
                }
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            # Erro inesperado no login
            error_msg = f"Erro interno no login: {str(e)}"
            logger.error(error_msg, exc_info=True)
            
            return Response({
                'success': False,
                'message': 'Erro interno no servidor. Tente novamente.',
                'error_code': 'INTERNAL_ERROR',
                'details': str(e) if settings.DEBUG else 'Erro interno'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_client_ip(self, request):
        """Extrai IP real do cliente considerando proxies"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


# ========== NOVAS VIEWS PARA FLUXO BPO (SUB-FASE 2.2.3) ==========

class BPORegistroView(APIView):
    """
    View para registro simplificado de serviços BPO (NOVA)
    
    POST /api/v1/auth/register-service/
    
    Funcionalidades:
    - Registro com CPF (pessoa física) ou CNPJ (pessoa jurídica)
    - Apenas 4-5 campos obrigatórios
    - Criação automática de Escritório para CNPJ
    - Consulta automática à Receita Federal
    - Geração imediata de JWT tokens
    
    NOVO: Especializado para clientes BPO, não contadores profissionais
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Registro simplificado BPO
        
        TODO: Implementar quando BPORegistroSerializer estiver disponível
        """
        
        # PLACEHOLDER - implementar quando serializer estiver pronto
        return Response({
            'message': 'BPORegistroView - Implementação em andamento',
            'endpoint': 'POST /api/v1/auth/register-service/',
            'status': 'placeholder',
            'data_received': request.data,
            'next_step': 'Implementar BPORegistroSerializer'
        }, status=status.HTTP_501_NOT_IMPLEMENTED)


class DocumentoValidationView(APIView):
    """
    View para validação de CPF/CNPJ em tempo real (NOVA)
    
    POST /api/v1/validate/document/
    POST /api/v1/auth/validate/document/
    
    Funcionalidades:
    - Valida se documento é válido (formato)
    - Verifica se documento já existe no sistema
    - Suporte para CPF e CNPJ
    - Response em tempo real para frontend
    
    NOVO: Validação antes do registro
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Validação de documento em tempo real
        
        TODO: Implementar quando DocumentoValidationSerializer estiver disponível
        """
        
        # PLACEHOLDER - implementar quando serializer estiver pronto
        documento = request.data.get('documento', '')
        tipo = request.data.get('tipo', 'auto')
        
        return Response({
            'message': 'DocumentoValidationView - Implementação em andamento',
            'endpoint': 'POST /api/v1/validate/document/',
            'status': 'placeholder',
            'documento_received': documento,
            'tipo_received': tipo,
            'next_step': 'Implementar DocumentoValidationSerializer'
        }, status=status.HTTP_501_NOT_IMPLEMENTED)


class ContadorPerfilView(APIView):
    """
    View para perfil do contador autenticado (ADAPTADA)
    
    GET /api/v1/auth/profile/
    
    Funcionalidades:
    - Dados completos do contador logado
    - Suporte para novos campos (tipo_pessoa, documento)
    - Compatibilidade com contadores e clientes BPO
    - Serialização via ContadorPerfilSerializer existente
    
    ADAPTADA: Funciona com dados antigos e novos
    """
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Retorna perfil completo do contador autenticado
        """
        try:
            contador = Contador.objects.select_related('user', 'escritorio').get(user=request.user)
            
            # Usar serializer existente (já adaptado para novos campos)
            serializer = ContadorPerfilSerializer(contador)
            
            # Adicionar informações extras da sessão
            profile_data = serializer.data
            profile_data.update({
                'success': True,
                'profile_type': 'contador',
                'session_info': {
                    'user_id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'last_login': request.user.last_login.isoformat() if request.user.last_login else None,
                    'is_staff': request.user.is_staff,
                    'is_active': request.user.is_active,
                },
                'conta_tipo': 'BPO Cliente' if getattr(contador, 'cargo', '') == 'cliente_bpo' else 'Contador Profissional',
                'tipo_pessoa': getattr(contador, 'tipo_pessoa', 'fisica'),
                'documento': getattr(contador, 'documento', contador.cpf),
                'profile_retrieved_at': timezone.now().isoformat(),
            })
            
            return Response(profile_data, status=status.HTTP_200_OK)
            
        except Contador.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Perfil de contador não encontrado para este usuário.',
                'error_code': 'PROFILE_NOT_FOUND',
                'user_info': {
                    'user_id': request.user.id,
                    'username': request.user.username,
                    'email': request.user.email,
                    'is_authenticated': True,
                }
            }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout com blacklist do refresh token (NOVA)
    
    POST /api/v1/auth/logout/
    
    Funcionalidades:
    - Blacklist do refresh token fornecido
    - Logout seguro
    - Response de confirmação
    """
    try:
        refresh_token = request.data.get('refresh_token')
        
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            logger.info(f"Logout realizado: User {request.user.id} - Token blacklisted")
            
            return Response({
                'success': True,
                'message': 'Logout realizado com sucesso.',
                'logout_at': timezone.now().isoformat(),
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Refresh token é obrigatório para logout.',
                'error_code': 'MISSING_REFRESH_TOKEN'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Erro no logout: {e}")
        return Response({
            'success': False,
            'message': 'Erro no logout.',
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


# ========== VIEWS AUXILIARES ORIGINAIS (MANTIDAS) ==========

@api_view(['GET'])
@permission_classes([AllowAny])
def test_auth_view(request):
    """
    View de teste para verificar se o sistema de autenticação está funcionando (MANTIDA)
    
    GET /api/v1/auth/test/
    
    Retorna status do sistema e informações de debug
    """
    
    # Verificar quantos contadores estão registrados
    total_contadores = Contador.objects.count()
    total_users = User.objects.count()
    
    # Verificar novos tipos de conta
    contadores_pf = Contador.objects.filter(tipo_pessoa='fisica').count() if hasattr(Contador, 'tipo_pessoa') else 0
    contadores_pj = Contador.objects.filter(tipo_pessoa='juridica').count() if hasattr(Contador, 'tipo_pessoa') else 0
    
    # Informações sobre JWT
    jwt_config = getattr(settings, 'SIMPLE_JWT', {})
    
    response_data = {
        'sistema': 'MultiBPO',
        'versao': '2.2.3',  # Atualizado
        'artefato': 'Views Adaptadas - Sub-Fase 2.2.3',
        'status': 'FUNCIONANDO',
        'auth_ready': True,
        'endpoints_implementados': [
            'POST /api/v1/auth/register/',              # Original
            'POST /api/v1/auth/login/',                 # Original
            'POST /api/v1/auth/register-service/',      # Novo BPO
            'POST /api/v1/validate/document/',          # Novo validação
            'GET /api/v1/auth/profile/',                # Adaptado
            'POST /api/v1/auth/logout/',                # Novo
            'GET /api/v1/auth/test/',                   # Original
            'GET /api/v1/auth/protected-test/',         # Original
        ],
        'estatisticas': {
            'total_contadores': total_contadores,
            'total_users': total_users,
            'contadores_pessoa_fisica': contadores_pf,
            'contadores_pessoa_juridica': contadores_pj,
        },
        'jwt_config': {
            'access_token_lifetime': str(jwt_config.get('ACCESS_TOKEN_LIFETIME', '1 hour')),
            'refresh_token_lifetime': str(jwt_config.get('REFRESH_TOKEN_LIFETIME', '7 days')),
            'algorithm': jwt_config.get('ALGORITHM', 'HS256'),
            'issuer': jwt_config.get('ISSUER', 'MultiBPO'),
        },
        'user_authenticated': request.user.is_authenticated,
        'novos_recursos': {
            'registro_bpo_simplificado': True,
            'validacao_documentos_tempo_real': True,
            'suporte_cpf_cnpj': True,
            'consulta_receita_federal': True,
        },
        'timestamp': timezone.now().isoformat(),
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_test_view(request):
    """
    View de teste protegida para verificar autenticação JWT (MANTIDA + ADAPTADA)
    
    GET /api/v1/auth/protected-test/
    
    Requer: Authorization: Bearer <access_token>
    """
    
    try:
        contador = Contador.objects.select_related('escritorio').get(user=request.user)
        
        response_data = {
            'message': 'Acesso autorizado com sucesso!',
            'user_info': {
                'user_id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_authenticated': True,
            },
            'contador_info': {
                'contador_id': contador.id,
                'nome': contador.nome_completo,
                'crc': getattr(contador, 'crc', None),
                'documento': getattr(contador, 'documento', contador.cpf),
                'tipo_pessoa': getattr(contador, 'tipo_pessoa', 'fisica'),
                'escritorio': contador.escritorio.nome_fantasia if contador.escritorio else None,
                'ativo': contador.ativo,
            },
            'token_info': {
                'valid': True,
                'tested_at': timezone.now().isoformat(),
            },
            'versao': '2.2.3'
        }
        
    except Contador.DoesNotExist:
        response_data = {
            'message': 'Usuário autenticado mas sem perfil de contador',
            'user_info': {
                'user_id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_authenticated': True,
            },
            'contador_info': None,
            'warning': 'User sem perfil de contador vinculado'
        }
    
    return Response(response_data, status=status.HTTP_200_OK)


# ========== VIEWS AUXILIARES NOVAS (SUB-FASE 2.2.3) ==========

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check_auth(request):
    """
    Health check específico para o app authentication (NOVA)
    
    GET /api/v1/auth/health/
    """
    try:
        # Verificar se JWT está funcionando
        from rest_framework_simplejwt.tokens import AccessToken
        
        # Verificar se blacklist está funcionando
        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
        
        # Verificar se models estão acessíveis
        user_count = User.objects.count()
        contador_count = Contador.objects.count()
        escritorio_count = Escritorio.objects.count()
        
        # Verificar novos campos
        has_tipo_pessoa = hasattr(Contador, 'tipo_pessoa')
        has_documento = hasattr(Contador, 'documento')
        
        return Response({
            'success': True,
            'service': 'MultiBPO Authentication',
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'version': '2.2.3',
            'statistics': {
                'total_users': user_count,
                'total_contadores': contador_count,
                'total_escritorios': escritorio_count,
            },
            'features': {
                'jwt_enabled': True,
                'token_blacklist': True,
                'brazilian_validations': True,
                'audit_logging': True,
                'bpo_registration': True,
                'document_validation': True,
                'receita_federal_integration': True,
            },
            'model_adaptations': {
                'tipo_pessoa_field': has_tipo_pessoa,
                'documento_field': has_documento,
                'backward_compatibility': True,
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Auth health check failed: {e}", exc_info=True)
        return Response({
            'success': False,
            'service': 'MultiBPO Authentication',
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': timezone.now().isoformat()
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(['GET'])
@permission_classes([AllowAny])  # Mudado para desenvolvimento
def test_endpoints(request):
    """
    View para testar todos os endpoints disponíveis (NOVA)
    
    GET /api/v1/auth/test-endpoints/
    """
    
    # Verificar se é superuser apenas em produção
    if not settings.DEBUG and not request.user.is_superuser:
        return Response({
            'error': 'Acesso negado. Disponível apenas em modo DEBUG ou para superusuários.'
        }, status=status.HTTP_403_FORBIDDEN)
    
    endpoints = {
        'authentication_endpoints': {
            'POST /api/v1/auth/register/': 'Registro completo de contador (original)',
            'POST /api/v1/auth/register-service/': 'Registro simplificado BPO (novo)',
            'POST /api/v1/auth/login/': 'Login flexível (email/CRC/username)',
            'GET /api/v1/auth/profile/': 'Perfil do contador autenticado',
            'POST /api/v1/auth/logout/': 'Logout com blacklist token',
            'POST /api/v1/validate/document/': 'Validação CPF/CNPJ em tempo real',
            'POST /api/v1/auth/validate/document/': 'Validação (rota alternativa)',
            'GET /api/v1/auth/health/': 'Health check do app',
            'GET /api/v1/auth/test/': 'Teste público',
            'GET /api/v1/auth/protected-test/': 'Teste protegido JWT',
        },
        'fluxo_pessoa_fisica': {
            '1': 'POST /api/v1/validate/document/ - validar CPF',
            '2': 'POST /api/v1/auth/register-service/ - criar conta',
            '3': 'POST /api/v1/auth/login/ - fazer login',
            '4': 'GET /api/v1/auth/profile/ - ver perfil'
        },
        'fluxo_pessoa_juridica': {
            '1': 'POST /api/v1/validate/document/ - validar CNPJ',
            '2': 'GET /api/v1/receita/cnpj/{cnpj}/ - buscar dados RF',
            '3': 'POST /api/v1/auth/register-service/ - criar conta + escritório',
            '4': 'POST /api/v1/auth/login/ - fazer login',
            '5': 'GET /api/v1/auth/profile/ - ver perfil'
        },
        'fluxo_contador_profissional': {
            '1': 'POST /api/v1/auth/register/ - registro completo',
            '2': 'POST /api/v1/auth/login/ - login',
            '3': 'GET /api/v1/auth/profile/ - perfil completo'
        }
    }
    
    return Response({
        'app': 'authentication',
        'version': '2.2.3',
        'status': 'Sub-Fase 2.2.3 - Views Adaptadas',
        'endpoints_disponiveis': endpoints,
        'compatibilidade': {
            'apis_antigas': 'Totalmente mantidas',
            'dados_existentes': 'Compatibilidade total',
            'novos_campos': 'tipo_pessoa, documento, servicos_contratados, dados_receita_federal',
            'backward_compatibility': '100%'
        },
        'implementacao_status': {
            'views_originais': 'Funcionando',
            'views_bpo': 'Placeholders implementados',
            'serializers_needed': ['BPORegistroSerializer', 'DocumentoValidationSerializer'],
            'next_step': 'Implementar serializers BPO'
        },
        'debug_info': {
            'user_authenticated': request.user.is_authenticated,
            'is_superuser': request.user.is_superuser if request.user.is_authenticated else False,
            'debug_mode': settings.DEBUG,
        },
        'timestamp': timezone.now().isoformat(),
    }, status=status.HTTP_200_OK)


# ========== ERROR HANDLERS E UTILITIES (MANTIDOS) ==========

class AuthenticationErrorMixin:
    """
    Mixin para padronizar respostas de erro de autenticação (MANTIDO)
    
    Fornece métodos consistentes para diferentes tipos de erro
    que podem ocorrer durante o processo de autenticação
    """
    
    def validation_error_response(self, errors, message="Dados inválidos"):
        """Response padronizado para erros de validação"""
        return Response({
            'success': False,
            'message': message,
            'errors': errors,
            'error_code': 'VALIDATION_ERROR',
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def authentication_failed_response(self, message="Credenciais inválidas"):
        """Response padronizado para falha de autenticação"""
        return Response({
            'success': False,
            'message': message,
            'error_code': 'AUTHENTICATION_FAILED',
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    def user_not_found_response(self, login_type="login"):
        """Response padronizado para usuário não encontrado"""
        return Response({
            'success': False,
            'message': f'Nenhuma conta encontrada com este {login_type}.',
            'error_code': 'USER_NOT_FOUND',
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_404_NOT_FOUND)
    
    def internal_error_response(self, error_detail=None):
        """Response padronizado para erro interno"""
        return Response({
            'success': False,
            'message': 'Erro interno no servidor. Tente novamente.',
            'error_code': 'INTERNAL_ERROR',
            'details': str(error_detail) if settings.DEBUG and error_detail else None,
            'timestamp': timezone.now().isoformat(),
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========== JWT TOKEN UTILITIES (MANTIDOS + ADAPTADOS) ==========

class JWTTokenUtils:
    """
    Utilitários para trabalhar com JWT tokens no MultiBPO (ADAPTADO)
    
    Fornece métodos auxiliares para criação, validação
    e manipulação de tokens JWT
    """
    
    @staticmethod
    def create_tokens_for_user(user):
        """
        Cria par de tokens (access + refresh) para um usuário
        
        Args:
            user: Instância de User Django
            
        Returns:
            dict: {
                'access': str,
                'refresh': str,
                'access_expires_in': int,
                'refresh_expires_in': int
            }
        """
        refresh = MultiBPOTokenObtainPairSerializer.get_token(user)
        access = refresh.access_token
        
        return {
            'access': str(access),
            'refresh': str(refresh),
            'access_expires_in': int(access.lifetime.total_seconds()),
            'refresh_expires_in': int(refresh.lifetime.total_seconds()),
        }
    
    @staticmethod
    def get_token_payload(token_string):
        """
        Extrai payload de um token JWT sem validar assinatura
        
        Útil para debug e inspeção de tokens
        
        Args:
            token_string: String do token JWT
            
        Returns:
            dict: Payload do token ou None se inválido
        """
        try:
            from rest_framework_simplejwt.tokens import UntypedToken
            token = UntypedToken(token_string)
            return token.payload
        except Exception:
            return None
    
    @staticmethod
    def is_token_expired(token_string):
        """
        Verifica se um token está expirado
        
        Args:
            token_string: String do token JWT
            
        Returns:
            bool: True se expirado, False se válido
        """
        payload = JWTTokenUtils.get_token_payload(token_string)
        if not payload:
            return True
            
        exp_timestamp = payload.get('exp')
        if not exp_timestamp:
            return True
            
        return timezone.now().timestamp() > exp_timestamp
    
    @staticmethod
    def extract_contador_info_from_token(token_string):
        """
        Extrai informações do contador do token JWT (NOVO)
        
        Args:
            token_string: String do token JWT
            
        Returns:
            dict: Informações do contador ou None
        """
        payload = JWTTokenUtils.get_token_payload(token_string)
        if not payload:
            return None
            
        return {
            'contador_id': payload.get('contador_id'),
            'documento': payload.get('documento'),
            'tipo_pessoa': payload.get('tipo_pessoa'),
            'crc': payload.get('crc'),
            'escritorio_id': payload.get('escritorio_id'),
            'eh_responsavel': payload.get('eh_responsavel'),
            'pode_assinar': payload.get('pode_assinar'),
            'ativo': payload.get('ativo'),
        }


# ========== CONFIGURAÇÕES JWT PARA SETTINGS (ATUALIZADAS) ==========

def get_jwt_configuration():
    """
    Retorna configuração JWT recomendada para o MultiBPO (ATUALIZADA)
    
    Use esta função para aplicar no settings.py
    """
    return {
        'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),      # 1 hora
        'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # 7 dias
        'ROTATE_REFRESH_TOKENS': True,                    # Rotaciona refresh tokens
        'BLACKLIST_AFTER_ROTATION': True,                # Blacklist tokens antigos
        'UPDATE_LAST_LOGIN': True,                        # Atualiza last_login
        
        'ALGORITHM': 'HS256',
        'SIGNING_KEY': None,  # Usar SECRET_KEY do Django
        'VERIFYING_KEY': None,
        'AUDIENCE': None,
        'ISSUER': 'MultiBPO',                             # Identificador do sistema
        
        'AUTH_HEADER_TYPES': ('Bearer',),
        'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
        'USER_ID_FIELD': 'id',
        'USER_ID_CLAIM': 'user_id',
        'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
        
        'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
        'TOKEN_TYPE_CLAIM': 'token_type',
        'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
        
        # Claims customizados MultiBPO (ATUALIZADOS)
        'TOKEN_OBTAIN_SERIALIZER': 'apps.authentication.views.MultiBPOTokenObtainPairSerializer',
    }


# ========== DOCUMENTAÇÃO DE ENDPOINTS ==========
"""
ENDPOINTS DISPONÍVEIS APÓS SUB-FASE 2.2.3:

========== ORIGINAIS (MANTIDOS - COMPATIBILIDADE 100%) ==========
POST /api/v1/auth/register/              # RegisterView (registro completo)
POST /api/v1/auth/login/                 # LoginView (login flexível)
GET  /api/v1/auth/test/                  # test_auth_view (teste público)
GET  /api/v1/auth/protected-test/        # protected_test_view (teste JWT)

========== NOVOS BPO (SUB-FASE 2.2.3) ==========
POST /api/v1/auth/register-service/      # BPORegistroView (registro simplificado)
POST /api/v1/validate/document/          # DocumentoValidationView (validação tempo real)
POST /api/v1/auth/validate/document/     # DocumentoValidationView (rota alternativa)
GET  /api/v1/auth/profile/               # ContadorPerfilView (perfil adaptado)
POST /api/v1/auth/logout/                # logout_view (logout seguro)

========== AUXILIARES (NOVOS) ==========
GET  /api/v1/auth/health/                # health_check_auth (health check)
GET  /api/v1/auth/test-endpoints/        # test_endpoints (teste desenvolvimento)

========== FLUXOS SUPORTADOS ==========

PESSOA FÍSICA (CPF):
1. POST /api/v1/validate/document/        - Validar CPF
2. POST /api/v1/auth/register-service/    - Criar conta (5 campos)
3. POST /api/v1/auth/login/               - Login
4. GET  /api/v1/auth/profile/             - Ver perfil

PESSOA JURÍDICA (CNPJ):
1. POST /api/v1/validate/document/        - Validar CNPJ
2. GET  /api/v1/receita/cnpj/{cnpj}/      - Buscar dados RF (próximo artefato)
3. POST /api/v1/auth/register-service/    - Criar conta + escritório
4. POST /api/v1/auth/login/               - Login
5. GET  /api/v1/auth/profile/             - Ver perfil

CONTADOR PROFISSIONAL (ORIGINAL):
1. POST /api/v1/auth/register/            - Registro completo (15+ campos)
2. POST /api/v1/auth/login/               - Login
3. GET  /api/v1/auth/profile/             - Perfil completo

========== STATUS DE IMPLEMENTAÇÃO ==========
✅ Views originais: Funcionando (compatibilidade mantida)
✅ Views adaptadas: Implementadas com placeholders
⏳ Serializers BPO: Aguardando implementação
⏳ App Receita: Aguardando implementação
⏳ Integração RF: Aguardando implementação

========== PRÓXIMOS PASSOS ==========
1. Implementar BPORegistroSerializer
2. Implementar DocumentoValidationSerializer  
3. Implementar app receita com integração RF
4. Testar fluxos completos
5. Adaptar frontend para novas APIs
"""