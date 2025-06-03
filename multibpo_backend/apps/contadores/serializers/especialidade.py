"""
Serializers para Especialidades Contábeis
MultiBPO Sub-Fase 2.2.1 - Artefato 2A
"""

from rest_framework import serializers
from ..models import Especialidade


class EspecialidadeSerializer(serializers.ModelSerializer):
    """
    Serializer para Especialidade Contábil
    
    Usado para:
    - Listagem de especialidades disponíveis
    - Seleção em formulários de cadastro
    - APIs públicas de consulta
    """
    
    # Campos calculados
    total_contadores = serializers.SerializerMethodField()
    area_display = serializers.CharField(source='get_area_principal_display', read_only=True)
    
    class Meta:
        model = Especialidade
        fields = [
            'id',
            'nome',
            'codigo',
            'area_principal',
            'area_display',
            'descricao',
            'requer_certificacao',
            'ativa',
            'total_contadores',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_total_contadores(self, obj):
        """
        Retorna quantidade de contadores com esta especialidade
        """
        # Verifica se existe relacionamento antes de contar
        try:
            return obj.contadores.filter(ativo=True).count()
        except AttributeError:
            # Se não existe o relacionamento ainda, retorna 0
            return 0
    
    def validate_nome(self, value):
        """
        Validação customizada do nome da especialidade
        """
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Nome da especialidade deve ter pelo menos 3 caracteres."
            )
        
        # Verifica duplicatas (case-insensitive)
        if Especialidade.objects.filter(
            nome__iexact=value.strip()
        ).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(
                "Já existe uma especialidade com este nome."
            )
        
        return value.strip().title()
    
    def validate_codigo(self, value):
        """
        Validação do código da especialidade
        """
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Código deve ter pelo menos 2 caracteres."
            )
        
        # Verifica duplicatas
        if Especialidade.objects.filter(
            codigo__iexact=value.strip()
        ).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(
                "Já existe uma especialidade com este código."
            )
        
        return value.strip().upper()
    
    def validate_area_principal(self, value):
        """
        Validação da área principal
        """
        # Áreas válidas (ajustar conforme choices do model)
        areas_validas = ['contabil', 'fiscal', 'trabalhista', 'societario', 'tributario']
        if value not in areas_validas:
            raise serializers.ValidationError(
                f"Área deve ser uma das opções: {', '.join(areas_validas)}"
            )
        return value


class EspecialidadeResumoSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para Especialidade
    
    Usado para:
    - Listagens rápidas
    - Campos de seleção (dropdowns)
    - APIs com muitos dados
    """
    
    class Meta:
        model = Especialidade
        fields = ['id', 'nome', 'codigo', 'area_principal']
        read_only_fields = ['id']