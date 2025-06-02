from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    verbose_name = 'Autenticação MULTIBPO'
    
    def ready(self):
        """
        Configurações que rodam quando o app é carregado
        """
        pass