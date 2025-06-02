from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

# View temporária para teste - SEM autenticação
@api_view(['GET'])
@permission_classes([AllowAny])
def test_view(request):
    """
    View de teste para verificar se o app authentication está funcionando
    """
    return Response({
        'app': 'authentication',
        'status': 'OK',
        'message': 'App authentication configurado com sucesso!',
        'version': '2.1',
        'jwt_ready': True,
        'authenticated': request.user.is_authenticated
    })