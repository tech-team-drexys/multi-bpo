# apps/whatsapp_users/utils/limit_helpers.py
from ..models import WhatsAppUser
from .config_helpers import get_limite_novo_usuario, get_limite_usuario_cadastrado, get_url_cadastro, get_url_premium, get_valor_assinatura


def verificar_limites_usuario(whatsapp_user):
    """
    Verificar se usuário pode fazer pergunta baseado em seus limites
    
    Returns:
        dict: {
            'pode_perguntar': bool,
            'perguntas_restantes': int,
            'limite_atingido': bool,
            'proxima_acao': str
        }
    """
    # Definir limite baseado no plano
    if whatsapp_user.plano_atual == 'novo':
        limite_total = get_limite_novo_usuario()
    elif whatsapp_user.plano_atual == 'cadastrado':
        limite_total = get_limite_usuario_cadastrado()
    elif whatsapp_user.plano_atual == 'premium':
        # Premium = ilimitado
        return {
            'pode_perguntar': True,
            'perguntas_restantes': -1,  # -1 = ilimitado
            'limite_atingido': False,
            'proxima_acao': 'continue'
        }
    else:
        # Plano desconhecido, assumir novo usuário
        limite_total = get_limite_novo_usuario()
    
    # Calcular restantes
    perguntas_restantes = limite_total - whatsapp_user.perguntas_realizadas
    pode_perguntar = perguntas_restantes > 0
    
    # Determinar próxima ação
    if pode_perguntar:
        proxima_acao = 'continue'
    elif whatsapp_user.plano_atual == 'novo':
        proxima_acao = 'upgrade_cadastro'
    elif whatsapp_user.plano_atual == 'cadastrado':
        proxima_acao = 'upgrade_premium'
    else:
        proxima_acao = 'blocked'
    
    return {
        'pode_perguntar': pode_perguntar,
        'perguntas_restantes': max(0, perguntas_restantes),
        'limite_atingido': not pode_perguntar,
        'proxima_acao': proxima_acao
    }


def incrementar_contador_usuario(whatsapp_user):
    """Incrementar contador de perguntas do usuário"""
    whatsapp_user.perguntas_realizadas += 1
    whatsapp_user.save(update_fields=['perguntas_realizadas'])
    return whatsapp_user.perguntas_realizadas


def get_mensagem_limite(whatsapp_user, limite_info):
    """Gerar mensagem apropriada quando limite é atingido"""
    if whatsapp_user.plano_atual == 'novo':
        return f"""Você já utilizou suas {get_limite_novo_usuario()} perguntas gratuitas! 🎯

Para continuar conversando comigo, faça seu cadastro 
e ganhe mais {get_limite_usuario_cadastrado() - get_limite_novo_usuario()} perguntas GRÁTIS!

📱 Cadastro rápido pelo celular:
👉 {get_url_cadastro()}?ref=whatsapp&phone={whatsapp_user.phone_number.replace('+', '')}

Após o cadastro, volte aqui e continue nossa conversa! 😊"""
    
    elif whatsapp_user.plano_atual == 'cadastrado':
        return f"""Parabéns! Você aproveitou ao máximo suas {get_limite_usuario_cadastrado()} perguntas gratuitas! 🚀

Para ter acesso ILIMITADO à nossa IA especializada:

✅ Perguntas ilimitadas
✅ Respostas prioritárias  
✅ Relatórios personalizados
✅ Suporte especializado

💰 Apenas R$ {get_valor_assinatura()}/mês

📱 Assine agora pelo celular:
👉 {get_url_premium()}?ref=whatsapp&phone={whatsapp_user.phone_number.replace('+', '')}"""
    
    return "Limite de perguntas atingido. Entre em contato conosco."