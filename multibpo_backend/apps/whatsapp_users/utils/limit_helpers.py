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
    elif whatsapp_user.plano_atual == 'basico':  # ← CORREÇÃO: 'cadastrado' → 'basico'
        limite_total = get_limite_usuario_cadastrado()
    elif whatsapp_user.plano_atual == 'premium':
        # Premium = ilimitado
        return {
            'pode_perguntar': True,
            'perguntas_restantes': 999999,  # ✅ CORREÇÃO: Número alto em vez de -1 
            'limite_atingido': False,
            'proxima_acao': 'continue'
        }
    else:
        # Plano desconhecido, assumir novo usuário
        limite_total = get_limite_novo_usuario()
    
    # Calcular restantes - NOVA LÓGICA: permite enviar 4ª pergunta
    perguntas_restantes = limite_total - whatsapp_user.perguntas_realizadas

    # Para usuários novos: permitir enviar 4ª pergunta (mas será bloqueada antes da IA responder)
    if whatsapp_user.plano_atual == 'novo':
        pode_perguntar = perguntas_restantes >= 0  # Mudou de > 0 para >= 0
    else:
    # Outros planos: manter lógica original  
        pode_perguntar = perguntas_restantes > 0
    
    # Determinar próxima ação
    if pode_perguntar:
        proxima_acao = 'continue'
    elif whatsapp_user.plano_atual == 'novo':
        proxima_acao = 'upgrade_cadastro'
    elif whatsapp_user.plano_atual == 'basico':  # ← CORREÇÃO: 'cadastrado' → 'basico'
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
    """Gerar mensagem apropriada quando limite é atingido COM dados do botão"""
    if whatsapp_user.plano_atual == 'novo':
        # ✅ MENSAGEM CORRETA: Usuário novo (3 perguntas) → CADASTRO
        mensagem = """⚠️ Você atingiu o limite máximo de mensagens.
Para continuar acessando nossos serviços, faça login ou cadastre-se gratuitamente agora mesmo.
🔐 É rápido, seguro e gratuito!

📝 Cadastre-se e ganhe mais 7 perguntas GRÁTIS!
✅ Total de 10 perguntas no plano gratuito
✅ Acesso também pelo computador
✅ Histórico das suas conversas

Após o cadastro, volte aqui para continuar! 😊"""
        
        # Dados do botão para cadastro
        phone_clean = whatsapp_user.phone_number.replace('+', '') if whatsapp_user.phone_number else ''
        botao_dados = {
            'text': '👉 Continuar',
            'url': f'{get_url_cadastro()}?ref=whatsapp&phone={phone_clean}'
        }
        
        return {
            'mensagem': mensagem,
            'botao': botao_dados,
            'tipo': 'limite_cadastro'
        }
    
    elif whatsapp_user.plano_atual == 'basico':
        # ✅ MENSAGEM CORRETA: Usuário básico (10 perguntas) → PREMIUM
        return f"""🚫 Você atingiu o limite máximo de mensagens do plano gratuito.
Para continuar utilizando nossos serviços, contrate um plano ou aguarde 7 dias para ter novo acesso.

💼 Com o Plano Premium, você terá:

✅ Uso pessoal e profissional
✅ Integração total com o WhatsApp
✅ Acesso também pelo computador
✅ Consultas 24 horas, 7 dias por semana
✅ IA mais avançada, com respostas ainda mais precisas

💰 Tudo isso por apenas R$ {get_valor_assinatura()}/mês
Muito menos do que um funcionário especializado!

🎁 Oferta exclusiva:
Use o cupom QUEROAGORA e ganhe 50% de desconto.
Assine agora por apenas R$ {float(get_valor_assinatura()) / 2:.2f}/mês!

🔥 Invista no que realmente facilita sua rotina.
📆 Acesso liberado imediatamente após a confirmação!"""
    
    return "Limite de perguntas atingido. Entre em contato conosco."