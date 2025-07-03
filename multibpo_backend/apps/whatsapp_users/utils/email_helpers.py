# ========== UTILITÁRIOS PARA ENVIO DE EMAILS MOBILE ==========
# Criado em 01/07/2025 para sistema de cadastro mobile
# Integra com Gmail SMTP e templates responsivos

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

# Configurar logger específico para emails
logger = logging.getLogger('email')


def send_verification_email(user, token, request=None):
    """
    Enviar email de verificação para usuário mobile
    
    Args:
        user: Instância do User Django
        token: String do token de verificação
        request: Request HTTP (para capturar IP, user-agent)
    
    Returns:
        bool: True se enviado com sucesso, False caso contrário
    """
    
    try:
        # URLs para verificação
        verification_url = f"{settings.EMAIL_VERIFICATION_URL}/{token}"
        
        # Capturar dados do request se disponível
        ip_address = None
        user_agent = None
        if request:
            ip_address = get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:100]
        
        # Context para templates
        context = {
            'user': user,
            'verification_url': verification_url,
            'site_name': 'MultiBPO',
            'site_url': settings.FRONTEND_URL,
            'token': token,
            'support_email': 'contato@multibpo.com.br',
            'logo_url': f"{settings.FRONTEND_URL}/static/images/logo.png",
            'ip_address': ip_address,
            'user_agent': user_agent,
            'company_name': 'MULTI BPO - Soluções Contábeis',
            'whatsapp_url': 'https://wa.me/5511999999999',  # Configurar seu WhatsApp
        }
        
        # Renderizar templates
        try:
            html_content = render_to_string('emails/verification_email.html', context)
            text_content = render_to_string('emails/verification_email.txt', context)
        except Exception as template_error:
            logger.error(f"Erro ao renderizar templates de email: {template_error}")
            # Fallback para email texto simples
            text_content = f"""
Olá {user.get_full_name() or user.username}!

Para ativar sua conta na MultiBPO, clique no link abaixo:
{verification_url}

Este link expira em 1 hora por segurança.

Se você não solicitou este cadastro, ignore este email.

Atenciosamente,
Equipe MultiBPO
{settings.FRONTEND_URL}
            """.strip()
            html_content = None
        
        # Enviar email
        success = send_mail(
            subject='✅ Confirme seu email - MultiBPO',
            message=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=False
        )
        
        if success:
            logger.info(
                f"Email de verificação enviado com sucesso para: {user.email} "
                f"(Token: {token[:10]}...)"
            )
            return True
        else:
            logger.error(f"Falha ao enviar email para: {user.email}")
            return False
            
    except Exception as e:
        logger.error(f"Erro ao enviar email de verificação para {user.email}: {e}")
        return False


def send_welcome_email(user):
    """
    Enviar email de boas-vindas após verificação bem-sucedida
    
    Args:
        user: Instância do User Django verificado
    
    Returns:
        bool: True se enviado com sucesso, False caso contrário
    """
    
    try:
        # Buscar dados do WhatsAppUser se existir
        whatsapp_user = None
        try:
            from ..models import WhatsAppUser
            whatsapp_user = WhatsAppUser.objects.get(email=user.email)
        except WhatsAppUser.DoesNotExist:
            pass
        
        # 🔧 BUSCAR TELEFONE REAL DO USUÁRIO (3 linhas adicionadas)
        user_phone = None
        try:
            from ..models import WhatsAppUser
            whatsapp_user = WhatsAppUser.objects.get(user=user)
            user_phone = whatsapp_user.phone_number.replace('+', '') if whatsapp_user.phone_number else None
        except:
            user_phone = None

        # Context para templates
        context = {
            'user': user,
            'verification_url': verification_url,
            'site_name': 'MultiBPO',
            'site_url': settings.FRONTEND_URL,
            'token': token,
            'support_email': 'contato@multibpo.com.br',
            'logo_url': f"{settings.FRONTEND_URL}/static/images/logo.png",
            'ip_address': ip_address,
            'user_agent': user_agent,
            'company_name': 'MULTI BPO - Soluções Contábeis',
            'whatsapp_url': f'https://wa.me/{user_phone}' if user_phone else 'https://wa.me/5511999999999',  # 🔧 USAR TELEFONE REAL
            'user_phone': user_phone,  # 🔧 ADICIONAR PARA O TEMPLATE
        }
        
        # Renderizar templates
        try:
            html_content = render_to_string('emails/welcome_email.html', context)
            text_content = render_to_string('emails/welcome_email.txt', context)
        except Exception:
            # Fallback para email texto simples
            perguntas = whatsapp_user.get_perguntas_restantes() if whatsapp_user else 10
            text_content = f"""
Parabéns {user.get_full_name() or user.username}!

Sua conta MultiBPO foi ativada com sucesso! 🎉

Agora você tem {perguntas} perguntas disponíveis para nossa IA especializada em contabilidade.

Para continuar, volte ao WhatsApp e continue sua conversa com nosso assistente Luca IA.

WhatsApp: https://wa.me/5511999999999

Qualquer dúvida, entre em contato conosco.

Bem-vindo à MultiBPO!
Equipe MultiBPO
{settings.FRONTEND_URL}
            """.strip()
            html_content = None
        
        success = send_mail(
            subject='🎉 Bem-vindo à MultiBPO! Conta ativada',
            message=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=True  # Não falhar se welcome email não enviar
        )
        
        if success:
            logger.info(f"Email de boas-vindas enviado para: {user.email}")
        else:
            logger.warning(f"Falha ao enviar email de boas-vindas para: {user.email}")
        
        return success
        
    except Exception as e:
        logger.error(f"Erro ao enviar email de boas-vindas para {user.email}: {e}")
        return False


