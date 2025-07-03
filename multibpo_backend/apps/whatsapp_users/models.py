# multibpo_backend/apps/whatsapp_users/models.py

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.utils import timezone
import re
import secrets


class WhatsAppUser(models.Model):
    """
    Model principal para usuários do WhatsApp
    Controla limites, planos e dados básicos
    """
    
    # Choices para planos
    PLANO_CHOICES = [
        ('novo', 'Novo (3 perguntas)'),
        ('basico', 'Básico (10 perguntas)'), 
        ('premium', 'Premium (Ilimitado)'),
    ]
    
    TIPO_PESSOA_CHOICES = [
        ('fisica', 'Pessoa Física'),
        ('juridica', 'Pessoa Jurídica'),
    ]
    
    # Identificação
    phone_number = models.CharField(
        max_length=20, 
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\+?55\d{10,11}$',
                message='Formato: +5511999999999 ou 5511999999999'
            )
        ],
        help_text='Número do WhatsApp com código do país'
    )
    nome = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True, null=True)
    tipo_pessoa = models.CharField(
        max_length=10, 
        choices=TIPO_PESSOA_CHOICES, 
        default='fisica'
    )
    cpf_cnpj = models.CharField(max_length=18, blank=True)
    
    # Controle de limites
    perguntas_realizadas = models.PositiveIntegerField(default=0)
    limite_perguntas = models.PositiveIntegerField(default=3)
    plano_atual = models.CharField(
        max_length=20, 
        choices=PLANO_CHOICES, 
        default='novo'
    )
    
    # Status
    ativo = models.BooleanField(default=True)
    termos_aceitos = models.BooleanField(default=False)
    termos_aceitos_em = models.DateTimeField(null=True, blank=True)
    email_verificado = models.BooleanField(default=False)
    email_verificado_em = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(null=True, blank=True)
    
    # Relacionamento com usuário do site (opcional)
    user = models.OneToOneField(
        User, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL,
        help_text='Vinculação com conta do site MultiBPO'
    )
    
    # Dados extras
    primeira_pergunta = models.TextField(blank=True)
    observacoes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'whatsapp_users'
        verbose_name = 'Usuário WhatsApp'
        verbose_name_plural = 'Usuários WhatsApp'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['phone_number']),
            models.Index(fields=['plano_atual']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.nome or 'Usuário'} - {self.phone_number}"
    
    def clean_phone_number(self):
        """Remove caracteres especiais do telefone"""
        if self.phone_number:
            return re.sub(r'[^\d]', '', self.phone_number)
        return ''
    
    def pode_fazer_pergunta(self):
        """Verifica se usuário pode fazer pergunta"""
        if self.plano_atual == 'premium':
            return True
        return self.perguntas_realizadas < self.limite_perguntas
    
    def incrementar_pergunta(self):
        """Incrementa contador de perguntas"""
        if self.pode_fazer_pergunta():
            self.perguntas_realizadas += 1
            self.last_message_at = timezone.now()
            self.save()
            return True
        return False
    
    def upgrade_plano(self, novo_plano):
        """Faz upgrade do plano do usuário"""
        planos_validos = dict(self.PLANO_CHOICES).keys()
        if novo_plano in planos_validos:
            self.plano_atual = novo_plano
            
            # Ajustar limites conforme plano
            if novo_plano == 'basico':
                self.limite_perguntas = 10
            elif novo_plano == 'premium':
                self.limite_perguntas = None  # Ilimitado
            
            self.save()
            return True
        return False
    
    def get_perguntas_restantes(self):
        """Retorna quantas perguntas restam"""
        if self.plano_atual == 'premium':
            return float('inf')  # Ilimitado
        return max(0, self.limite_perguntas - self.perguntas_realizadas)
    
    def aceitar_termos(self):
        """Marca termos como aceitos"""
        self.termos_aceitos = True
        self.termos_aceitos_em = timezone.now()
        self.save()
    
    def verificar_email(self):
        """Marca email como verificado e faz upgrade para básico"""
        self.email_verificado = True
        self.email_verificado_em = timezone.now()
        self.ativo = True  # ← CORREÇÃO: Ativar WhatsAppUser também
        if self.plano_atual == 'novo':
            self.upgrade_plano('basico')
        self.save()


