"""
Serializers para Contador - Adaptado para Novo Fluxo BPO
MultiBPO Sub-Fase 2.2.3 - Compatibilidade Total + Novos Campos

Implementa ContadorPerfilSerializer e ContadorResumoSerializer
ADAPTADOS para suportar tipo_pessoa, documento, servicos_contratados
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from apps.contadores.models import Contador, Escritorio, Especialidade


class ContadorPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer completo para perfil do Contador
    ADAPTADO para funcionar com novos campos BPO
    
    Usado para:
    - Visualização de perfil completo
    - Edição de dados pessoais
    - Dashboards detalhados
    - APIs de detalhamento
    - NOVO: Clientes BPO (pessoa física/jurídica)
    
    Read-only: Dados sensíveis protegidos
    Compatibilidade: 100% com dados existentes
    """
    
    # Campos do User relacionado (mantidos)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    last_login = serializers.DateTimeField(source='user.last_login', read_only=True)
    
    # Campos calculados (adaptados para novos campos)
    nome_completo_user = serializers.SerializerMethodField()
    escritorio_detalhes = serializers.SerializerMethodField()
    especialidades_detalhes = serializers.SerializerMethodField()
    status_completo = serializers.SerializerMethodField()
    tempo_experiencia = serializers.SerializerMethodField()
    
    # Campos formatados (adaptados + novos)
    cpf_formatado = serializers.SerializerMethodField()  # Mantido para compatibilidade
    documento_formatado = serializers.SerializerMethodField()  # NOVO
    telefone_formatado = serializers.SerializerMethodField()
    
    # NOVOS campos para fluxo BPO
    tipo_cliente = serializers.SerializerMethodField()
    servicos_bpo_detalhes = serializers.SerializerMethodField()
    
    class Meta:
        model = Contador
        fields = [
            # IDs
            'id',
            
            # Dados do User
            'username', 'email', 'first_name', 'last_name', 'is_active', 'last_login',
            
            # NOVOS campos principais BPO
            'tipo_pessoa',           # NOVO: 'fisica' ou 'juridica'
            'documento',             # NOVO: CPF ou CNPJ unificado
            'documento_formatado',   # NOVO: documento formatado
            
            # Dados pessoais (mantidos para compatibilidade)
            'nome_completo',
            'nome_completo_user',
            'cpf',                   # Mantido para compatibilidade
            'cpf_formatado',         # Mantido para compatibilidade
            'data_nascimento',
            
            # Dados profissionais (agora opcionais para clientes BPO)
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
            
            # Formação (opcional)
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
            'especialidades_detalhes',    # DEPRECATED para clientes BPO
            
            # NOVOS campos BPO
            'servicos_contratados',       # NOVO: JSON com serviços BPO
            'servicos_bpo_detalhes',      # NOVO: detalhes dos serviços
            'dados_receita_federal',      # NOVO: dados automáticos RF (read-only)
            'tipo_cliente',               # NOVO: tipo calculado
            
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
            'is_active', 'last_login', 'dados_receita_federal'
        ]
    
    def get_nome_completo_user(self, obj):
        """Nome completo do User Django (mantido)"""
        first_name = obj.user.first_name.strip()
        last_name = obj.user.last_name.strip()
        
        if first_name and last_name:
            return f"{first_name} {last_name}"
        elif obj.nome_completo:
            return obj.nome_completo
        else:
            return obj.user.username
    
    def get_escritorio_detalhes(self, obj):
        """Detalhes básicos do escritório (adaptado para criação automática)"""
        if obj.escritorio:
            detalhes = {
                'id': obj.escritorio.id,
                'nome_fantasia': obj.escritorio.nome_fantasia,
                'razao_social': obj.escritorio.razao_social,
                'cnpj': obj.escritorio.cnpj,
                'cidade': obj.escritorio.cidade,
                'estado': obj.escritorio.estado,
                'ativo': obj.escritorio.ativo,
                # NOVOS campos
                'criado_automaticamente': getattr(obj.escritorio, 'criado_automaticamente', False),
                'situacao_cadastral': getattr(obj.escritorio, 'situacao_cadastral', None),
            }
            return detalhes
        return None
    
    def get_especialidades_detalhes(self, obj):
        """Lista detalhada de especialidades (DEPRECATED para clientes BPO)"""
        try:
            especialidades = obj.especialidades.filter(ativa=True)
            result = [
                {
                    'id': esp.id,
                    'nome': esp.nome,
                    'codigo': esp.codigo,
                    'area_principal': esp.area_principal,
                    'requer_certificacao': esp.requer_certificacao
                }
                for esp in especialidades
            ]
            
            # Adicionar aviso de depreciação para clientes BPO
            tipo_pessoa = getattr(obj, 'tipo_pessoa', None)
            if tipo_pessoa and obj.cargo == 'cliente_bpo':
                return {
                    'deprecated_warning': 'Especialidades não se aplicam a clientes BPO. Use servicos_contratados.',
                    'especialidades': result,
                    'use_instead': 'servicos_contratados'
                }
            
            return result
            
        except AttributeError:
            # Relacionamento não existe
            return []
    
    def get_status_completo(self, obj):
        """Status detalhado (adaptado para clientes BPO)"""
        status = {
            'ativo': obj.ativo and obj.user.is_active,
            'tem_escritorio': bool(obj.escritorio),
            'tem_especialidades': False,  # Para contadores
            'tem_servicos_bpo': False,    # NOVO: Para clientes BPO
            'pode_trabalhar': False,
            'tipo_conta': 'indefinido',
            'descricao': ''
        }
        
        # Verificar especialidades (contadores tradicionais)
        try:
            status['tem_especialidades'] = obj.especialidades.exists()
        except AttributeError:
            pass
        
        # Verificar serviços BPO (NOVO)
        servicos = getattr(obj, 'servicos_contratados', None)
        if servicos:
            status['tem_servicos_bpo'] = len(servicos) > 0
        
        # Determinar tipo de conta
        if obj.crc:
            status['tipo_conta'] = 'contador_profissional'
        elif getattr(obj, 'tipo_pessoa', None) == 'juridica':
            status['tipo_conta'] = 'empresa_cliente'
        elif getattr(obj, 'tipo_pessoa', None) == 'fisica':
            status['tipo_conta'] = 'pessoa_fisica_cliente'
        else:
            status['tipo_conta'] = 'legado'  # Dados antigos
        
        # Lógica de status adaptada
        if not obj.user.is_active:
            status['descricao'] = 'Usuário inativo'
        elif not obj.ativo:
            status['descricao'] = 'Contador inativo'
        elif status['tipo_conta'] == 'contador_profissional':
            # Lógica original para contadores
            if not obj.escritorio:
                status['descricao'] = 'Sem escritório vinculado'
            elif not status['tem_especialidades']:
                status['descricao'] = 'Sem especialidades cadastradas'
            else:
                status['pode_trabalhar'] = True
                status['descricao'] = 'Contador ativo e operacional'
        elif status['tipo_conta'] in ['empresa_cliente', 'pessoa_fisica_cliente']:
            # NOVA lógica para clientes BPO
            if status['tem_servicos_bpo']:
                status['pode_trabalhar'] = True
                status['descricao'] = 'Cliente BPO ativo com serviços contratados'
            else:
                status['descricao'] = 'Cliente BPO sem serviços contratados'
        else:
            # Fallback para dados legados
            status['pode_trabalhar'] = True
            status['descricao'] = 'Conta legada - funcionando'
            
        return status
    
    def get_tempo_experiencia(self, obj):
        """Tempo de experiência baseado na data de registro CRC (mantido)"""
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
        """CPF formatado (mantido para compatibilidade)"""
        if obj.cpf:
            return obj.cpf
        # Fallback para documento se for CPF
        elif hasattr(obj, 'documento') and obj.documento:
            tipo_pessoa = getattr(obj, 'tipo_pessoa', 'fisica')
            if tipo_pessoa == 'fisica':
                return obj.documento
        return None
    
    def get_documento_formatado(self, obj):
        """Documento principal formatado (NOVO)"""
        if hasattr(obj, 'documento') and obj.documento:
            return obj.documento
        elif obj.cpf:
            # Fallback para CPF antigo
            return obj.cpf
        return None
    
    def get_telefone_formatado(self, obj):
        """Telefone formatado (mantido)"""
        return str(obj.telefone_pessoal) if obj.telefone_pessoal else None
    
    def get_tipo_cliente(self, obj):
        """Tipo de cliente baseado nos novos campos (NOVO)"""
        if obj.crc:
            return "Contador Profissional"
        elif hasattr(obj, 'tipo_pessoa'):
            tipo = getattr(obj, 'tipo_pessoa', 'fisica')
            if tipo == 'juridica':
                return "Empresa Cliente"
            else:
                return "Pessoa Física Cliente"
        else:
            # Fallback para dados antigos
            return "Cliente Legado"
    
    def get_servicos_bpo_detalhes(self, obj):
        """Detalhes dos serviços BPO contratados (NOVO)"""
        servicos = getattr(obj, 'servicos_contratados', None)
        if not servicos:
            return {
                'total': 0,
                'ativos': 0,
                'servicos': [],
                'ultimo_update': None
            }
        
        # Processar lista de serviços
        servicos_ativos = [s for s in servicos if s.get('ativo', True)]
        
        return {
            'total': len(servicos),
            'ativos': len(servicos_ativos),
            'servicos': servicos_ativos,
            'categorias': list(set(s.get('categoria', 'geral') for s in servicos_ativos)),
            'valor_total_mensal': sum(s.get('valor_mensal', 0) for s in servicos_ativos),
            'ultimo_update': max((s.get('contratado_em') for s in servicos if s.get('contratado_em')), default=None)
        }


