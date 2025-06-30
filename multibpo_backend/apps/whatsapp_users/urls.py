# apps/whatsapp_users/urls.py
from django.urls import path
from .views import (
    ValidateUserView, RegisterMessageView, 
    UpdateUserView, HealthCheckView
)

app_name = 'whatsapp_users'

urlpatterns = [
    # APIs principais
    path('validate-user/', ValidateUserView.as_view(), name='validate_user'),
    path('register-message/', RegisterMessageView.as_view(), name='register_message'),
    path('update-user/', UpdateUserView.as_view(), name='update_user'),
    
    # Health check
    path('health/', HealthCheckView.as_view(), name='health_check'),
    path('', HealthCheckView.as_view(), name='health_check_root'),  # Para testar /api/v1/whatsapp/
]