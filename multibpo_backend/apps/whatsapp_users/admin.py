# apps/whatsapp_users/admin.py
from django.contrib import admin
from .models import WhatsAppUser, WhatsAppMessage, ConfiguracaoSistema


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