def send_password_reset_mobile(user, token):
    """
    Enviar email de reset de senha para usuários mobile
    
    Args:
        user: Instância do User Django
        token: Token de reset de senha
    
    Returns:
        bool: True se enviado com sucesso
    """
    
    try:
        reset_url = f"{settings.MOBILE_LOGIN_URL}?reset_token={token}"
        
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': 'MultiBPO',
            'site_url': settings.FRONTEND_URL,
            'support_email': 'contato@multibpo.com.br',
            'company_name': 'MULTI BPO - Soluções Contábeis',
        }
        
        # Email texto simples para reset
        text_content = f"""
Olá {user.get_full_name() or user.username},

Recebemos uma solicitação para redefinir sua senha na MultiBPO.

Para criar uma nova senha, clique no link abaixo:
{reset_url}

Este link expira em 30 minutos por segurança.

Se você não solicitou esta alteração, ignore este email.

Atenciosamente,
Equipe MultiBPO
{settings.FRONTEND_URL}
        """.strip()
        
        success = send_mail(
            subject='🔐 Redefinir senha - MultiBPO',
            message=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False
        )
        
        if success:
            logger.info(f"Email de reset de senha enviado para: {user.email}")
        
        return success
        
    except Exception as e:
        logger.error(f"Erro ao enviar email de reset para {user.email}: {e}")
        return False


def get_client_ip(request):
    """
    Capturar IP real do cliente (considerando proxies)
    
    Args:
        request: HttpRequest
        
    Returns:
        str: Endereço IP do cliente
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def validate_email_content(email_content):
    """
    Validar conteúdo de email antes do envio
    
    Args:
        email_content: String do conteúdo do email
        
    Returns:
        bool: True se válido
    """
    if not email_content or len(email_content.strip()) < 10:
        return False
    
    # Verificar se tem elementos obrigatórios
    required_elements = ['multibpo', 'verificação', 'link']
    content_lower = email_content.lower()
    
    return any(element in content_lower for element in required_elements)


def cleanup_old_emails():
    """
    Função para limpeza de emails antigos (logs)
    Pode ser chamada via management command
    """
    try:
        from ..models import EmailVerificationToken
        deleted_count = EmailVerificationToken.cleanup_expired_tokens()
        
        if deleted_count > 0:
            logger.info(f"Limpeza de tokens: {deleted_count} tokens expirados removidos")
        
        return deleted_count
        
    except Exception as e:
        logger.error(f"Erro na limpeza de tokens: {e}")
        return 0


# ========== CONFIGURAÇÕES DE EMAIL PARA TESTES ==========

def test_email_configuration():
    """
    Testar configuração de email SMTP
    
    Returns:
        dict: Resultado do teste
    """
    try:
        from django.core.mail import get_connection
        
        # Testar conexão SMTP
        connection = get_connection()
        connection.open()
        connection.close()
        
        return {
            'success': True,
            'message': 'Configuração SMTP funcionando',
            'backend': settings.EMAIL_BACKEND,
            'host': settings.EMAIL_HOST,
            'port': settings.EMAIL_PORT,
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': f'Erro na configuração SMTP: {e}',
            'backend': settings.EMAIL_BACKEND,
        }


def send_test_email(email_destino='teste@exemplo.com'):
    """
    Enviar email de teste para validar configuração
    
    Args:
        email_destino: Email para envio do teste
        
    Returns:
        bool: True se enviado com sucesso
    """
    try:
        success = send_mail(
            subject='✅ Teste MultiBPO - Email funcionando',
            message=f'''
Este é um email de teste da MultiBPO.

Timestamp: {timezone.now()}
Backend: {settings.EMAIL_BACKEND}
Host: {settings.EMAIL_HOST}

Se você recebeu este email, a configuração está funcionando corretamente.

Equipe MultiBPO
            '''.strip(),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email_destino],
            fail_silently=False
        )
        
        if success:
            logger.info(f"Email de teste enviado com sucesso para: {email_destino}")
        
        return success
        
    except Exception as e:
        logger.error(f"Erro ao enviar email de teste: {e}")
        return False