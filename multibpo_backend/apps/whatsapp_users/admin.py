# apps/whatsapp_users/admin.py
from django.contrib import admin
from .models import WhatsAppUser, WhatsAppMessage, ConfiguracaoSistema, AssinaturaAsaas


@admin.register(WhatsAppUser)
class WhatsAppUserAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'nome', 'plano_atual', 'perguntas_realizadas', 'limite_perguntas', 'ativo', 'created_at']
    list_filter = ['plano_atual', 'ativo', 'termos_aceitos', 'email_verificado']
    search_fields = ['phone_number', 'nome', 'email']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('phone_number', 'nome', 'email')
        }),
        ('Controle de Limites', {
            'fields': ('plano_atual', 'perguntas_realizadas', 'limite_perguntas')
        }),
        ('Status', {
            'fields': ('ativo', 'termos_aceitos', 'email_verificado')
        }),
        ('Relacionamentos', {
            'fields': ('user',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(WhatsAppMessage)
class WhatsAppMessageAdmin(admin.ModelAdmin):
    list_display = ['whatsapp_user', 'pergunta_preview', 'tokens_utilizados', 'tempo_processamento', 'created_at']
    list_filter = ['created_at']
    search_fields = ['whatsapp_user__nome', 'whatsapp_user__phone_number', 'pergunta']
    readonly_fields = ['created_at']
    
    def pergunta_preview(self, obj):
        return obj.pergunta[:50] + "..." if len(obj.pergunta) > 50 else obj.pergunta
    pergunta_preview.short_description = 'Pergunta'


@admin.register(ConfiguracaoSistema)
class ConfiguracaoSistemaAdmin(admin.ModelAdmin):
    list_display = ['chave', 'valor', 'ativo', 'descricao']
    list_filter = ['ativo']
    search_fields = ['chave', 'descricao']
    list_editable = ['valor', 'ativo']

# ===================================================================
# ASAAS ADMIN - Interface administrativa para assinaturas
# ===================================================================

@admin.register(AssinaturaAsaas)
class AssinaturaAsaasAdmin(admin.ModelAdmin):
    list_display = [
        'formatted_phone', 
        'customer_name', 
        'valor', 
        'status', 
        'origem',
        'created_at',
        'next_due_date'
    ]
    list_filter = [
        'status', 
        'origem', 
        'created_at',
        'valor'
    ]
    search_fields = [
        'whatsapp_user__phone_number',
        'whatsapp_user__nome',
        'whatsapp_user__email',
        'customer_id',
        'subscription_id'
    ]
    readonly_fields = [
        'customer_id',
        'subscription_id', 
        'checkout_url',
        'external_reference',
        'created_at',
        'updated_at'
    ]
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('whatsapp_user', 'valor', 'status', 'origem')
        }),
        ('Dados Asaas', {
            'fields': ('customer_id', 'subscription_id', 'checkout_url', 'external_reference'),
            'classes': ('collapse',)
        }),
        ('Cobrança', {
            'fields': ('next_due_date',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def formatted_phone(self, obj):
        return obj.whatsapp_user.phone_number
    formatted_phone.short_description = 'Telefone'
    
    def customer_name(self, obj):
        return obj.customer_name
    customer_name.short_description = 'Nome'
    
    # Actions personalizadas
    actions = ['ativar_premium', 'suspender_assinatura']
    
    def ativar_premium(self, request, queryset):
        """Ação para ativar premium manualmente"""
        count = 0
        for assinatura in queryset:
            if assinatura.status != 'ACTIVE':
                assinatura.ativar_premium()
                count += 1
        
        self.message_user(
            request, 
            f'{count} assinatura(s) ativada(s) com sucesso!'
        )
    ativar_premium.short_description = "Ativar Premium"
    
    def suspender_assinatura(self, request, queryset):
        """Ação para suspender assinaturas"""
        count = queryset.update(status='SUSPENDED')
        self.message_user(
            request, 
            f'{count} assinatura(s) suspensa(s)!'
        )
    suspender_assinatura.short_description = "Suspender Assinatura"