class WhatsAppMessage(models.Model):
    """
    Model para auditoria de mensagens
    Registra todas as interações
    """
    
    whatsapp_user = models.ForeignKey(
        WhatsAppUser, 
        on_delete=models.CASCADE,
        related_name='mensagens'
    )
    
    # Conteúdo da mensagem
    pergunta = models.TextField(help_text='Pergunta do usuário')
    resposta = models.TextField(help_text='Resposta da IA')
    
    # Dados técnicos
    tokens_utilizados = models.PositiveIntegerField(default=0)
    tempo_processamento = models.FloatField(
        default=0.0, 
        help_text='Tempo em segundos'
    )
    modelo_ia = models.CharField(max_length=50, default='gpt-4')
    
    # Metadata
    whatsapp_message_id = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    # Status
    processada_com_sucesso = models.BooleanField(default=True)
    erro_detalhes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'whatsapp_messages'
        verbose_name = 'Mensagem WhatsApp'
        verbose_name_plural = 'Mensagens WhatsApp'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['whatsapp_user', '-created_at']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.whatsapp_user.nome} - {self.created_at.strftime('%d/%m %H:%M')}"
    
    def pergunta_resumida(self):
        """Retorna pergunta resumida para admin"""
        return self.pergunta[:100] + '...' if len(self.pergunta) > 100 else self.pergunta
    
    def resposta_resumida(self):
        """Retorna resposta resumida para admin"""
        return self.resposta[:100] + '...' if len(self.resposta) > 100 else self.resposta


class ConfiguracaoSistema(models.Model):
    """
    Model para configurações dinâmicas do sistema
    Permite alterar comportamentos sem deploy
    """
    
    chave = models.CharField(
        max_length=100, 
        unique=True,
        help_text='Chave única da configuração'
    )
    valor = models.TextField(help_text='Valor da configuração')
    descricao = models.TextField(
        blank=True,
        help_text='Descrição do que esta configuração faz'
    )
    ativo = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'whatsapp_configuracoes'
        verbose_name = 'Configuração do Sistema'
        verbose_name_plural = 'Configurações do Sistema'
        ordering = ['chave']
    
    def __str__(self):
        return f"{self.chave}: {self.valor[:50]}"
    
    @classmethod
    def get_valor(cls, chave, default=None):
        """Método helper para buscar configuração"""
        try:
            config = cls.objects.get(chave=chave, ativo=True)
            return config.valor
        except cls.DoesNotExist:
            return default
    
    @classmethod
    def set_valor(cls, chave, valor, descricao=''):
        """Método helper para definir configuração"""
        config, created = cls.objects.update_or_create(
            chave=chave,
            defaults={
                'valor': valor,
                'descricao': descricao,
                'ativo': True
            }
        )
        return config

    @classmethod
    def carregar_configuracoes_iniciais(cls):
        """Carrega configurações padrão do sistema"""
        configuracoes_default = [
            ('limite_novo_usuario', '3', 'Limite de perguntas para usuário novo'),
            ('limite_usuario_basico', '10', 'Limite de perguntas para usuário básico'),
            ('valor_assinatura_mensal', '29.90', 'Valor da assinatura mensal em R$'),
            ('mensagem_limite_atingido', 'Você atingiu o limite de perguntas!', 'Mensagem quando limite é atingido'),
            ('url_termos_privacidade', 'https://multibpo.com.br/politica', 'URL dos termos e política'),
            ('whatsapp_ativo', 'true', 'Se o sistema WhatsApp está ativo'),
        ]
        
        for chave, valor, descricao in configuracoes_default:
            cls.objects.get_or_create(
                chave=chave,
                defaults={
                    'valor': valor,
                    'descricao': descricao,
                    'ativo': True
                }
            )

