"""
URLs do app Receita Federal
"""

from django.urls import path
from . import views

app_name = 'receita'

urlpatterns = [
    # Consulta de CNPJ
    path('cnpj/<str:cnpj>/', views.CNPJConsultaView.as_view(), name='cnpj-consulta'),
    
    # Health check
    path('health/', views.health_check_receita, name='health-check'),
    
    # Testes
    path('test/', views.test_cnpj_examples, name='test-cnpjs'),
]