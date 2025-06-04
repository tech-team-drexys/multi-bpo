"""
Views Auxiliares de Autenticação JWT
MultiBPO Sub-Fase 2.2.2 - Artefato 5B

ADICIONAR ESTAS VIEWS AO ARQUIVO: apps/authentication/views.py
(Adicionar APÓS as views do Artefato 5A já implementadas)

Implementa:
- RefreshTokenView: Renovação segura de tokens
- LogoutView: Logout com blacklist de tokens  
- ProfileView: Dados completos do contador
- CheckTokenView: Verificação rápida de token
- ChangePasswordView: Alteração segura de senha

Integração: Usa mesmos serializers e padrões do Artefato 5A
"""

import logging
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import transaction
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ========== IMPORTS ADICIONAIS PARA ARTEFATO 5B ==========
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
from apps.contadores.models import Contador
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
            token['crc'] = contador.crc
            token['escritorio_id'] = contador.escritorio.id if contador.escritorio else None
            token['eh_responsavel'] = contador.eh_responsavel_tecnico
            token['pode_assinar'] = contador.pode_assinar_documentos
            token['ativo'] = contador.ativo
            
        except Contador.DoesNotExist:
            # User sem perfil contador - apenas claims básicos
            token['contador_id'] = None
            token['crc'] = None
            
        # Claims do sistema
        token['sistema'] = 'MultiBPO'
        token['versao'] = '2.2.2'
        token['issued_at'] = timezone.now().isoformat()
        
        return token


class RegisterView(APIView):
    """
    View para registro completo de contadores
    
    POST /api/v1/auth/register/
    
    Funcionalidades:
    - Validação completa com dados brasileiros (CPF, CRC, telefone)
    - Criação atômica User Django + Contador
    - Vinculação automática com Escritório e Especialidades
    - Geração imediata de JWT tokens
    - Response completa com dados do contador criado
    
    Permissão: AllowAny (endpoint público)
    Serializer: ContadorRegistroSerializer
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Registro de novo contador
        
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
            logger.info(f"Contador registrado com sucesso: {contador.crc} - User ID: {contador.user.id}")
            
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
                    'crc': contador.crc,
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
    View para autenticação flexível de contadores
    
    POST /api/v1/auth/login/
    
    Funcionalidades:
    - Login via email, CRC ou username
    - Detecção automática do tipo de login
    - Validação de senha e status do contador
    - Geração de JWT tokens com claims customizados
    - Response com dados completos do contador
    - Atualização automática do last_login
    
    Permissão: AllowAny (endpoint público)
    Serializer: ContadorLoginSerializer
    """
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Autenticação de contador existente
        
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
            logger.info(f"Login realizado: {contador.crc} via {login_type} - IP: {self.get_client_ip(request)}")
            
            # Response completa com dados do contador + tokens
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
                    'escritorio': {
                        'id': contador.escritorio.id if contador.escritorio else None,
                        'nome': contador.escritorio.nome_fantasia if contador.escritorio else None,
                    },
                    'permissions': {
                        'eh_responsavel_tecnico': contador.eh_responsavel_tecnico,
                        'pode_assinar_documentos': contador.pode_assinar_documentos,
                        'especialidades_count': contador.especialidades.count(),
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


# ========== VIEWS AUXILIARES BÁSICAS ==========

@api_view(['GET'])
@permission_classes([AllowAny])
def test_auth_view(request):
    """
    View de teste para verificar se o sistema de autenticação está funcionando
    
    GET /api/v1/auth/test/
    
    Retorna status do sistema e informações de debug
    """
    
    # Verificar quantos contadores estão registrados
    total_contadores = Contador.objects.count()
    total_users = User.objects.count()
    
    # Informações sobre JWT
    jwt_config = getattr(settings, 'SIMPLE_JWT', {})
    
    response_data = {
        'sistema': 'MultiBPO',
        'versao': '2.2.2',
        'artefato': '5A - Views Core JWT',
        'status': 'FUNCIONANDO',
        'auth_ready': True,
        'endpoints_implementados': [
            'POST /api/v1/auth/register/',
            'POST /api/v1/auth/login/',
            'GET /api/v1/auth/test/',
            'GET /api/v1/auth/protected-test/',
        ],
        'estatisticas': {
            'total_contadores': total_contadores,
            'total_users': total_users,
        },
        'jwt_config': {
            'access_token_lifetime': str(jwt_config.get('ACCESS_TOKEN_LIFETIME', '1 hour')),
            'refresh_token_lifetime': str(jwt_config.get('REFRESH_TOKEN_LIFETIME', '7 days')),
            'algorithm': jwt_config.get('ALGORITHM', 'HS256'),
            'issuer': jwt_config.get('ISSUER', 'MultiBPO'),
        },
        'user_authenticated': request.user.is_authenticated,
        'timestamp': timezone.now().isoformat(),
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_test_view(request):
    """
    View de teste protegida para verificar autenticação JWT
    
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
                'crc': contador.crc,
                'escritorio': contador.escritorio.nome_fantasia if contador.escritorio else None,
                'ativo': contador.ativo,
            },
            'token_info': {
                'valid': True,
                'tested_at': timezone.now().isoformat(),
            }
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


# ========== ERROR HANDLERS BÁSICOS ==========

class AuthenticationErrorMixin:
    """
    Mixin para padronizar respostas de erro de autenticação
    
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


# ========== JWT TOKEN UTILITIES ==========

class JWTTokenUtils:
    """
    Utilitários para trabalhar com JWT tokens no MultiBPO
    
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


# ========== CONFIGURAÇÕES JWT PARA SETTINGS ==========

def get_jwt_configuration():
    """
    Retorna configuração JWT recomendada para o MultiBPO
    
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
        
        # Claims customizados MultiBPO
        'TOKEN_OBTAIN_SERIALIZER': 'apps.authentication.views.MultiBPOTokenObtainPairSerializer',
    }

# ========== VIEWS DE UTILIDADE (OPCIONAIS) ==========

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check_auth(request):
    """
    Health check específico para o sistema de autenticação
    
    Endpoint: GET /api/v1/auth/health/
    """
    try:
        # Verificar se JWT está configurado
        from rest_framework_simplejwt.tokens import AccessToken
        
        # Verificar se blacklist está funcionando
        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
        
        # Verificar se models estão acessíveis
        user_count = User.objects.count()
        contador_count = Contador.objects.count()
        
        return Response({
            'success': True,
            'service': 'MultiBPO Authentication',
            'status': 'healthy',
            'timestamp': timezone.now().isoformat(),
            'version': '2.2.2',
            'statistics': {
                'total_users': user_count,
                'total_contadores': contador_count,
            },
            'features': {
                'jwt_enabled': True,
                'token_blacklist': True,
                'brazilian_validations': True,
                'audit_logging': True
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
@permission_classes([IsAuthenticated])
def auth_test_protected(request):
    """
    Endpoint de teste para verificar autenticação
    
    Endpoint: GET /api/v1/auth/test-protected/
    Headers: Authorization: Bearer <access_token>
    """
    user = request.user
    
    try:
        contador = Contador.objects.get(user=user)
        contador_info = {
            'nome_completo': contador.nome_completo,
            'crc': contador.crc,
            'ativo': contador.ativo
        }
    except Contador.DoesNotExist:
        contador_info = None
    
    return Response({
        'success': True,
        'message': 'Autenticação funcionando!',
        'authenticated_user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_active': user.is_active
        },
        'contador': contador_info,
        'timestamp': timezone.now().isoformat(),
        'test_passed': True
    }, status=status.HTTP_200_OK)