class ContadorResumoSerializer(serializers.ModelSerializer):
    """
    Serializer resumido para Contador
    ADAPTADO para incluir novos campos BPO essenciais
    
    Usado para:
    - Listagens de contadores
    - Dropdowns e seleções  
    - APIs com muitos registros
    - Buscas rápidas
    - NOVO: Listagens mistas (contadores + clientes BPO)
    
    Performance otimizada com apenas campos essenciais
    """
    
    # Campos calculados essenciais (adaptados)
    nome_completo = serializers.SerializerMethodField()
    escritorio_nome = serializers.CharField(source='escritorio.nome_fantasia', read_only=True)
    total_especialidades = serializers.SerializerMethodField()   # DEPRECATED
    total_servicos_bpo = serializers.SerializerMethodField()     # NOVO
    status = serializers.SerializerMethodField()
    documento_principal = serializers.SerializerMethodField()    # NOVO
    tipo_cliente = serializers.SerializerMethodField()          # NOVO
    
    # Acesso direto ao email do User
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Contador
        fields = [
            'id',
            'nome_completo',
            
            # NOVOS campos BPO
            'tipo_pessoa',              # NOVO
            'documento_principal',      # NOVO
            'tipo_cliente',             # NOVO
            'total_servicos_bpo',       # NOVO
            
            # Campos mantidos para compatibilidade
            'crc',                      # Mantido (opcional para clientes BPO)
            'email',
            'escritorio_nome',
            'total_especialidades',     # DEPRECATED mas mantido
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_nome_completo(self, obj):
        """
        Nome completo baseado no User (mantido)
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
    
    def get_documento_principal(self, obj):
        """Documento principal (NOVO)"""
        if hasattr(obj, 'documento') and obj.documento:
            return obj.documento
        elif obj.cpf:
            # Fallback para CPF antigo
            return obj.cpf
        return None
    
    def get_tipo_cliente(self, obj):
        """Tipo de cliente simplificado (NOVO)"""
        if obj.crc:
            return "Contador"
        elif hasattr(obj, 'tipo_pessoa'):
            tipo = getattr(obj, 'tipo_pessoa', 'fisica')
            return "Empresa" if tipo == 'juridica' else "Pessoa Física"
        else:
            return "Legado"
    
    def get_total_especialidades(self, obj):
        """
        Quantidade de especialidades ativas (DEPRECATED)
        Mantido para compatibilidade com sistemas antigos
        """
        try:
            count = obj.especialidades.filter(ativa=True).count()
            # Adicionar aviso se for cliente BPO
            if hasattr(obj, 'tipo_pessoa') and not obj.crc:
                return {
                    'count': count,
                    'deprecated': True,
                    'message': 'Use total_servicos_bpo para clientes BPO'
                }
            return count
        except AttributeError:
            return 0
    
    def get_total_servicos_bpo(self, obj):
        """Quantidade de serviços BPO ativos (NOVO)"""
        servicos = getattr(obj, 'servicos_contratados', None)
        if not servicos:
            return 0
        
        # Contar apenas serviços ativos
        return len([s for s in servicos if s.get('ativo', True)])
    
    def get_status(self, obj):
        """
        Status consolidado (adaptado para BPO)
        
        Retorna:
        - 'inativo': User não está ativo
        - 'contador_ativo': Contador profissional ativo
        - 'contador_pendente': Contador sem especialidades
        - 'cliente_bpo_ativo': Cliente BPO com serviços
        - 'cliente_bpo_pendente': Cliente BPO sem serviços
        - 'sem_escritorio': Não vinculado a escritório
        - 'legado': Dados antigos sem classificação clara
        """
        if not obj.user.is_active:
            return 'inativo'
        
        # Verificar se é contador profissional
        if obj.crc:
            if obj.especialidades.count() == 0:
                return 'contador_pendente'
            elif not obj.escritorio:
                return 'sem_escritorio'
            else:
                return 'contador_ativo'
        
        # Verificar se é cliente BPO
        elif hasattr(obj, 'tipo_pessoa'):
            servicos = getattr(obj, 'servicos_contratados', None)
            if servicos and len([s for s in servicos if s.get('ativo', True)]) > 0:
                return 'cliente_bpo_ativo'
            else:
                return 'cliente_bpo_pendente'
        
        # Fallback para dados legados
        else:
            if obj.especialidades.count() == 0:
                return 'legado_pendente'
            elif not obj.escritorio:
                return 'sem_escritorio'
            else:
                return 'legado_ativo'