"""
URLs de Autenticação - Novo Fluxo BPO + Compatibilidade
MultiBPO Sub-Fase 2.2.3 - Rotas Adaptadas

ESTRATÉGIA:
- Mantém URLs existentes funcionando (compatibilidade)
- Adiciona novos endpoints para fluxo BPO simplificado
- Suporta validação tempo real e registro de serviços
- Roteamento duplo para /validate/ (flexibilidade)
"""

from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # ========== ENDPOINTS EXISTENTES (COMPATIBILIDADE TOTAL) ==========
    
    # Registro completo original - MANTIDO INTACTO
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # Login flexível original - MANTIDO INTACTO  
    path('login/', views.LoginView.as_view(), name='login'),
    
    # Testes originais - MANTIDOS
    path('test/', views.test_auth_view, name='test'),
    path('protected-test/', views.protected_test_view, name='protected_test'),
    
    # ========== NOVOS ENDPOINTS PARA FLUXO BPO ==========
    
    # Registro simplificado BPO (CPF/CNPJ → 4-5 campos)
    path('register-service/', views.BPORegistroView.as_view(), name='bpo-register'),
    
    # Validação de documentos em tempo real
    path('validate/document/', views.DocumentoValidationView.as_view(), name='validate-document'),
    
    # Perfil do usuário autenticado (adaptado para BPO)
    path('profile/', views.ContadorPerfilView.as_view(), name='contador-profile'),
    
    # Logout seguro
    path('logout/', views.logout_view, name='logout'),
    
    # ========== ENDPOINTS DE DESENVOLVIMENTO ==========
    
    # Health check específico do auth
    path('health/', views.health_check_auth, name='health-check'),
    
    # Teste de endpoints (desenvolvimento)
    path('test-endpoints/', views.test_endpoints, name='test-endpoints'),
    
    # ========== ENDPOINTS FUTUROS - OUTROS ARTEFATOS ==========
    # Implementação futura quando necessário:
    
    # path('refresh/', views.RefreshView.as_view(), name='refresh'),     # JWT refresh
    # path('check/', views.CheckTokenView.as_view(), name='check'),      # Token validation
    # path('change-password/', views.ChangePasswordView.as_view(), name='change-password'),
]

# ========== ROTEAMENTO ALTERNATIVO PARA /validate/ ==========
"""
Estas rotas são acessíveis via:
1. /api/v1/auth/validate/document/     (rota principal)
2. /api/v1/validate/document/          (rota alternativa - config/urls.py)

Ambas apontam para a mesma view, oferecendo flexibilidade ao frontend.
"""

# ========== MAPEAMENTO DE ENDPOINTS RESULTANTES ==========
"""
URLs disponíveis após implementação:

ORIGINAIS (mantidos):
- POST /api/v1/auth/register/              # Registro completo original
- POST /api/v1/auth/login/                 # Login flexível original
- GET  /api/v1/auth/test/                  # Teste público
- GET  /api/v1/auth/protected-test/        # Teste protegido

NOVOS BPO (Sub-Fase 2.2.3):
- POST /api/v1/auth/register-service/      # Registro BPO simplificado
- POST /api/v1/auth/validate/document/     # Validação CPF/CNPJ tempo real
- GET  /api/v1/auth/profile/               # Perfil adaptado
- POST /api/v1/auth/logout/                # Logout seguro

ALTERNATIVO (via config/urls.py):
- POST /api/v1/validate/document/          # Mesmo que auth/validate/document/

DESENVOLVIMENTO:
- GET  /api/v1/auth/health/                # Health check auth
- GET  /api/v1/auth/test-endpoints/        # Teste desenvolvimento
"""

# ========== VIEWS ESPERADAS ==========
"""
Views que devem ser implementadas em views.py:

EXISTENTES (manter):
- RegisterView                  # ✅ Já existe
- LoginView                     # ✅ Já existe  
- test_auth_view               # ✅ Já existe
- protected_test_view          # ✅ Já existe

NOVAS (implementar):
- BPORegistroView              # ⏳ Registro simplificado
- DocumentoValidationView      # ⏳ Validação tempo real
- ContadorPerfilView           # ⏳ Perfil adaptado
- logout_view                  # ⏳ Logout function-based
- health_check_auth            # ⏳ Health check
- test_endpoints               # ⏳ Teste desenvolvimento
"""