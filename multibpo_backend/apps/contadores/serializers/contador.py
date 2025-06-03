"""
Serializers para Contador
MultiBPO Sub-Fase 2.2.1 - Artefato Corrigido Completo

Implementa ContadorPerfilSerializer e ContadorResumoSerializer
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from apps.contadores.models import Contador, Escritorio, Especialidade


class ContadorPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer completo para perfil do Contador
    
    Usado para:
    - Visualização de perfil completo
    - Edição de dados pessoais
    - Dashboards detalhados
    - APIs de detalhamento
    
    Read-only: Dados sensíveis protegidos
    """
    
    # Campos do User relacionado
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    last_login = serializers.DateTimeField(source='user.last_login', read_only=True)
    
    # Campos calculados
    nome_completo_user = serializers.SerializerMethodField()
    escritorio_detalhes = serializers.SerializerMethodField()
    especialidades_detalhes = serializers.SerializerMethodField()
    status_completo = serializers.SerializerMethodField()
    tempo_experiencia = serializers.SerializerMethodField()
    
    # Campos formatados
    cpf_formatado = serializers.SerializerMethodField()
    telefone_formatado = serializers.SerializerMethodField()
    
    class Meta:
        model = Contador
        fields = [
            # IDs
            'id',
            
            # Dados do User
            'username',
            'email', 
            'first_name',
            'last_name',
            'is_active',
            'last_login',
            
            # Dados pessoais
            'nome_completo',
            'nome_completo_user',
            'cpf',
            'cpf_formatado',
            'data_nascimento',
            
            # Dados profissionais
            'crc',
            'crc_estado',
            'data_registro_crc',
            'categoria_crc',
            
            # Contato
            'telefone_pessoal',
            'telefone_formatado',
            'whatsapp_pessoal',
            'email_pessoal',
            
            # Cargo e responsabilidades
            'cargo',
            'eh_responsavel_tecnico',
            'pode_assinar_documentos',
            
            # Formação
            'formacao',
            'pos_graduacao',
            'certificacoes',
            
            # Status
            'ativo',
            'data_admissao',
            'data_demissao',
            'observacoes',
            
            # Relacionamentos
            'escritorio_detalhes',
            'especialidades_detalhes',
            
            # Campos calculados
            'status_completo',
            'tempo_experiencia',
            
            # Timestamps
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'username', 'email', 'first_name', 'last_name',
            'is_active', 'last_login'
        ]
    
    def get_nome_completo_user(self, obj):
        """Nome completo do User Django"""
        first_name = obj.user.first_name.strip()
        last_name = obj.user.last_name.strip()
        
        if first_name and last_name:
            return f"{first_name} {last_name}"
        elif obj.nome_completo:
            return obj.nome_completo
        else:
            return obj.user.username
    
    def get_escritorio_detalhes(self, obj):
        """Detalhes básicos do escritório"""
        if obj.escritorio:
            return {
                'id': obj.escritorio.id,
                'nome_fantasia': obj.escritorio.nome_fantasia,
                'razao_social': obj.escritorio.razao_social,
                'cnpj': obj.escritorio.cnpj,
                'cidade': obj.escritorio.cidade,
                'estado': obj.escritorio.estado,
                'ativo': obj.escritorio.ativo
            }
        return None
    
    def get_especialidades_detalhes(self, obj):
        """Lista detalhada de especialidades"""
        especialidades = obj.especialidades.filter(ativa=True)
        return [
            {
                'id': esp.id,
                'nome': esp.nome,
                'codigo': esp.codigo,
                'area_principal': esp.area_principal,
                'requer_certificacao': esp.requer_certificacao
            }
            for esp in especialidades
        ]
    
    def get_status_completo(self, obj):
        """Status detalhado do contador"""
        status = {
            'ativo': obj.ativo and obj.user.is_active,
            'tem_escritorio': bool(obj.escritorio),
            'tem_especialidades': obj.especialidades.exists(),
            'pode_trabalhar': False,
            'descricao': ''
        }
        
        if not obj.user.is_active:
            status['descricao'] = 'Usuário inativo'
        elif not obj.ativo:
            status['descricao'] = 'Contador inativo'
        elif not obj.escritorio:
            status['descricao'] = 'Sem escritório vinculado'
        elif not obj.especialidades.exists():
            status['descricao'] = 'Sem especialidades cadastradas'
        else:
            status['pode_trabalhar'] = True
            status['descricao'] = 'Ativo e operacional'
            
        return status
    
    def get_tempo_experiencia(self, obj):
        """Tempo de experiência baseado na data de registro CRC"""
        if obj.data_registro_crc:
            from datetime import date
            hoje = date.today()
            anos = (hoje - obj.data_registro_crc).days // 365
            
            if anos == 0:
                return "Menos de 1 ano"
            elif anos == 1:
                return "1 ano"
            else:
                return f"{anos} anos"
        return "Não informado"
    
    def get_cpf_formatado(self, obj):
        """CPF já formatado no model"""
        return obj.cpf
    
    def get_telefone_formatado(self, obj):
        """Telefone formatado"""
        return str(obj.telefone_pessoal) if obj.telefone_pessoal else None


class ContadorResumoSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para Contador
    
    Usado para:
    - Listagens de contadores
    - Dropdowns e seleções  
    - APIs com muitos registros
    - Buscas rápidas
    
    Performance otimizada com apenas campos essenciais
    """
    
    # Campos calculados essenciais
    nome_completo = serializers.SerializerMethodField()
    escritorio_nome = serializers.CharField(source='escritorio.nome_fantasia', read_only=True)
    total_especialidades = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    # Acesso direto ao email do User
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Contador
        fields = [
            'id',
            'nome_completo',
            'crc', 
            'email',
            'escritorio_nome',
            'total_especialidades',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_nome_completo(self, obj):
        """
        Retorna nome completo do contador baseado no User
        Fallback para nome_completo do model se User não tiver first/last name
        """
        first_name = obj.user.first_name.strip()
        last_name = obj.user.last_name.strip()
        
        if first_name and last_name:
            return f"{first_name} {last_name}"
        elif first_name:
            return first_name
        elif last_name:
            return last_name
        elif obj.nome_completo:
            return obj.nome_completo
        else:
            return obj.user.username
    
    def get_total_especialidades(self, obj):
        """
        Retorna quantidade de especialidades ativas do contador
        """
        return obj.especialidades.filter(ativa=True).count()
    
    def get_status(self, obj):
        """
        Retorna status consolidado do contador
        
        Retorna:
        - 'inativo': User não está ativo
        - 'pendente': Sem especialidades cadastradas
        - 'sem_escritorio': Não vinculado a escritório
        - 'ativo': Funcionando normalmente
        """
        if not obj.user.is_active:
            return 'inativo'
        elif obj.especialidades.count() == 0:
            return 'pendente'
        elif not obj.escritorio:
            return 'sem_escritorio'
        else:
            return 'ativo'