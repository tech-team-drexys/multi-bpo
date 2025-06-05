"""
Serviços para integração com APIs governamentais brasileiras
MultiBPO Sub-Fase 2.2.3 - Receita Federal Integration
"""

import requests
import logging
from django.conf import settings
from typing import Dict, Optional, Any

logger = logging.getLogger(__name__)


class ReceitaFederalService:
    """
    Serviço para consulta de dados na Receita Federal
    
    Implementa integração com APIs públicas e privadas
    para consulta de CNPJ, situação cadastral, etc.
    """
    
    # URLs das APIs (configuráveis via settings)
    BRASILAPI_URL = "https://brasilapi.com.br/api/cnpj/v1"
    RECEITAWS_URL = "https://www.receitaws.com.br/v1/cnpj"
    
    def __init__(self):
        self.timeout = getattr(settings, 'RECEITA_TIMEOUT', 10)
        self.headers = {
            'User-Agent': 'MultiBPO/1.0 (Contabilidade)',
            'Accept': 'application/json'
        }
    
    def consultar_cnpj(self, cnpj: str) -> Dict[str, Any]:
        """
        Consulta dados de CNPJ na Receita Federal
        
        Args:
            cnpj: CNPJ formatado ou apenas números
            
        Returns:
            Dict com dados da empresa ou erro
        """
        cnpj_clean = ''.join(filter(str.isdigit, cnpj))
        
        if len(cnpj_clean) != 14:
            return self._error_response("CNPJ deve ter 14 dígitos")
        
        # Tentar múltiplas APIs para maior confiabilidade
        for api_name, api_method in [
            ('BrasilAPI', self._consultar_brasilapi),
            ('ReceitaWS', self._consultar_receitaws),
        ]:
            try:
                logger.info(f"Consultando CNPJ {cnpj_clean} via {api_name}")
                result = api_method(cnpj_clean)
                
                if result.get('success'):
                    logger.info(f"CNPJ {cnpj_clean} encontrado via {api_name}")
                    return result
                    
            except Exception as e:
                logger.warning(f"Erro ao consultar {api_name}: {e}")
                continue
        
        return self._error_response("CNPJ não encontrado em nenhuma fonte")
    
    def _consultar_brasilapi(self, cnpj: str) -> Dict[str, Any]:
        """Consulta via BrasilAPI"""
        url = f"{self.BRASILAPI_URL}/{cnpj}"
        
        response = requests.get(url, headers=self.headers, timeout=self.timeout)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            'success': True,
            'fonte': 'BrasilAPI',
            'cnpj': self._format_cnpj(cnpj),
            'razao_social': data.get('razao_social', ''),
            'nome_fantasia': data.get('nome_fantasia', ''),
            'situacao': data.get('situacao_cadastral', 'ATIVA'),
            'endereco': {
                'logradouro': data.get('logradouro', ''),
                'numero': data.get('numero', ''),
                'complemento': data.get('complemento', ''),
                'bairro': data.get('bairro', ''),
                'municipio': data.get('municipio', ''),
                'uf': data.get('uf', ''),
                'cep': data.get('cep', '')
            },
            'telefone': self._extract_phone(data),
            'email': self._extract_email(data),
            'atividade_principal': data.get('atividade_principal', [{}])[0].get('texto', ''),
            'data_consulta': data.get('ultima_atualizacao', ''),
            'raw_data': data
        }
    
    def _consultar_receitaws(self, cnpj: str) -> Dict[str, Any]:
        """Consulta via ReceitaWS (backup)"""
        url = f"{self.RECEITAWS_URL}/{cnpj}"
        
        response = requests.get(url, headers=self.headers, timeout=self.timeout)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('status') == 'ERROR':
            return self._error_response(data.get('message', 'Erro na consulta'))
        
        return {
            'success': True,
            'fonte': 'ReceitaWS',
            'cnpj': self._format_cnpj(cnpj),
            'razao_social': data.get('nome', ''),
            'nome_fantasia': data.get('fantasia', ''),
            'situacao': data.get('situacao', 'ATIVA'),
            'endereco': {
                'logradouro': data.get('logradouro', ''),
                'numero': data.get('numero', ''),
                'complemento': data.get('complemento', ''),
                'bairro': data.get('bairro', ''),
                'municipio': data.get('municipio', ''),
                'uf': data.get('uf', ''),
                'cep': data.get('cep', '')
            },
            'telefone': data.get('telefone', ''),
            'email': data.get('email', ''),
            'atividade_principal': data.get('atividade_principal', [{}])[0].get('text', ''),
            'data_consulta': data.get('ultima_atualizacao', ''),
            'raw_data': data
        }
    
    def _format_cnpj(self, cnpj: str) -> str:
        """Formata CNPJ para XX.XXX.XXX/XXXX-XX"""
        if len(cnpj) == 14:
            return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"
        return cnpj
    
    def _extract_phone(self, data: Dict) -> str:
        """Extrai telefone dos dados (diferentes formatos por API)"""
        return (
            data.get('telefone', '') or 
            data.get('ddd_telefone_1', '') or
            ''
        )
    
    def _extract_email(self, data: Dict) -> str:
        """Extrai email dos dados"""
        return data.get('email', '')
    
    def _error_response(self, message: str) -> Dict[str, Any]:
        """Resposta padronizada de erro"""
        return {
            'success': False,
            'error': True,
            'message': message,
            'fonte': 'local'
        }