class EmailVerificationToken(models.Model):
    """
    Token para verificação de email de usuários vindos do WhatsApp
    Integra com sistema de limites existente do WhatsAppUser
    """
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='email_verification_token',
        verbose_name='Usuário'
    )
    token = models.CharField(
        max_length=64, 
        unique=True,
        verbose_name='Token de Verificação'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    verified_at = models.DateTimeField(
        null=True, 
        blank=True,
        verbose_name='Verificado em'
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Está Verificado'
    )
    
    # Campos de auditoria
    ip_address = models.GenericIPAddressField(
        null=True, 
        blank=True,
        verbose_name='IP do Cadastro'
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name='User Agent'
    )
    
    class Meta:
        db_table = 'whatsapp_email_verification_tokens'
        verbose_name = 'Token de Verificação de Email'
        verbose_name_plural = 'Tokens de Verificação de Email'
        ordering = ['-created_at']
    
    def __str__(self):
        status = '✅ Verificado' if self.is_verified else '⏳ Pendente'
        return f"Token {self.user.email} - {status}"
    
    def is_expired(self):
        """
        Verifica se token expirou (1 hora conforme settings)
        """
        from django.conf import settings
        expiry_time = self.created_at + settings.EMAIL_VERIFICATION_TOKEN_LIFETIME
        return timezone.now() > expiry_time
    
    def verify(self):
        """
        Marca token como verificado e integra com WhatsAppUser existente
        """
        if self.is_expired():
            return False, "Token expirado"
        
        if self.is_verified:
            return True, "Já verificado anteriormente"
        
        try:
            # Marcar token como verificado
            self.is_verified = True
            self.verified_at = timezone.now()
            self.save()
            
            # Ativar usuário Django
            self.user.is_active = True
            self.user.save()
            
            # Integrar com WhatsAppUser existente usando método verificar_email()
            try:
                whatsapp_user = WhatsAppUser.objects.get(email=self.user.email)
                # Usar método existente do WhatsAppUser
                whatsapp_user.verificar_email()  # Já faz upgrade para 'basico'
                
            except WhatsAppUser.DoesNotExist:
                # Se não existe WhatsAppUser, criar um básico
                WhatsAppUser.objects.create(
                    user=self.user,
                    email=self.user.email,
                    nome=self.user.get_full_name() or self.user.username,
                    plano_atual='basico',  # Direto para básico após verificação
                    limite_perguntas=10,
                    email_verificado=True,
                    email_verificado_em=timezone.now(),
                    ativo=True
                )
            
            return True, "Email verificado com sucesso"
            
        except Exception as e:
            return False, f"Erro ao verificar: {str(e)}"
    
    @classmethod
    def generate_token(cls, user, ip_address=None, user_agent=None):
        """
        Gera token único e seguro para usuário
        Remove tokens anteriores para evitar duplicatas
        """
        # Gerar token seguro de 48 caracteres
        token = secrets.token_urlsafe(48)
        
        # Remover token anterior se existir (um token por usuário)
        cls.objects.filter(user=user).delete()
        
        # Criar novo token
        return cls.objects.create(
            user=user,
            token=token,
            ip_address=ip_address,
            user_agent=user_agent[:500] if user_agent else ''  # Limitar tamanho
        )
    
    @classmethod
    def cleanup_expired_tokens(cls):
        """
        Remove tokens expirados (execução via cron/celery)
        """
        expired_tokens = []
        for token in cls.objects.filter(is_verified=False):
            if token.is_expired():
                expired_tokens.append(token.id)
        
        if expired_tokens:
            deleted_count = cls.objects.filter(id__in=expired_tokens).delete()[0]
            return deleted_count
        
        return 0
    
    def get_verification_url(self):
        """
        Retorna URL completa para verificação
        """
        from django.conf import settings
        return f"{settings.EMAIL_VERIFICATION_URL}/{self.token}"