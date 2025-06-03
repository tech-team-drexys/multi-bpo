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
    
    # API v1 Routes
    path('api/v1/auth/', include('apps.authentication.urls')),    # ← NOVO
    path('api/v1/contadores/', include('apps.contadores.urls')), # ← NOVO
    
    # JWT Token endpoints (SimpleJWT) - Corrigido
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Static files (manter sua configuração existente)
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Debug Toolbar URLs (CORREÇÃO DO ERRO 'djdt' namespace)
if settings.DEBUG:
    try:
        import debug_toolbar
        urlpatterns = [
            path('__debug__/', include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        # Debug toolbar não instalado - ignora silenciosamente
        pass