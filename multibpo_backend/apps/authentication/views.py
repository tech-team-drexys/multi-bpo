from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# Importações centralizadas do __init__.py dos serializers
from .serializers import get_available_serializers

@api_view(['GET'])
@permission_classes([AllowAny])
def test_view(request):
    """
    View de teste para verificar se o app authentication está funcionando
    e se os serializers estão sendo carregados corretamente
    """
    serializers_disponiveis = get_available_serializers()

    return Response({
        'app': 'authentication',
        'status': 'OK',
        'message': 'App authentication configurado com sucesso!',
        'version': '2.2.2',
        'jwt_ready': True,
        'authenticated': request.user.is_authenticated,
        'serializers_disponiveis': serializers_disponiveis
    })
