# apps/whatsapp_users/urls.py
from django.urls import path
from .views import (
    ValidateUserView, RegisterMessageView, 
    UpdateUserView, HealthCheckView,
    mobile_register_view, verify_email_view, mobile_login_view,
    metrics_view
)

app_name = 'whatsapp_users'

urlpatterns = [
    # APIs principais
    path('validate-user/', ValidateUserView.as_view(), name='validate_user'),
    path('register-message/', RegisterMessageView.as_view(), name='register_message'),
    path('update-user/', UpdateUserView.as_view(), name='update_user'),

    # ========== ROTAS MOBILE (NOVAS) ==========
    # APIs para cadastro e login mobile
    path('mobile/register/', mobile_register_view, name='mobile_register'),
    path('mobile/login/', mobile_login_view, name='mobile_login'),
    path('verify-email/<str:token>/', verify_email_view, name='verify_email'),
    path('metrics/', metrics_view, name='metrics'),
    
    # Health check
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('', HealthCheckView.as_view(), name='health_check_root'),  # Para testar /api/v1/whatsapp/
]