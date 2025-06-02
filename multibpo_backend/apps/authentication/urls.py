from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Endpoints de autenticação (serão implementados na Mini-Fase 2.2)
    # path('register/', views.RegisterView.as_view(), name='register'),
    # path('login/', views.LoginView.as_view(), name='login'),
    # path('refresh/', views.RefreshView.as_view(), name='refresh'),
    # path('logout/', views.LogoutView.as_view(), name='logout'),
    # path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Por enquanto, apenas um placeholder
    path('test/', views.test_view, name='test'),
]