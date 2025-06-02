from django.apps import AppConfig

class ContadoresConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.contadores'
    verbose_name = 'Gestão de Contadores'
    
    def ready(self):
        """
        Configurações que rodam quando o app é carregado
        """
        pass