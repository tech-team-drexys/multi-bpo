"""
Serializers do App Authentication
MultiBPO Sub-Fase 2.2.2 - Centralização de Imports

Este módulo centraliza todos os serializers de autenticação 
para facilitar imports e manter organização do código.

Estrutura:
- ContadorRegistroSerializer: Registro completo de contadores
- ContadorLoginSerializer: Autenticação JWT 
- ContadorValidacaoSerializer: Validações real-time

Uso:
    from apps.authentication.serializers import (
        ContadorRegistroSerializer,
        ContadorLoginSerializer,
        ContadorValidacaoSerializer
    )
"""

# Serializers de Autenticação - auth.py
from .auth import (
    ContadorRegistroSerializer,
    ContadorLoginSerializer,        # ← DESCOMENTE ESTA LINHA
    # ContadorValidacaoSerializer,    # Artefato 4 - Em desenvolvimento
)

# Lista de exports públicos
__all__ = [
    # Registro e criação de contas
    'ContadorRegistroSerializer',
    
    # Autenticação e login (Artefato 3)
    'ContadorLoginSerializer',      # ← DESCOMENTE ESTA LINHA
    
    # Validações auxiliares (Artefato 4)  
    # 'ContadorValidacaoSerializer',
]

# Metadados do módulo
__version__ = '2.2.2'
__author__ = 'MultiBPO Team'
__description__ = 'Serializers de autenticação para contadores e escritórios'

# Configurações do módulo
AUTHENTICATION_SERIALIZERS = {
    'registro': 'ContadorRegistroSerializer',
    'login': 'ContadorLoginSerializer',        # Disponível após Artefato 3
    'validacao': 'ContadorValidacaoSerializer', # Disponível após Artefato 4
}

# Verificação de disponibilidade dos serializers
def get_available_serializers():
    """
    Retorna lista de serializers disponíveis no momento
    
    Útil para debugging e verificação de implementação
    """
    available = []
    for name in __all__:
        try:
            globals()[name]
            available.append(name)
        except (NameError, KeyError):
            continue
    return available

# Log de inicialização (apenas em DEBUG)
import logging
logger = logging.getLogger(__name__)

try:
    available_serializers = get_available_serializers()
    logger.debug(f"Authentication serializers carregados: {available_serializers}")
except Exception as e:
    logger.warning(f"Erro ao verificar serializers disponíveis: {e}")