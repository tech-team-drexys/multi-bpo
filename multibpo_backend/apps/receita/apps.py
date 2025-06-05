"""
Configuração do app Receita Federal
"""

from django.apps import AppConfig


class ReceitaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.receita'
    verbose_name = 'Receita Federal'