"""
Serializers do App Contadores
MultiBPO Sub-Fase 2.2.1 - COMPLETO ✅

Centraliza todos os serializers para imports simplificados
"""

# Serializers Especialidade
from .especialidade import (
    EspecialidadeSerializer,
    EspecialidadeResumoSerializer,
)

# Serializers Escritório
from .escritorio import (
    EscritorioSerializer,
    EscritorioResumoSerializer,
)

# Serializers Contador - IMPLEMENTADOS NESTE ARTEFATO
from .contador import (
    ContadorPerfilSerializer,
    ContadorResumoSerializer,
)

__all__ = [
    # Especialidade (2 serializers)
    'EspecialidadeSerializer',
    'EspecialidadeResumoSerializer',
    
    # Escritório (2 serializers) 
    'EscritorioSerializer',
    'EscritorioResumoSerializer',
    
    # Contador (2 serializers) - AGORA COMPLETO
    'ContadorPerfilSerializer',
    'ContadorResumoSerializer',
]

# Total: 6 serializers implementados ✅