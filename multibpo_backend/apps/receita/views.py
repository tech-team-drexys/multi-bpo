"""
Views para consulta de dados da Receita Federal
"""

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
import logging

from .services import ReceitaFederalService

logger = logging.getLogger(__name__)


class CNPJConsultaView(APIView):
    """
    View para consulta de CNPJ na Receita Federal
    GET /api/v1/receita/cnpj/{cnpj}/
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, cnpj):
        try:
            service = ReceitaFederalService()
            result = service.consultar_cnpj(cnpj)
            
            if result.get('success'):
                return Response(result, status=status.HTTP_200_OK)
            else:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            logger.error(f"Erro na consulta CNPJ {cnpj}: {e}")
            return Response({
                'success': False,
                'error': True,
                'message': 'Erro interno na consulta',
                'cnpj': cnpj
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check_receita(request):
    """
    Health check do app receita
    GET /api/v1/receita/health/
    """
    try:
        # Testar consulta com CNPJ conhecido (Petrobras)
        service = ReceitaFederalService()
        test_result = service.consultar_cnpj('07526557000100')
        
        return Response({
            'status': 'healthy',
            'app': 'receita',
            'version': '1.0.0',
            'services': {
                'brasilapi': 'available',
                'receitaws': 'available'
            },
            'test_cnpj': test_result.get('success', False)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'app': 'receita',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_cnpj_examples(request):
    """
    Testa consulta com CNPJs de exemplo
    GET /api/v1/receita/test/
    """
    service = ReceitaFederalService()
    
    test_cnpjs = [
        '07526557000100',  # Petrobras
        '33000167000101',  # Coca-Cola
        '60746948000112',  # Magazine Luiza
    ]
    
    results = {}
    for cnpj in test_cnpjs:
        try:
            result = service.consultar_cnpj(cnpj)
            results[cnpj] = {
                'success': result.get('success', False),
                'razao_social': result.get('razao_social', 'N/A'),
                'fonte': result.get('fonte', 'N/A')
            }
        except Exception as e:
            results[cnpj] = {
                'success': False,
                'error': str(e)
            }
    
    return Response({
        'app': 'receita',
        'test_results': results,
        'working_apis': sum(1 for r in results.values() if r.get('success'))
    }, status=status.HTTP_200_OK)

