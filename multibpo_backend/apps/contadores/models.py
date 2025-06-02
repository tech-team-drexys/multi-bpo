"""
Models para gestão de contadores e escritórios contábeis
MultiBPO - Fase 2.1 - Artefato 3A - VERSÃO CORRIGIDA
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField
from validate_docbr import CNPJ, CPF
import re


class Escritorio(models.Model):
    """Model para dados dos escritórios de contabilidade"""
    
    # Dados Básicos Empresariais
    razao_social = models.CharField(
        max_length=200, 
        verbose_name="Razão Social",
        help_text="Razão social completa do escritório"
    )
    nome_fantasia = models.CharField(
        max_length=150, 
        verbose_name="Nome Fantasia", 
        blank=True,
        help_text="Nome fantasia do escritório (opcional)"
    )
    cnpj = models.CharField(
        max_length=18, 
        unique=True, 
        verbose_name="CNPJ",
        help_text="CNPJ do escritório com validação automática"
    )
    
    # Regime Tributário
    REGIME_CHOICES = [
        ('simples', 'Simples Nacional'),
        ('presumido', 'Lucro Presumido'),
        ('real', 'Lucro Real'),
        ('mei', 'Microempreendedor Individual'),
    ]
    regime_tributario = models.CharField(
        max_length=20, 
        choices=REGIME_CHOICES, 
        default='simples',
        verbose_name="Regime Tributário"
    )
    
    # Endereço Completo
    cep = models.CharField(
        max_length=9,
        verbose_name="CEP",
        validators=[
            RegexValidator(
                regex=r'^\d{5}-?\d{3}$',
                message='CEP deve estar no formato 00000-000'
            )
        ]
    )
    logradouro = models.CharField(max_length=200, verbose_name="Logradouro")
    numero = models.CharField(max_length=10, verbose_name="Número")
    complemento = models.CharField(max_length=100, verbose_name="Complemento", blank=True)
    bairro = models.CharField(max_length=100, verbose_name="Bairro")
    cidade = models.CharField(max_length=100, verbose_name="Cidade")
    estado = models.CharField(
        max_length=2,
        verbose_name="Estado (UF)",
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{2}$',
                message='Estado deve ter 2 letras maiúsculas (ex: SP)'
            )
        ]
    )
    
    # Dados de Contato
    telefone = PhoneNumberField(
        verbose_name="Telefone Principal", 
        region='BR',
        help_text="Telefone principal do escritório"
    )
    whatsapp = PhoneNumberField(
        verbose_name="WhatsApp", 
        region='BR', 
        blank=True,
        help_text="WhatsApp para integração futura"
    )
    email = models.EmailField(
        verbose_name="E-mail Principal",
        help_text="E-mail principal do escritório"
    )
    website = models.URLField(
        verbose_name="Website", 
        blank=True,
        help_text="Site do escritório (opcional)"
    )
    
    # Responsável Técnico
    responsavel_tecnico = models.CharField(
        max_length=150, 
        verbose_name="Responsável Técnico",
        help_text="Nome do contador responsável técnico"
    )
    crc_responsavel = models.CharField(
        max_length=20, 
        verbose_name="CRC do Responsável",
        help_text="CRC do responsável técnico"
    )
    
    # Status e Controle
    ativo = models.BooleanField(
        default=True, 
        verbose_name="Ativo",
        help_text="Escritório ativo no sistema"
    )
    observacoes = models.TextField(
        verbose_name="Observações", 
        blank=True,
        help_text="Observações internas"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Criado em"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Atualizado em"
    )

    class Meta:
        db_table = 'contadores_escritorio'
        verbose_name = 'Escritório Contábil'
        verbose_name_plural = 'Escritórios Contábeis'
        ordering = ['razao_social']
        
    def clean(self):
        super().clean()
        if self.cnpj:
            cnpj_validator = CNPJ()
            cnpj_limpo = ''.join(filter(str.isdigit, self.cnpj))
            if not cnpj_validator.validate(cnpj_limpo):
                raise ValidationError({'cnpj': 'CNPJ inválido'})
            # Formatação automática
            if len(cnpj_limpo) == 14:
                self.cnpj = f"{cnpj_limpo[:2]}.{cnpj_limpo[2:5]}.{cnpj_limpo[5:8]}/{cnpj_limpo[8:12]}-{cnpj_limpo[12:]}"
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.nome_fantasia or self.razao_social} ({self.cnpj})"
    
    @property
    def endereco_completo(self):
        endereco = f"{self.logradouro}, {self.numero}"
        if self.complemento:
            endereco += f", {self.complemento}"
        endereco += f" - {self.bairro}, {self.cidade}/{self.estado} - CEP: {self.cep}"
        return endereco


class Especialidade(models.Model):
    """Model para especialidades contábeis"""
    
    nome = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name="Nome da Especialidade",
        help_text="Nome da especialidade contábil"
    )
    codigo = models.CharField(
        max_length=10, 
        unique=True, 
        verbose_name="Código",
        help_text="Código identificador da especialidade"
    )
    descricao = models.TextField(
        verbose_name="Descrição",
        help_text="Descrição detalhada da especialidade"
    )
    
    area_principal = models.CharField(
        max_length=50,
        verbose_name="Área Principal",
        choices=[
            ('contabil', 'Contábil'),
            ('fiscal', 'Fiscal/Tributária'),
            ('trabalhista', 'Trabalhista'),
            ('societaria', 'Societária'),
            ('pericial', 'Perícia Contábil'),
            ('auditoria', 'Auditoria'),
            ('consultoria', 'Consultoria'),
            ('financeira', 'Financeira'),
        ],
        default='contabil'
    )
    
    requer_certificacao = models.BooleanField(
        default=False,
        verbose_name="Requer Certificação",
        help_text="Especialidade que requer certificação específica"
    )
    ativa = models.BooleanField(
        default=True,
        verbose_name="Ativa",
        help_text="Especialidade disponível para seleção"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Criado em"
    )

    class Meta:
        db_table = 'contadores_especialidade'
        verbose_name = 'Especialidade Contábil'
        verbose_name_plural = 'Especialidades Contábeis'
        ordering = ['area_principal', 'nome']
    
    def __str__(self):
        return f"{self.nome} ({self.area_principal.title()})"


class Contador(models.Model):
    """Model para dados dos contadores profissionais"""
    
    # Relacionamentos
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        verbose_name="Usuário do Sistema",
        help_text="Usuário Django vinculado ao contador"
    )
    escritorio = models.ForeignKey(
        Escritorio, 
        on_delete=models.PROTECT, 
        verbose_name="Escritório",
        help_text="Escritório onde o contador trabalha",
        related_name='contadores'
    )
    especialidades = models.ManyToManyField(
        Especialidade, 
        verbose_name="Especialidades",
        blank=True, 
        help_text="Especialidades do contador",
        related_name='contadores'
    )
    
    # Dados Pessoais
    nome_completo = models.CharField(
        max_length=150, 
        verbose_name="Nome Completo",
        help_text="Nome completo do contador"
    )
    cpf = models.CharField(
        max_length=14, 
        unique=True, 
        verbose_name="CPF",
        help_text="CPF do contador com validação"
    )
    data_nascimento = models.DateField(
        verbose_name="Data de Nascimento",
        help_text="Data de nascimento do contador"
    )
    
    # Dados Profissionais
    crc = models.CharField(
        max_length=20, 
        unique=True, 
        verbose_name="Registro CRC",
        help_text="Registro no CRC (ex: CRC-SP 123456/O-7)"
    )
    crc_estado = models.CharField(
        max_length=2, 
        verbose_name="Estado do CRC",
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{2}$',
                message='Estado deve ter 2 letras maiúsculas'
            )
        ]
    )
    data_registro_crc = models.DateField(
        verbose_name="Data de Registro CRC",
        help_text="Data de registro no CRC"
    )
    categoria_crc = models.CharField(
        max_length=20,
        verbose_name="Categoria CRC",
        choices=[
            ('contador', 'Contador'),
            ('tecnico', 'Técnico em Contabilidade'),
        ],
        default='contador'
    )
    
    # Contato
    telefone_pessoal = PhoneNumberField(
        verbose_name="Telefone Pessoal", 
        region='BR',
        help_text="Telefone pessoal do contador"
    )
    whatsapp_pessoal = PhoneNumberField(
        verbose_name="WhatsApp Pessoal", 
        region='BR', 
        blank=True,
        help_text="WhatsApp pessoal (opcional)"
    )
    email_pessoal = models.EmailField(
        verbose_name="E-mail Pessoal", 
        blank=True,
        help_text="E-mail pessoal (opcional)"
    )
    
    # Cargo
    cargo = models.CharField(
        max_length=100,
        verbose_name="Cargo",
        choices=[
            ('diretor', 'Diretor'),
            ('gerente', 'Gerente'),
            ('contador_senior', 'Contador Sênior'),
            ('contador_pleno', 'Contador Pleno'),
            ('contador_junior', 'Contador Júnior'),
            ('analista_contabil', 'Analista Contábil'),
            ('auxiliar_contabil', 'Auxiliar Contábil'),
            ('estagiario', 'Estagiário'),
        ],
        default='contador_pleno'
    )
    
    eh_responsavel_tecnico = models.BooleanField(
        default=False,
        verbose_name="É Responsável Técnico",
        help_text="Este contador é responsável técnico do escritório"
    )
    pode_assinar_documentos = models.BooleanField(
        default=False,
        verbose_name="Pode Assinar Documentos",
        help_text="Contador autorizado a assinar documentos oficiais"
    )
    
    # Formação
    formacao = models.CharField(
        max_length=200, 
        verbose_name="Formação Acadêmica",
        help_text="Curso superior e instituição"
    )
    pos_graduacao = models.CharField(
        max_length=200, 
        verbose_name="Pós-Graduação",
        blank=True,
        help_text="Cursos de pós-graduação (opcional)"
    )
    certificacoes = models.TextField(
        verbose_name="Certificações",
        blank=True,
        help_text="Certificações profissionais adicionais"
    )
    
    # Status
    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Contador ativo no sistema"
    )
    data_admissao = models.DateField(
        verbose_name="Data de Admissão",
        help_text="Data de admissão no escritório"
    )
    data_demissao = models.DateField(
        verbose_name="Data de Demissão",
        null=True, 
        blank=True,
        help_text="Data de demissão (se aplicável)"
    )
    observacoes = models.TextField(
        verbose_name="Observações",
        blank=True,
        help_text="Observações internas sobre o contador"
    )
    
    # Foto
    foto = models.ImageField(
        upload_to='contadores/fotos/', 
        verbose_name="Foto do Perfil",
        blank=True, 
        null=True,
        help_text="Foto do perfil do contador"
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Criado em"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Atualizado em"
    )

    class Meta:
        db_table = 'contadores_contador'
        verbose_name = 'Contador'
        verbose_name_plural = 'Contadores'
        ordering = ['nome_completo']
        
    def clean(self):
        super().clean()
        
        # Validar CPF brasileiro
        if self.cpf:
            cpf_validator = CPF()
            cpf_limpo = ''.join(filter(str.isdigit, self.cpf))
            if not cpf_validator.validate(cpf_limpo):
                raise ValidationError({'cpf': 'CPF inválido'})
            # Formatação automática do CPF
            if len(cpf_limpo) == 11:
                self.cpf = f"{cpf_limpo[:3]}.{cpf_limpo[3:6]}.{cpf_limpo[6:9]}-{cpf_limpo[9:]}"
        
        # Validar formato do CRC (CORRIGIDO)
        if self.crc:
            crc_pattern = r'^CRC-[A-Z]{2}\s+\d+/[OT]-\d+$'
            if not re.match(crc_pattern, self.crc):
                raise ValidationError({
                    'crc': 'CRC deve estar no formato: CRC-UF 123456/O-7 ou CRC-UF 123456/T-8'
                })
        
        # Validar datas consistentes
        if self.data_demissao and self.data_admissao:
            if self.data_demissao <= self.data_admissao:
                raise ValidationError({
                    'data_demissao': 'Data de demissão deve ser posterior à data de admissão'
                })
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.nome_completo} ({self.crc})"
    
    @property
    def nome_curto(self):
        """Retorna primeiro e último nome"""
        nomes = self.nome_completo.split()
        if len(nomes) >= 2:
            return f"{nomes[0]} {nomes[-1]}"
        return self.nome_completo
    
    @property
    def anos_experiencia(self):
        """Calcula anos de experiência baseado na data de registro CRC"""
        from datetime import date
        hoje = date.today()
        delta = hoje - self.data_registro_crc
        return delta.days // 365
    
    @property
    def especialidades_list(self):
        """Retorna lista de especialidades como string"""
        return ", ".join([esp.nome for esp in self.especialidades.all()])
    
    @property
    def esta_ativo_escritorio(self):
        """Verifica se contador está ativo no escritório"""
        return self.ativo and not self.data_demissao