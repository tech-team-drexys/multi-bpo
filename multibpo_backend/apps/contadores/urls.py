from django.urls import path
from . import views

app_name = 'contadores'

urlpatterns = [
    # Endpoints de contadores (serão implementados na Mini-Fase 2.2)
    # path('escritorios/', views.EscritorioListView.as_view(), name='escritorio-list'),
    # path('especialidades/', views.EspecialidadeListView.as_view(), name='especialidade-list'),
    
    # Por enquanto, apenas um placeholder
    path('test/', views.test_view, name='test'),
]