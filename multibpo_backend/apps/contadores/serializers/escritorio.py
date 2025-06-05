"""
Serializers para Escritórios Contábeis - Adaptado para Novo Fluxo BPO
MultiBPO Sub-Fase 2.2.3 - Compatibilidade Total + Criação Automática

ADAPTAÇÕES CORRIGIDAS:
- Suporte para criação automática via CNPJ + Receita Federal
- Novos campos: situacao_cadastral, criado_automaticamente, dados_receita_federal
- Compatibilidade 100% com escritórios criados manualmente
- Imports corrigidos e métodos completos
"""

from rest_framework import serializers
from validate_docbr import CNPJ
from django.utils import timezone
from datetime import datetime, timedelta
from apps.contadores.models import Escritorio


class EscritorioSerializer(serializers.ModelSerializer):
    """
    Serializer para Escritório Contábil
    ADAPTADO para suportar criação automática via Receita Federal
    
    Usado para:
    - Cadastro e edição de escritórios (manual)
    - Listagem completa de dados
    - APIs de gestão empresarial
    - NOVO: Criação automática via CNPJ + dados RF
    """
    
    # Campos calculados (mantidos + novos)
    total_contadores = serializers.SerializerMethodField()
    cnpj_formatado = serializers.SerializerMethodField()
    telefone_formatado = serializers.SerializerMethodField()
    endereco_completo = serializers.SerializerMethodField()
    
    # NOVOS campos calculados
    situacao_display = serializers.SerializerMethodField()
    origem_dados = serializers.SerializerMethodField()
    dados_receita_resumo = serializers.SerializerMethodField()
    
    class Meta:
        model = Escritorio
        fields = [
            'id',
            
            # Dados empresariais básicos (mantidos)
            'razao_social',
            'nome_fantasia',
            'cnpj',
            'cnpj_formatado',
            'regime_tributario',
            
            # NOVOS campos de status (opcionais)
            'situacao_cadastral',      # NOVO: situação na RF
            'situacao_display',        # NOVO: situação formatada
            
            # Contato (mantidos)
            'email',
            'telefone',
            'telefone_formatado',
            'whatsapp',
            'website',
            
            # Endereço (mantidos)
            'cep',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'endereco_completo',
            
            # Responsável técnico (mantidos)
            'responsavel_tecnico',
            'crc_responsavel',
            
            # NOVOS campos de origem e automação (opcionais)
            'criado_automaticamente',  # NOVO: criado via RF ou manual
            'dados_receita_federal',   # NOVO: JSON com dados completos RF
            'origem_dados',            # NOVO: origem dos dados (calculado)
            'dados_receita_resumo',    # NOVO: resumo dos dados RF
            
            # Status e controle (mantidos)
            'ativo',
            'observacoes',
            
            # Relacionamentos (mantidos)
            'total_contadores',
            
            # Timestamps (mantidos)
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 
            'dados_receita_federal',  # NOVO: apenas leitura
        ]
    
    def get_total_contadores(self, obj):
        """
        Quantidade de contadores neste escritório (mantido)
        """
        try:
            return obj.contadores.filter(ativo=True).count()
        except AttributeError:
            # Se relacionamento não existe ainda, retorna 0
            return 0
    
    def get_cnpj_formatado(self, obj):
        """
        CNPJ formatado: XX.XXX.XXX/XXXX-XX (mantido)
        """
        if obj.cnpj:
            cnpj_clean = ''.join(filter(str.isdigit, obj.cnpj))
            if len(cnpj_clean) == 14:
                return f"{cnpj_clean[:2]}.{cnpj_clean[2:5]}.{cnpj_clean[5:8]}/{cnpj_clean[8:12]}-{cnpj_clean[12:14]}"
        return obj.cnpj
    
    def get_telefone_formatado(self, obj):
        """
        Telefone formatado (mantido)
        """
        if obj.telefone:
            return str(obj.telefone)  # phonenumber_field já formata
        return None
    
    def get_endereco_completo(self, obj):
        """
        Endereço completo formatado (mantido)
        """
        partes = []
        if obj.logradouro:
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
    
    def get_situacao_display(self, obj):
        """
        Situação cadastral formatada (NOVO)
        """
        situacao = getattr(obj, 'situacao_cadastral', None)
        if not situacao:
            return "Não informado"
        
        # Mapeamento de situações da RF
        situacoes_map = {
            'ativa': 'Ativa',
            'suspensa': 'Suspensa',
            'inapta': 'Inapta',
            'baixada': 'Baixada',
            'nula': 'Nula',
        }
        
        return situacoes_map.get(situacao.lower(), situacao.title())
    
    def get_origem_dados(self, obj):
        """
        Origem dos dados do escritório (NOVO - simplificado)
        """
        criado_auto = getattr(obj, 'criado_automaticamente', False)
        dados_rf = getattr(obj, 'dados_receita_federal', None)
        
        if criado_auto:
            fonte = 'Receita Federal' if dados_rf else 'Sistema'
            return {
                'tipo': 'automatico',
                'fonte': fonte,
                'descricao': f'Criado automaticamente via {fonte}'
            }
        else:
            return {
                'tipo': 'manual',
                'fonte': 'Usuário',
                'descricao': 'Cadastrado manualmente'
            }
    
    def get_dados_receita_resumo(self, obj):
        """
        Resumo dos dados da Receita Federal (NOVO - simplificado)
        """
        dados_rf = getattr(obj, 'dados_receita_federal', None)
        if not dados_rf:
            return None
        
        return {
            'tem_dados_rf': True,
            'fonte_api': dados_rf.get('fonte_api', 'Receita Federal'),
            'situacao_rf': dados_rf.get('situacao'),
            'atividade_principal': dados_rf.get('atividade_principal', {}).get('text') if isinstance(dados_rf.get('atividade_principal'), dict) else dados_rf.get('atividade_principal'),
            'endereco_completo': bool(dados_rf.get('endereco')),
            'contato_atualizado': bool(dados_rf.get('telefone') or dados_rf.get('email')),
        }
    
    def validate_cnpj(self, value):
        """
        Validação de CNPJ usando validate-docbr (mantida + corrigida)
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
        
        # Verificar duplicatas (adaptado para criação automática)
        existing_escritorio = Escritorio.objects.filter(
            cnpj=cnpj_clean
        ).exclude(pk=self.instance.pk if self.instance else None)
        
        if existing_escritorio.exists():
            existing = existing_escritorio.first()
            criado_auto = getattr(existing, 'criado_automaticamente', False)
            
            if criado_auto:
                raise serializers.ValidationError(
                    f"CNPJ já cadastrado automaticamente. Use o escritório existente ou entre em contato com o suporte."
                )
            else:
                raise serializers.ValidationError(
                    "Já existe um escritório cadastrado com este CNPJ."
                )
        
        return cnpj_clean
    
    def validate_razao_social(self, value):
        """
        Validação da razão social (mantida)
        """
        if not value:
            return value
            
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "Razão social deve ter pelo menos 5 caracteres."
            )
        return value.strip().title()
    
    def validate_email(self, value):
        """
        Validação de email único (adaptada - mais permissiva)
        """
        if not value:
            return value
            
        # Verificar duplicatas (mais permissivo para criação automática)
        existing_escritorio = Escritorio.objects.filter(
            email__iexact=value
        ).exclude(pk=self.instance.pk if self.instance else None)
        
        if existing_escritorio.exists():
            existing = existing_escritorio.first()
            criado_auto = getattr(existing, 'criado_automaticamente', False)
            
            # Se foi criado automaticamente, permitir em alguns casos
            if not criado_auto:
                raise serializers.ValidationError(
                    "Já existe um escritório cadastrado com este email."
                )
        
        return value.lower()
    
    def validate_cep(self, value):
        """
        Validação básica de CEP brasileiro (mantida)
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
    ADAPTADO com informações de origem e status RF (simplificado)
    
    Usado para:
    - Listagens rápidas
    - Seleção em formulários
    - APIs com muitos dados
    - NOVO: Listagens mistas (manuais + automáticos)
    """
    
    total_contadores = serializers.SerializerMethodField()
    origem = serializers.SerializerMethodField()              # NOVO
    situacao_rf = serializers.SerializerMethodField()         # NOVO
    
    class Meta:
        model = Escritorio
        fields = [
            'id',
            'nome_fantasia',
            'razao_social',
            'cnpj',
            'cidade',
            'estado',
            
            # NOVOS campos (opcionais)
            'situacao_cadastral',        # NOVO: situação na RF
            'criado_automaticamente',    # NOVO: flag de criação
            'origem',                    # NOVO: origem simplificada
            'situacao_rf',               # NOVO: status RF simplificado
            
            # Campos mantidos
            'total_contadores',
            'ativo'
        ]
        read_only_fields = ['id']
    
    def get_total_contadores(self, obj):
        """Total de contadores ativos (mantido)"""
        try:
            return obj.contadores.filter(ativo=True).count()
        except AttributeError:
            return 0
    
    def get_origem(self, obj):
        """Origem simplificada (NOVO)"""
        criado_auto = getattr(obj, 'criado_automaticamente', False)
        return "Automático" if criado_auto else "Manual"
    
    def get_situacao_rf(self, obj):
        """Status na Receita Federal simplificado (NOVO)"""
        situacao = getattr(obj, 'situacao_cadastral', None)
        if not situacao:
            return "Não consultado"
        
        # Simplificar status com emojis
        situacao_lower = situacao.lower()
        if situacao_lower == 'ativa':
            return "✅ Ativa"
        elif situacao_lower in ['suspensa', 'inapta']:
            return "⚠️ Irregular"
        elif situacao_lower in ['baixada', 'nula']:
            return "❌ Inativa"
        else:
            return f"ℹ️ {situacao.title()}"


class EscritorioCreateAutoSerializer(serializers.ModelSerializer):
    """
    Serializer especializado para criação automática via Receita Federal (NOVO)
    
    Usado especificamente para:
    - Criação automática via CNPJ + dados RF
    - APIs de integração com Receita Federal
    - Processamento de dados externos
    
    Validações mais flexíveis para dados automáticos
    """
    
    # Dados obrigatórios mínimos
    cnpj = serializers.CharField(max_length=18, required=True)
    razao_social = serializers.CharField(max_length=200, required=True)
    
    # Campos automáticos
    criado_automaticamente = serializers.BooleanField(default=True)
    dados_receita_federal = serializers.JSONField(required=False)
    
    class Meta:
        model = Escritorio
        fields = [
            # Obrigatórios para criação automática
            'cnpj',
            'razao_social',
            'criado_automaticamente',
            
            # Opcionais (preenchidos pelos dados RF)
            'nome_fantasia',
            'situacao_cadastral',
            'email',
            'telefone',
            'whatsapp',
            'website',
            'cep',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'regime_tributario',
            'dados_receita_federal',
            
            # Campos administrativos opcionais
            'responsavel_tecnico',
            'crc_responsavel',
            'observacoes',
            'ativo',
        ]
        
        # Configurações para criação automática
        extra_kwargs = {
            'razao_social': {'required': True},
            'nome_fantasia': {'required': False},
            'email': {'required': False, 'allow_blank': True},
            'telefone': {'required': False},
            'responsavel_tecnico': {'required': False, 'allow_blank': True},
            'crc_responsavel': {'required': False, 'allow_blank': True},
            'ativo': {'default': True},
            'observacoes': {'required': False, 'allow_blank': True},
        }
    
    def validate_cnpj(self, value):
        """
        Validação de CNPJ para criação automática (mais permissiva)
        """
        cnpj_clean = ''.join(filter(str.isdigit, value))
        
        cnpj_validator = CNPJ()
        if not cnpj_validator.validate(cnpj_clean):
            raise serializers.ValidationError("CNPJ inválido.")
        
        # Para criação automática, verificar se já existe
        if Escritorio.objects.filter(cnpj=cnpj_clean).exists():
            raise serializers.ValidationError("CNPJ já cadastrado.")
        
        return cnpj_clean
    
    def validate_dados_receita_federal(self, value):
        """
        Validação dos dados da Receita Federal (opcional)
        """
        if value and not isinstance(value, dict):
            raise serializers.ValidationError("Dados da RF devem ser um objeto JSON.")
        return value
    
    def validate(self, data):
        """
        Validação para criação automática
        """
        # Garantir que está marcado como criado automaticamente
        data['criado_automaticamente'] = True
        
        # Adicionar timestamp nos dados RF se existirem
        if data.get('dados_receita_federal'):
            dados_rf = data['dados_receita_federal']
            dados_rf['processado_em'] = timezone.now().isoformat()
            data['dados_receita_federal'] = dados_rf
        
        return data
    
    def create(self, validated_data):
        """
        Criação com lógica especial para dados automáticos
        """
        # Log da criação automática
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Criando escritório automaticamente: {validated_data.get('razao_social')} (CNPJ: {validated_data.get('cnpj')})")
        
        return super().create(validated_data)