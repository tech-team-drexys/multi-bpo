"""
URLs principais do MultiBPO - VERSÃO CORRIGIDA
Sub-Fase 2.2.3 - Problema de namespace duplicado resolvido
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def health_check(request):
    """Health check endpoint para monitoramento"""
    return HttpResponse("MultiBPO OK", content_type="text/plain")

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # Health Check (manter da Fase 1)
    path('health/', health_check, name='health_check'),
    
    # ========== API v1 Routes ==========
    
    # Autenticação completa
    path('api/v1/auth/', include('apps.authentication.urls')),
    
    # Contadores (dados e perfis)
    path('api/v1/contadores/', include('apps.contadores.urls')),
    
    # Receita Federal (consultas governamentais)
    path('api/v1/receita/', include('apps.receita.urls')),
    
    # ========== JWT Token endpoints (SimpleJWT) ==========
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/v1/whatsapp/', include('apps.whatsapp_users.urls')),
]

# Static files
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Debug Toolbar URLs
if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        # Debug toolbar não instalado - ignora silenciosamente
        pass

