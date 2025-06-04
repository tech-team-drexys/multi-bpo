"""
URLs de Autenticação - ARTEFATO 5A
MultiBPO Sub-Fase 2.2.2 - Views Core JWT

Conecta as views implementadas aos endpoints da API
"""

from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # ========== ENDPOINTS CORE - ARTEFATO 5A ==========
    
    # Registro de contadores
    path('register/', views.RegisterView.as_view(), name='register'),
    
    # Login flexível (email/CRC/username)
    path('login/', views.LoginView.as_view(), name='login'),
    
    # ========== ENDPOINTS DE TESTE - ARTEFATO 5A ==========
    
    # Teste público - verificar se sistema está funcionando
    path('test/', views.test_auth_view, name='test'),        # ← CORRIGIDO: test_auth_view
    
    # Teste protegido - verificar autenticação JWT
    path('protected-test/', views.protected_test_view, name='protected_test'),
    
    # ========== ENDPOINTS FUTUROS - OUTROS ARTEFATOS ==========
    # Serão implementados nos próximos artefatos:
    
    # path('refresh/', views.RefreshView.as_view(), name='refresh'),     # Artefato 5B
    # path('logout/', views.LogoutView.as_view(), name='logout'),        # Artefato 5B  
    # path('profile/', views.ProfileView.as_view(), name='profile'),     # Artefato 5B
    # path('check/', views.CheckTokenView.as_view(), name='check'),      # Artefato 5B
]