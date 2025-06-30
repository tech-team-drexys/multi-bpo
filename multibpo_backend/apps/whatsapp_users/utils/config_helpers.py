# apps/whatsapp_users/utils/config_helpers.py
from ..models import ConfiguracaoSistema


def get_config_value(chave, default=None):
    """Buscar valor de configuração do sistema"""
    try:
        config = ConfiguracaoSistema.objects.get(chave=chave, ativo=True)
        return config.valor
    except ConfiguracaoSistema.DoesNotExist:
        return default


def get_limite_novo_usuario():
    """Limite de perguntas para usuário novo"""
    return int(get_config_value('limite_novo_usuario', '3'))


def get_limite_usuario_cadastrado():
    """Limite de perguntas para usuário cadastrado"""
    return int(get_config_value('limite_usuario_cadastrado', '10'))


def get_valor_assinatura():
    """Valor da assinatura premium"""
    return float(get_config_value('valor_assinatura_mensal', '29.90'))


def get_url_cadastro():
    """URL para cadastro de usuários"""
    return get_config_value('url_cadastro', 'https://multibpo.com.br/cadastro')


def get_url_premium():
    """URL para assinatura premium"""
    return get_config_value('url_premium', 'https://multibpo.com.br/premium')