# apps/whatsapp_users/utils/user_helpers.py
from ..models import WhatsAppUser
from .config_helpers import get_limite_novo_usuario, get_limite_usuario_cadastrado


def normalizar_telefone(phone_number):
    """Normalizar número de telefone para padrão brasileiro"""
    # Remove espaços e caracteres especiais
    clean_phone = ''.join(filter(str.isdigit, phone_number))
    
    # Adicionar código do país se necessário
    if not clean_phone.startswith('55'):
        clean_phone = '55' + clean_phone
    
    return '+' + clean_phone


def get_or_create_whatsapp_user(phone_number):
    """
    Buscar ou criar usuário WhatsApp
    
    Returns:
        tuple: (WhatsAppUser, created: bool)
    """
    phone_normalized = normalizar_telefone(phone_number)
    
    user, created = WhatsAppUser.objects.get_or_create(
        phone_number=phone_normalized,
        defaults={
            'plano_atual': 'novo',
            'limite_perguntas': get_limite_novo_usuario(),
            'perguntas_realizadas': 0,
            'ativo': True,
            'termos_aceitos': False,
            'email_verificado': False
        }
    )
    
    return user, created


def verificar_status_usuario(whatsapp_user):
    """
    Verificar status do usuário (se precisa aceitar termos, definir nome, etc.)
    
    Returns:
        dict: {
            'precisa_termos': bool,
            'precisa_nome': bool,
            'usuario_completo': bool
        }
    """
    precisa_termos = not whatsapp_user.termos_aceitos
    precisa_nome = not whatsapp_user.nome or len(whatsapp_user.nome.strip()) < 2
    
    return {
        'precisa_termos': precisa_termos,
        'precisa_nome': precisa_nome,
        'usuario_completo': not (precisa_termos or precisa_nome)
    }


def atualizar_usuario_whatsapp(whatsapp_user, action, data):
    """
    Atualizar dados do usuário baseado na ação
    
    Args:
        whatsapp_user: Instância do WhatsAppUser
        action: Tipo de ação ('aceitar_termos', 'definir_nome', etc.)
        data: Dados para atualização
    
    Returns:
        dict: Resultado da atualização
    """
    updated = False
    message = None
    
    if action == 'aceitar_termos':
        whatsapp_user.termos_aceitos = True
        updated = True
        message = "Termos aceitos com sucesso!"
    
    elif action == 'definir_nome':
        nome = data.get('nome', '').strip()
        if nome:
            whatsapp_user.nome = nome
            updated = True
            message = f"Nome definido: {nome}"
    
    elif action == 'verificar_email':
        email = data.get('email', '').strip()
        if email:
            whatsapp_user.email = email
            whatsapp_user.email_verificado = True
            # Upgrade para plano cadastrado
            if whatsapp_user.plano_atual == 'novo':
                whatsapp_user.plano_atual = 'cadastrado'
                whatsapp_user.limite_perguntas = get_limite_usuario_cadastrado()
            updated = True
            message = "Email verificado e plano atualizado!"
    
    elif action == 'upgrade_plano':
        novo_plano = data.get('plano', '')
        if novo_plano in ['cadastrado', 'premium']:
            whatsapp_user.plano_atual = novo_plano
            if novo_plano == 'premium':
                whatsapp_user.limite_perguntas = None  # Ilimitado
            updated = True
            message = f"Plano atualizado para: {novo_plano}"
    
    if updated:
        whatsapp_user.save()
    
    return {
        'success': updated,
        'message': message,
        'new_status': whatsapp_user.plano_atual
    }