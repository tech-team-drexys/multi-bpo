"""
Serializers para Escritórios Contábeis
MultiBPO Sub-Fase 2.2.1 - Artefato 2A
"""

from rest_framework import serializers
from validate_docbr import CNPJ
from ..models import Escritorio


class EscritorioSerializer(serializers.ModelSerializer):
    """
    Serializer para Escritório Contábil
    
    Usado para:
    - Cadastro e edição de escritórios
    - Listagem completa de dados
    - APIs de gestão empresarial
    """
    
    # Campos calculados
    total_contadores = serializers.SerializerMethodField()
    cnpj_formatado = serializers.SerializerMethodField()
    telefone_formatado = serializers.SerializerMethodField()
    endereco_completo = serializers.SerializerMethodField()
    
    # Campos de escrita customizados
    cnpj = serializers.CharField(max_length=18, write_only=True, required=False)
    
    class Meta:
        model = Escritorio
        fields = [
            'id',
            'razao_social',
            'nome_fantasia',
            'cnpj',
            'cnpj_formatado',
            'regime_tributario',
            'email',
            'telefone',
            'telefone_formatado',
            'whatsapp',
            'website',
            'cep',
            'logradouro',  # ← CORRIGIDO: usar logradouro ao invés de endereco
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'endereco_completo',
            'responsavel_tecnico',
            'crc_responsavel',
            'ativo',
            'observacoes',
            'total_contadores',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_total_contadores(self, obj):
        """
        Retorna quantidade de contadores neste escritório
        """
        try:
            return obj.contadores.filter(ativo=True).count()
        except AttributeError:
            # Se relacionamento não existe ainda, retorna 0
            return 0
    
    def get_cnpj_formatado(self, obj):
        """
        Retorna CNPJ formatado: XX.XXX.XXX/XXXX-XX
        """
        if obj.cnpj:
            cnpj_clean = ''.join(filter(str.isdigit, obj.cnpj))
            if len(cnpj_clean) == 14:
                return f"{cnpj_clean[:2]}.{cnpj_clean[2:5]}.{cnpj_clean[5:8]}/{cnpj_clean[8:12]}-{cnpj_clean[12:14]}"
        return obj.cnpj
    
    def get_telefone_formatado(self, obj):
        """
        Retorna telefone formatado
        """
        if obj.telefone:
            return str(obj.telefone)  # phonenumber_field já formata
        return None
    
    def get_endereco_completo(self, obj):
        """
        Retorna endereço completo formatado
        """
        partes = []
        if obj.logradouro:  # ← CORRIGIDO: usar logradouro
            endereco_base = obj.logradouro
            if obj.numero:
                endereco_base += f", {obj.numero}"
            if obj.complemento:
                endereco_base += f", {obj.complemento}"
            partes.append(endereco_base)
        
        if obj.bairro:
            partes.append(obj.bairro)
        if obj.cidade:
            partes.append(obj.cidade)
        if obj.estado:
            partes.append(obj.estado)
        if obj.cep:
            partes.append(f"CEP: {obj.cep}")
        
        return ", ".join(partes) if partes else None
    
    def validate_cnpj(self, value):
        """
        Validação de CNPJ usando validate-docbr
        """
        if not value:
            return value
            
        # Remove formatação
        cnpj_clean = ''.join(filter(str.isdigit, value))
        
        # Valida usando biblioteca brasileira
        cnpj_validator = CNPJ()
        if not cnpj_validator.validate(cnpj_clean):
            raise serializers.ValidationError(
                "CNPJ inválido. Verifique os números digitados."
            )
        
        # Verifica duplicatas
        if Escritorio.objects.filter(
            cnpj=cnpj_clean
        ).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(
                "Já existe um escritório cadastrado com este CNPJ."
            )
        
        return cnpj_clean
    
    def validate_razao_social(self, value):
        """
        Validação da razão social
        """
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "Razão social deve ter pelo menos 5 caracteres."
            )
        return value.strip().title()
    
    def validate_email(self, value):
        """
        Validação de email único
        """
        if Escritorio.objects.filter(
            email__iexact=value
        ).exclude(pk=self.instance.pk if self.instance else None).exists():
            raise serializers.ValidationError(
                "Já existe um escritório cadastrado com este email."
            )
        return value.lower()
    
    def validate_cep(self, value):
        """
        Validação básica de CEP brasileiro
        """
        if value:
            cep_clean = ''.join(filter(str.isdigit, value))
            if len(cep_clean) != 8:
                raise serializers.ValidationError(
                    "CEP deve ter 8 dígitos."
                )
            return cep_clean
        return value


class EscritorioResumoSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para Escritório
    
    Usado para:
    - Listagens rápidas
    - Seleção em formulários
    - APIs com muitos dados
    """
    
    total_contadores = serializers.SerializerMethodField()
    
    class Meta:
        model = Escritorio
        fields = [
            'id',
            'nome_fantasia',
            'razao_social',
            'cidade',
            'estado',
            'total_contadores',
            'ativo'
        ]
        read_only_fields = ['id']
    
    def get_total_contadores(self, obj):
        """Total de contadores ativos"""
        try:
            return obj.contadores.filter(ativo=True).count()
        except AttributeError:
            return 0