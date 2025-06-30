from django.apps import AppConfig


class WhatsappUsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.whatsapp_users'
    verbose_name = 'WhatsApp Users'
    
    def ready(self):
        """Método chamado quando app é carregado"""
        pass