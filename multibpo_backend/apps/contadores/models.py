"""
Models para gestão de contadores e escritórios contábeis
MultiBPO - Sub-Fase 2.2.2 - Adaptação para Novo Fluxo CPF/CNPJ + Receita Federal
VERSÃO ADAPTADA INCREMENTAL - Mantém compatibilidade com dados existentes
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField
from validate_docbr import CNPJ, CPF
import re
import json


class Escritorio(models.Model):
    """Model para dados dos escritórios de contabilidade e empresas"""
    
    # Dados Básicos Empresariais (mantidos do original)
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
    
    # Regime Tributário (mantido)
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
    
    # NOVO: Situação Cadastral (Receita Federal)
    SITUACAO_CHOICES = [
        ('ativa', 'Ativa'),
        ('suspensa', 'Suspensa'),
        ('inapta', 'Inapta'),
        ('baixada', 'Baixada'),
        ('nula', 'Nula'),
    ]
    situacao_cadastral = models.CharField(
        max_length=20,
        choices=SITUACAO_CHOICES,
        default='ativa',
        verbose_name="Situação Cadastral",
        help_text="Situação na Receita Federal"
    )
    
    # Endereço Completo (mantido, mas CEP opcional para criação automática)
    cep = models.CharField(
        max_length=9,
        verbose_name="CEP",
        blank=True,  # MUDANÇA: agora opcional
        validators=[
            RegexValidator(
                regex=r'^\d{5}-?\d{3}$',
                message='CEP deve estar no formato 00000-000'
            )
        ]
    )
    logradouro = models.CharField(
        max_length=200, 
        verbose_name="Logradouro",
        blank=True  # MUDANÇA: agora opcional
    )
    numero = models.CharField(
        max_length=10, 
        verbose_name="Número",
        blank=True  # MUDANÇA: agora opcional
    )
    complemento = models.CharField(max_length=100, verbose_name="Complemento", blank=True)
    bairro = models.CharField(
        max_length=100, 
        verbose_name="Bairro",
        blank=True  # MUDANÇA: agora opcional
    )
    cidade = models.CharField(
        max_length=100, 
        verbose_name="Cidade",
        blank=True  # MUDANÇA: agora opcional
    )
    estado = models.CharField(
        max_length=2,
        verbose_name="Estado (UF)",
        blank=True,  # MUDANÇA: agora opcional
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{2}$',
                message='Estado deve ter 2 letras maiúsculas (ex: SP)'
            )
        ]
    )
    
    # Dados de Contato (mantidos, mas opcionais para criação automática)
    telefone = PhoneNumberField(
        verbose_name="Telefone Principal", 
        region='BR',
        blank=True,  # MUDANÇA: agora opcional
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
        blank=True,  # MUDANÇA: agora opcional
        help_text="E-mail principal do escritório"
    )
    website = models.URLField(
        verbose_name="Website", 
        blank=True,
        help_text="Site do escritório (opcional)"
    )
    
    # Responsável Técnico (agora opcional)
    responsavel_tecnico = models.CharField(
        max_length=150, 
        verbose_name="Responsável Técnico",
        blank=True,  # MUDANÇA: agora opcional
        help_text="Nome do contador responsável técnico"
    )
    crc_responsavel = models.CharField(
        max_length=20, 
        verbose_name="CRC do Responsável",
        blank=True,  # MUDANÇA: agora opcional
        help_text="CRC do responsável técnico"
    )
    
    # NOVO: Controle de Criação Automática
    criado_automaticamente = models.BooleanField(
        default=False,
        verbose_name="Criado Automaticamente",
        help_text="Escritório criado via consulta CNPJ na Receita Federal"
    )
    
    # NOVO: Dados da Receita Federal
    dados_receita_federal = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Dados Receita Federal",
        help_text="Dados completos retornados pela API da Receita Federal"
    )
    
    # Status e Controle (mantidos)
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
    
    # Timestamps (mantidos)
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
        if not self.logradouro:
            return ""
        endereco = f"{self.logradouro}"
        if self.numero:
            endereco += f", {self.numero}"
        if self.complemento:
            endereco += f", {self.complemento}"
        if self.bairro:
            endereco += f" - {self.bairro}"
        if self.cidade and self.estado:
            endereco += f", {self.cidade}/{self.estado}"
        if self.cep:
            endereco += f" - CEP: {self.cep}"
        return endereco
    
    # NOVO: Método para criação via CNPJ
    @classmethod
    def criar_via_cnpj(cls, cnpj, dados_receita):
        """
        Cria escritório automaticamente baseado nos dados da Receita Federal
        """
        return cls.objects.create(
            cnpj=cnpj,
            razao_social=dados_receita.get('razao_social', ''),
            nome_fantasia=dados_receita.get('nome_fantasia', ''),
            situacao_cadastral=dados_receita.get('situacao', 'ativa').lower(),
            logradouro=dados_receita.get('logradouro', ''),
            numero=dados_receita.get('numero', ''),
            complemento=dados_receita.get('complemento', ''),
            bairro=dados_receita.get('bairro', ''),
            cidade=dados_receita.get('municipio', ''),
            estado=dados_receita.get('uf', ''),
            cep=dados_receita.get('cep', ''),
            telefone=dados_receita.get('telefone', ''),
            email=dados_receita.get('email', ''),
            criado_automaticamente=True,
            dados_receita_federal=dados_receita,
            ativo=True
        )


# MANTER Model Especialidade (para compatibilidade com dados existentes)
# Será marcado como deprecated mas mantido para não quebrar relacionamentos
class Especialidade(models.Model):
    """
    Model para especialidades contábeis
    DEPRECATED: Mantido apenas para compatibilidade com dados existentes
    Nova funcionalidade será via campo 'servicos_contratados' no model Contador
    """
    
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
        verbose_name = 'Especialidade Contábil (DEPRECATED)'
        verbose_name_plural = 'Especialidades Contábeis (DEPRECATED)'
        ordering = ['area_principal', 'nome']
    
    def __str__(self):
        return f"{self.nome} ({self.area_principal.title()})"


class Contador(models.Model):
    """Model para contadores profissionais e clientes BPO (adaptado para novo fluxo)"""
    
    # NOVO: Tipo de Pessoa
    TIPO_PESSOA_CHOICES = [
        ('fisica', 'Pessoa Física'),
        ('juridica', 'Pessoa Jurídica'),
    ]
    tipo_pessoa = models.CharField(
        max_length=20,
        choices=TIPO_PESSOA_CHOICES,
        default='fisica',  # Para compatibilidade com registros existentes
        verbose_name="Tipo de Pessoa",
        help_text="Pessoa Física (CPF) ou Jurídica (CNPJ)"
    )
    
    # NOVO: Documento Unificado (CPF ou CNPJ)
    documento = models.CharField(
        max_length=18, 
        verbose_name="CPF/CNPJ",
        help_text="CPF (pessoa física) ou CNPJ (pessoa jurídica)",
        null=True,  # Para migração dos dados existentes
        blank=True
    )
    
    # Relacionamentos (mantidos, mas escritorio agora opcional)
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
        related_name='contadores',
        null=True,  # MUDANÇA: agora opcional para PF
        blank=True
    )
    
    # Especialidades mantidas para compatibilidade (mas será deprecated)
    especialidades = models.ManyToManyField(
        Especialidade, 
        verbose_name="Especialidades (DEPRECATED)",
        blank=True, 
        help_text="Use campo 'servicos_contratados' para novos registros",
        related_name='contadores'
    )
    
    # Dados Pessoais (mantidos, mas cpf agora opcional devido ao campo documento)
    nome_completo = models.CharField(
        max_length=150, 
        verbose_name="Nome Completo/Razão Social",
        help_text="Nome completo (PF) ou razão social (PJ)"
    )
    cpf = models.CharField(
        max_length=14, 
        verbose_name="CPF (DEPRECATED)",
        help_text="Use campo 'documento' para novos registros",
        null=True,  # MUDANÇA: para compatibilidade
        blank=True
    )
    data_nascimento = models.DateField(
        verbose_name="Data de Nascimento/Fundação",
        help_text="Data nascimento (PF) ou fundação (PJ)",
        null=True,  # MUDANÇA: agora opcional
        blank=True
    )
    
    # Dados Profissionais (mantidos, mas agora opcionais)
    crc = models.CharField(
        max_length=20, 
        verbose_name="Registro CRC",
        help_text="Registro no CRC (apenas para contadores profissionais)",
        null=True,  # MUDANÇA: agora opcional
        blank=True
    )
    crc_estado = models.CharField(
        max_length=2, 
        verbose_name="Estado do CRC",
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^[A-Z]{2}$',
                message='Estado deve ter 2 letras maiúsculas'
            )
        ]
    )
    data_registro_crc = models.DateField(
        verbose_name="Data de Registro CRC",
        help_text="Data de registro no CRC",
        null=True,  # MUDANÇA: agora opcional
        blank=True
    )
    categoria_crc = models.CharField(
        max_length=20,
        verbose_name="Categoria CRC",
        choices=[
            ('contador', 'Contador'),
            ('tecnico', 'Técnico em Contabilidade'),
        ],
        default='contador',
        blank=True
    )
    
    # Contato (mantidos)
    telefone_pessoal = PhoneNumberField(
        verbose_name="Telefone Principal", 
        region='BR',
        help_text="Telefone principal de contato"
    )
    whatsapp_pessoal = PhoneNumberField(
        verbose_name="WhatsApp", 
        region='BR', 
        blank=True,
        help_text="WhatsApp para comunicação"
    )
    email_pessoal = models.EmailField(
        verbose_name="E-mail Alternativo", 
        blank=True,
        help_text="E-mail alternativo (além do login)"
    )
    
    # Cargo (expandido para incluir clientes BPO)
    CARGO_CHOICES = [
        ('proprietario', 'Proprietário/Sócio'),
        ('diretor', 'Diretor'),
        ('gerente', 'Gerente'),
        ('contador_senior', 'Contador Sênior'),
        ('contador_pleno', 'Contador Pleno'),
        ('contador_junior', 'Contador Júnior'),
        ('analista_contabil', 'Analista Contábil'),
        ('auxiliar_contabil', 'Auxiliar Contábil'),
        ('estagiario', 'Estagiário'),
        ('cliente_bpo', 'Cliente BPO'),  # NOVO
        ('outros', 'Outros'),  # NOVO
    ]
    cargo = models.CharField(
        max_length=100,
        verbose_name="Cargo/Função",
        choices=CARGO_CHOICES,
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
    
    # Formação (mantidos, mas agora opcionais)
    formacao = models.CharField(
        max_length=200, 
        verbose_name="Formação Acadêmica",
        help_text="Curso superior e instituição",
        blank=True  # MUDANÇA: agora opcional
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
    
    # NOVO: Serviços BPO Contratados (substitui especialidades)
    servicos_contratados = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Serviços BPO Contratados",
        help_text="Lista de serviços BPO ativos para este cliente"
    )
    
    # NOVO: Dados da Receita Federal (para PJ)
    dados_receita_federal = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Dados Receita Federal",
        help_text="Dados da empresa via CNPJ (se pessoa jurídica)"
    )
    
    # Status (mantidos, mas data_admissao agora opcional)
    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Cliente/contador ativo no sistema"
    )
    data_admissao = models.DateField(
        verbose_name="Data de Admissão/Cadastro",
        help_text="Data de entrada no escritório ou cadastro BPO",
        null=True,  # MUDANÇA: agora opcional
        blank=True
    )
    data_demissao = models.DateField(
        verbose_name="Data de Demissão/Cancelamento",
        null=True, 
        blank=True,
        help_text="Data de saída (se aplicável)"
    )
    observacoes = models.TextField(
        verbose_name="Observações",
        blank=True,
        help_text="Observações internas sobre o cliente/contador"
    )
    
    # Foto (mantida)
    foto = models.ImageField(
        upload_to='contadores/fotos/', 
        verbose_name="Foto do Perfil",
        blank=True, 
        null=True,
        help_text="Foto do perfil (opcional)"
    )
    
    # Timestamps (mantidos)
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
        verbose_name = 'Cliente/Contador'
        verbose_name_plural = 'Clientes/Contadores'
        ordering = ['nome_completo']
        
    def clean(self):
        super().clean()
        
        # Validar documento baseado no tipo de pessoa
        if self.documento:
            if self.tipo_pessoa == 'fisica':
                # Validar CPF
                cpf_validator = CPF()
                cpf_limpo = ''.join(filter(str.isdigit, self.documento))
                if not cpf_validator.validate(cpf_limpo):
                    raise ValidationError({'documento': 'CPF inválido'})
                # Formatação automática do CPF
                if len(cpf_limpo) == 11:
                    self.documento = f"{cpf_limpo[:3]}.{cpf_limpo[3:6]}.{cpf_limpo[6:9]}-{cpf_limpo[9:]}"
                    
            elif self.tipo_pessoa == 'juridica':
                # Validar CNPJ
                cnpj_validator = CNPJ()
                cnpj_limpo = ''.join(filter(str.isdigit, self.documento))
                if not cnpj_validator.validate(cnpj_limpo):
                    raise ValidationError({'documento': 'CNPJ inválido'})
                # Formatação automática do CNPJ
                if len(cnpj_limpo) == 14:
                    self.documento = f"{cnpj_limpo[:2]}.{cnpj_limpo[2:5]}.{cnpj_limpo[5:8]}/{cnpj_limpo[8:12]}-{cnpj_limpo[12:]}"
        
        # Validar CPF antigo para compatibilidade
        if self.cpf:
            cpf_validator = CPF()
            cpf_limpo = ''.join(filter(str.isdigit, self.cpf))
            if not cpf_validator.validate(cpf_limpo):
                raise ValidationError({'cpf': 'CPF inválido'})
            # Formatação automática do CPF
            if len(cpf_limpo) == 11:
                self.cpf = f"{cpf_limpo[:3]}.{cpf_limpo[3:6]}.{cpf_limpo[6:9]}-{cpf_limpo[9:]}"
        
        # Validar formato do CRC se informado
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
        
        # Responsável técnico deve ter CRC
        if self.eh_responsavel_tecnico and not self.crc:
            raise ValidationError({
                'eh_responsavel_tecnico': 'Responsável técnico deve ter CRC'
            })
    
    def save(self, *args, **kwargs):
        # Migração automática: se tem CPF mas não tem documento, migrar
        if self.cpf and not self.documento:
            self.documento = self.cpf
            self.tipo_pessoa = 'fisica'
        
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        if self.documento:
            tipo_display = "PF" if self.tipo_pessoa == 'fisica' else "PJ"
            doc_display = self.documento[:14] + "..." if len(self.documento) > 14 else self.documento
            return f"{self.nome_completo} ({tipo_display} - {doc_display})"
        elif self.crc:
            return f"{self.nome_completo} ({self.crc})"
        else:
            return self.nome_completo
    
    # Properties mantidas do original
    @property
    def nome_curto(self):
        """Retorna primeiro e último nome"""
        if self.tipo_pessoa == 'fisica':
            nomes = self.nome_completo.split()
            if len(nomes) >= 2:
                return f"{nomes[0]} {nomes[-1]}"
        return self.nome_completo
    
    @property
    def anos_experiencia(self):
        """Calcula anos de experiência baseado na data de registro CRC"""
        if self.data_registro_crc:
            from datetime import date
            hoje = date.today()
            delta = hoje - self.data_registro_crc
            return delta.days // 365
        return 0
    
    @property
    def especialidades_list(self):
        """Retorna lista de especialidades como string (DEPRECATED)"""
        return ", ".join([esp.nome for esp in self.especialidades.all()])
    
    @property
    def esta_ativo_escritorio(self):
        """Verifica se contador está ativo no escritório"""
        return self.ativo and not self.data_demissao
    
    # NOVAS Properties
    @property
    def esta_ativo_sistema(self):
        """Verifica se está ativo no sistema"""
        return (
            self.ativo and 
            self.user.is_active and 
            not self.data_demissao and
            (not self.escritorio or self.escritorio.ativo)
        )
    
    @property
    def tipo_cliente(self):
        """Retorna tipo de cliente baseado nos dados"""
        if self.crc:
            return "Contador Profissional"
        elif self.tipo_pessoa == 'juridica':
            return "Empresa"
        else:
            return "Pessoa Física"
    
    @property
    def documento_principal(self):
        """Retorna documento principal (novo ou antigo para compatibilidade)"""
        return self.documento or self.cpf
    
    # NOVOS Métodos Helper
    @classmethod
    def criar_pessoa_fisica(cls, user, cpf, nome_completo, telefone, **kwargs):
        """Método helper para criar pessoa física"""
        return cls.objects.create(
            user=user,
            tipo_pessoa='fisica',
            documento=cpf,
            nome_completo=nome_completo,
            telefone_pessoal=telefone,
            cargo='cliente_bpo',
            **kwargs
        )
    
    @classmethod
    def criar_pessoa_juridica(cls, user, cnpj, razao_social, telefone, dados_receita=None, **kwargs):
        """Método helper para criar pessoa jurídica"""
        return cls.objects.create(
            user=user,
            tipo_pessoa='juridica',
            documento=cnpj,
            nome_completo=razao_social,
            telefone_pessoal=telefone,
            cargo='proprietario',
            dados_receita_federal=dados_receita or {},
            **kwargs
        )