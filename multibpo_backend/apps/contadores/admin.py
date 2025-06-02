from django.contrib import admin
from django.utils.html import format_html
from .models import Escritorio, Especialidade, Contador

# Customização do cabeçalho do Django Admin
admin.site.site_header = "MultiBPO - Administração Contábil"
admin.site.site_title = "MultiBPO Admin"
admin.site.index_title = "Gestão de Escritórios e Contadores"

# Inline para Especialidades do Contador
class ContadorEspecialidadeInline(admin.TabularInline):
    model = Contador.especialidades.through
    extra = 1
    verbose_name = "Especialidade"
    verbose_name_plural = "Especialidades do Contador"

# Admin para Escritorio - VERSÃO MELHORADA
@admin.register(Escritorio)
class EscritorioAdmin(admin.ModelAdmin):
    """
    Interface administrativa para gestão de escritórios contábeis
    """
    
    # Campos exibidos na listagem principal
    list_display = [
        'razao_social_display',
        'nome_fantasia', 
        'cnpj_formatado',
        'cidade_estado',
        'regime_tributario',
        'responsavel_tecnico',
        'ativo',
        'created_at_display'
    ]
    
    # Filtros laterais para navegação
    list_filter = [
        'regime_tributario',
        'estado',
        'ativo',
        'created_at',
    ]
    
    # Campos de busca (múltiplos campos)
    search_fields = [
        'razao_social',
        'nome_fantasia', 
        'cnpj',
        'responsavel_tecnico',
        'email',
        'cidade'
    ]
    
    # Navegação hierárquica por data
    date_hierarchy = 'created_at'
    
    # Campos editáveis diretamente na listagem
    list_editable = ['ativo']
    
    # Configurações de paginação e ordenação
    list_per_page = 25
    ordering = ['razao_social']
    
    # Organização dos campos no formulário com fieldsets
    fieldsets = (
        ('📊 Dados Empresariais', {
            'fields': ('razao_social', 'nome_fantasia', 'cnpj', 'regime_tributario'),
            'description': 'Informações básicas do escritório contábil'
        }),
        ('📍 Endereço Completo', {
            'fields': (
                ('cep', 'estado'),
                'logradouro',
                ('numero', 'complemento'),
                ('bairro', 'cidade')
            ),
            'classes': ('collapse',),
            'description': 'Endereço completo do escritório'
        }),
        ('📞 Dados de Contato', {
            'fields': (
                ('telefone', 'whatsapp'),
                ('email', 'website')
            ),
            'description': 'Formas de contato com o escritório'
        }),
        ('👨‍💼 Responsável Técnico', {
            'fields': ('responsavel_tecnico', 'crc_responsavel'),
            'description': 'Contador responsável técnico pelo escritório'
        }),
        ('⚙️ Controle e Status', {
            'fields': ('ativo', 'observacoes'),
            'classes': ('collapse',)
        }),
        ('📅 Informações do Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    # Campos somente leitura
    readonly_fields = ['created_at', 'updated_at']
    
    # Métodos customizados para exibição formatada
    @admin.display(description='🏢 Razão Social', ordering='razao_social')
    def razao_social_display(self, obj):
        """Exibe razão social com destaque visual"""
        if obj.nome_fantasia and obj.nome_fantasia != obj.razao_social:
            return format_html(
                '<strong>{}</strong><br><small style="color: #666;">{}</small>',
                obj.nome_fantasia,
                obj.razao_social
            )
        return format_html('<strong>{}</strong>', obj.razao_social)
    
    @admin.display(description='📋 CNPJ', ordering='cnpj')
    def cnpj_formatado(self, obj):
        """Exibe CNPJ com formatação visual destacada"""
        return format_html(
            '<code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">{}</code>',
            obj.cnpj
        )
    
    @admin.display(description='📍 Localização', ordering='cidade')
    def cidade_estado(self, obj):
        """Combina cidade e estado em uma coluna"""
        return format_html(
            '📍 {}/{}',
            obj.cidade, obj.estado
        )
    
    @admin.display(description='✅ Ativo', ordering='ativo', boolean=True)
    def ativo_status(self, obj):
        """Exibe status ativo como ícone booleano"""
        return obj.ativo
    
    @admin.display(description='📅 Criado em', ordering='created_at')
    def created_at_display(self, obj):
        """Exibe data de criação formatada"""
        return obj.created_at.strftime("%d/%m/%Y")
    
    # Ações personalizadas em lote
    actions = ['ativar_escritorios', 'desativar_escritorios']
    
    @admin.action(description='✅ Ativar escritórios selecionados')
    def ativar_escritorios(self, request, queryset):
        """Ativa múltiplos escritórios de uma vez"""
        updated = queryset.update(ativo=True)
        self.message_user(
            request, 
            f'{updated} escritório(s) ativado(s) com sucesso.',
            level='SUCCESS'
        )
    
    @admin.action(description='❌ Desativar escritórios selecionados') 
    def desativar_escritorios(self, request, queryset):
        """Desativa múltiplos escritórios de uma vez"""
        updated = queryset.update(ativo=False)
        self.message_user(
            request, 
            f'{updated} escritório(s) desativado(s) com sucesso.',
            level='WARNING'
        )

# Admin para Contador - VERSÃO MELHORADA
@admin.register(Contador)
class ContadorAdmin(admin.ModelAdmin):
    """
    Interface administrativa para gestão de contadores
    """
    
    list_display = [
        'nome_contador_display', 
        'crc_display', 
        'escritorio_display',
        'cargo',
        'especialidades_count',
        'ativo_status',
        'telefone_pessoal',
        'email_display'
    ]
    
    list_filter = [
        'ativo',
        'escritorio',
        'categoria_crc',
        'cargo',
        'especialidades',
        'eh_responsavel_tecnico'
    ]
    
    search_fields = [
        'nome_completo',
        'crc',
        'cpf',
        'user__username',
        'user__email',
        'user__first_name',
        'user__last_name'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['especialidades']
    
    fieldsets = (
        ('👤 Informações Pessoais', {
            'fields': (
                'user',
                'nome_completo',
                'cpf',
                'data_nascimento'
            )
        }),
        
        ('🏢 Dados Profissionais', {
            'fields': (
                'escritorio',
                ('crc', 'crc_estado'),
                'data_registro_crc',
                'categoria_crc',
                'cargo',
                'especialidades'
            )
        }),
        
        ('📞 Contatos', {
            'fields': (
                'telefone_pessoal',
                'whatsapp_pessoal',
                'email_pessoal'
            )
        }),
        
        ('⚙️ Status e Permissões', {
            'fields': (
                'ativo',
                'eh_responsavel_tecnico',
                'pode_assinar_documentos',
                'observacoes'
            )
        }),
        
        ('📚 Formação', {
            'fields': (
                'formacao',
                'pos_graduacao',
                'certificacoes'
            ),
            'classes': ('collapse',)
        }),
        
        ('📅 Sistema', {
            'fields': (
                'created_at',
                'updated_at'
            ),
            'classes': ('collapse',)
        })
    )
    
    # Métodos de display customizados
    @admin.display(description='👤 Contador', ordering='nome_completo')
    def nome_contador_display(self, obj):
        """Exibe nome do contador com status visual"""
        icon = "✅" if obj.ativo else "❌"
        nome = obj.nome_completo or f"{obj.user.first_name} {obj.user.last_name}".strip()
        if not nome:
            nome = obj.user.username
        return format_html('{} <strong>{}</strong>', icon, nome)
    
    @admin.display(description='📋 CRC', ordering='crc')
    def crc_display(self, obj):
        """Exibe CRC formatado"""
        if obj.crc:
            return format_html(
                '<code style="background: #e3f2fd; padding: 2px 4px; border-radius: 3px;">{}</code>',
                obj.crc
            )
        return "❌ Não informado"
    
    @admin.display(description='🏢 Escritório', ordering='escritorio__razao_social')
    def escritorio_display(self, obj):
        """Exibe escritório com link"""
        if obj.escritorio:
            return format_html(
                '🏢 {}',
                obj.escritorio.nome_fantasia or obj.escritorio.razao_social
            )
        return "❌ Sem escritório"
    
    @admin.display(description='📚 Especialidades')
    def especialidades_count(self, obj):
        """Conta especialidades do contador"""
        count = obj.especialidades.count()
        if count > 0:
            return format_html('📚 {} especialidade(s)', count)
        return "❌ Nenhuma"
    
    @admin.display(description='✅ Ativo', ordering='ativo', boolean=True)
    def ativo_status(self, obj):
        """Status ativo do contador"""
        return obj.ativo
    
    @admin.display(description='📧 Email', ordering='user__email')
    def email_display(self, obj):
        """Email do contador"""
        return obj.email_pessoal or obj.user.email or "Não informado"
    
    # Ações em lote
    actions = ['ativar_contadores', 'desativar_contadores', 'aprovar_como_responsavel']
    
    @admin.action(description='✅ Ativar contadores selecionados')
    def ativar_contadores(self, request, queryset):
        updated = queryset.update(ativo=True)
        self.message_user(request, f'{updated} contador(es) ativado(s).', level='SUCCESS')
    
    @admin.action(description='❌ Desativar contadores selecionados')
    def desativar_contadores(self, request, queryset):
        updated = queryset.update(ativo=False)
        self.message_user(request, f'{updated} contador(es) desativado(s).', level='WARNING')
    
    @admin.action(description='👨‍💼 Marcar como responsável técnico')
    def aprovar_como_responsavel(self, request, queryset):
        updated = queryset.update(eh_responsavel_tecnico=True, pode_assinar_documentos=True)
        self.message_user(request, f'{updated} contador(es) aprovado(s) como responsável técnico.', level='SUCCESS')

# Admin para Especialidade - VERSÃO AVANÇADA CORRIGIDA
@admin.register(Especialidade)
class EspecialidadeAdmin(admin.ModelAdmin):
    """
    Interface administrativa para gestão de especialidades contábeis
    """
    
    # Campos exibidos na listagem principal
    list_display = [
        'nome_especialidade_display',
        'codigo_display', 
        'area_principal_display',
        'certificacao_display',
        'contadores_vinculados',
        'ativa',  # ← CORRIGIDO: usar campo original para list_editable
        'created_at_display'
    ]
    
    # Filtros laterais organizados por relevância
    list_filter = [
        'area_principal',
        'requer_certificacao',
        'ativa',
        'created_at'
    ]
    
    # Campos de busca
    search_fields = [
        'nome',
        'codigo',
        'descricao'
    ]
    
    # Campos editáveis na listagem
    list_editable = ['ativa']
    
    # Configurações de paginação e ordenação
    list_per_page = 30
    ordering = ['area_principal', 'nome']
    
    # Organização dos campos no formulário
    fieldsets = (
        ('📝 Identificação da Especialidade', {
            'fields': ('nome', 'codigo', 'area_principal'),
            'description': 'Informações básicas da especialidade contábil'
        }),
        ('📄 Descrição Detalhada', {
            'fields': ('descricao',),
            'description': 'Descrição completa da especialidade e suas atribuições'
        }),
        ('🎓 Requisitos de Certificação', {
            'fields': ('requer_certificacao',),
            'description': 'Especialidades que exigem certificação específica'
        }),
        ('⚙️ Status da Especialidade', {
            'fields': ('ativa',),
            'description': 'Especialidade disponível para seleção pelos contadores'
        }),
        ('📅 Informações do Sistema', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    # Campos somente leitura
    readonly_fields = ['created_at']
    
    # Métodos customizados para exibição
    @admin.display(description='📚 Especialidade', ordering='nome')
    def nome_especialidade_display(self, obj):
        """Exibe nome com ícone por área"""
        # Mapeamento de ícones por área contábil
        icon_map = {
            'contabil': '🧮',
            'fiscal': '📋',
            'trabalhista': '👥',
            'societaria': '🏢',
            'pericial': '🔍',
            'auditoria': '✅',
            'consultoria': '💼',
            'financeira': '💰'
        }
        icon = icon_map.get(obj.area_principal, '📊')
        
        return format_html(
            '{} <strong>{}</strong>',
            icon, obj.nome
        )
    
    @admin.display(description='🔖 Código', ordering='codigo')
    def codigo_display(self, obj):
        """Exibe código com destaque visual"""
        return format_html(
            '<code style="background: #e3f2fd; color: #1565c0; padding: 2px 6px; border-radius: 3px; font-weight: bold;">{}</code>',
            obj.codigo
        )
    
    @admin.display(description='🎯 Área Principal', ordering='area_principal')
    def area_principal_display(self, obj):
        """Exibe área principal com cores específicas"""
        # Mapeamento de cores por área contábil
        color_map = {
            'contabil': '#2e7d32',      # Verde
            'fiscal': '#d32f2f',        # Vermelho
            'trabalhista': '#f57c00',   # Laranja
            'societaria': '#303f9f',    # Azul escuro
            'pericial': '#7b1fa2',      # Roxo
            'auditoria': '#388e3c',     # Verde claro
            'consultoria': '#1976d2',   # Azul
            'financeira': '#c2185b'     # Rosa
        }
        
        color = color_map.get(obj.area_principal, '#666')
        area_display = obj.get_area_principal_display()
        
        return format_html(
            '<span style="background: {}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.85em; font-weight: bold;">{}</span>',
            color, area_display
        )
    
    @admin.display(description='🎓 Certificação', boolean=True)
    def certificacao_display(self, obj):
        """Exibe se requer certificação como ícone booleano"""
        return obj.requer_certificacao
    
    @admin.display(description='👥 Contadores')
    def contadores_vinculados(self, obj):
        """Mostra quantidade de contadores com esta especialidade"""
        count = obj.contadores.count()
        
        if count > 0:
            return format_html(
                '<span style="background: #e8f5e8; color: #2e7d32; padding: 2px 8px; border-radius: 10px; font-weight: bold;">👥 {}</span>',
                count
            )
        return format_html(
            '<span style="background: #ffebee; color: #c62828; padding: 2px 8px; border-radius: 10px; font-size: 0.9em;">❌ Nenhum</span>'
        )
    
    @admin.display(description='📅 Criado em', ordering='created_at')
    def created_at_display(self, obj):
        """Exibe data de criação formatada"""
        return obj.created_at.strftime("%d/%m/%Y")
    
    # Otimização de queries para performance
    def get_queryset(self, request):
        """Otimiza consultas com prefetch_related"""
        queryset = super().get_queryset(request)
        # Prefetch contadores para evitar N+1 queries na contagem
        return queryset.prefetch_related('contadores')
    
    # Ações personalizadas em lote
    actions = [
        'ativar_especialidades', 
        'desativar_especialidades', 
        'duplicar_especialidades',
        'marcar_certificacao_obrigatoria',
        'remover_certificacao_obrigatoria'
    ]
    
    @admin.action(description='✅ Ativar especialidades selecionadas')
    def ativar_especialidades(self, request, queryset):
        """Ativa múltiplas especialidades de uma vez"""
        updated = queryset.update(ativa=True)
        self.message_user(
            request, 
            f'{updated} especialidade(s) ativada(s) com sucesso.',
            level='SUCCESS'
        )
    
    @admin.action(description='❌ Desativar especialidades selecionadas') 
    def desativar_especialidades(self, request, queryset):
        """Desativa múltiplas especialidades de uma vez"""
        updated = queryset.update(ativa=False)
        self.message_user(
            request, 
            f'{updated} especialidade(s) desativada(s) com sucesso.',
            level='WARNING'
        )
    
    @admin.action(description='📋 Duplicar especialidades selecionadas')
    def duplicar_especialidades(self, request, queryset):
        """Duplica especialidades com sufixo (Cópia)"""
        duplicated_count = 0
        for obj in queryset:
            # Verificar se código duplicado já existe
            original_codigo = obj.codigo
            copy_codigo = f"{original_codigo}_COPY"
            
            # Se já existe, adicionar número sequencial
            counter = 1
            while Especialidade.objects.filter(codigo=copy_codigo).exists():
                copy_codigo = f"{original_codigo}_COPY_{counter}"
                counter += 1
            
            # Criar cópia do objeto
            obj.pk = None  # Remove primary key para criar novo registro
            obj.nome = f"{obj.nome} (Cópia)"
            obj.codigo = copy_codigo
            obj.save()
            duplicated_count += 1
        
        self.message_user(
            request,
            f'{duplicated_count} especialidade(s) duplicada(s) com sucesso.',
            level='SUCCESS'
        )
    
    @admin.action(description='🎓 Marcar como certificação obrigatória')
    def marcar_certificacao_obrigatoria(self, request, queryset):
        """Marca especialidades como exigindo certificação"""
        updated = queryset.update(requer_certificacao=True)
        self.message_user(
            request,
            f'{updated} especialidade(s) marcada(s) como certificação obrigatória.',
            level='INFO'
        )
    
    @admin.action(description='🚫 Remover obrigatoriedade de certificação')
    def remover_certificacao_obrigatoria(self, request, queryset):
        """Remove obrigatoriedade de certificação"""
        updated = queryset.update(requer_certificacao=False)
        self.message_user(
            request,
            f'{updated} especialidade(s) com certificação removida.',
            level='INFO'
        )