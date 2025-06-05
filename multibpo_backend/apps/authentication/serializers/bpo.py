"""
Serializers de Autenticação - Novo Fluxo BPO
MultiBPO Sub-Fase 2.2.3 - APIs Adaptadas para CPF/CNPJ + Receita Federal

Mantém compatibilidade total com serializers existentes
Adiciona novos serializers para fluxo simplificado
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from django.utils import timezone
from validate_docbr import CPF, CNPJ
import re
import logging

from apps.contadores.models import Contador, Escritorio
from apps.contadores.serializers import ContadorPerfilSerializer

logger = logging.getLogger(__name__)


# ========== SERIALIZERS EXISTENTES (MANTIDOS) ==========

class ContadorRegistroSerializer(serializers.Serializer):
    """
    Serializer original para registro completo de Contador
    MANTIDO para compatibilidade com implementações existentes
    """
    
    # Dados do User Django
    username = serializers.CharField(max_length=150, help_text="Nome de usuário único")
    email = serializers.EmailField(help_text="Email será usado para login")
    password = serializers.CharField(write_only=True, min_length=8, help_text="Senha deve ter pelo menos 8 caracteres")
    password_confirm = serializers.CharField(write_only=True, help_text="Confirmação da senha")
    first_name = serializers.CharField(max_length=30, help_text="Primeiro nome")
    last_name = serializers.CharField(max_length=150, help_text="Sobrenome")

    # Dados pessoais do Contador
    nome_completo = serializers.CharField(max_length=150, help_text="Nome completo do contador")
    cpf = serializers.CharField(max_length=14, help_text="CPF do contador")
    data_nascimento = serializers.DateField(help_text="Data de nascimento")

    # Dados profissionais obrigatórios
    crc = serializers.CharField(max_length=20, help_text="Registro CRC")
    crc_estado = serializers.CharField(max_length=2, help_text="Estado do CRC")
    data_registro_crc = serializers.DateField(help_text="Data de registro no CRC")
    categoria_crc = serializers.ChoiceField(choices=[('contador', 'Contador'), ('tecnico', 'Técnico')], default='contador')

    # Contato obrigatório
    telefone_pessoal = serializers.CharField(max_length=20, help_text="Telefone pessoal brasileiro")

    # Dados profissionais
    cargo = serializers.ChoiceField(
        choices=[
            ('diretor', 'Diretor'), ('gerente', 'Gerente'),
            ('contador_senior', 'Contador Sênior'), ('contador_pleno', 'Contador Pleno'),
            ('contador_junior', 'Contador Júnior'), ('analista_contabil', 'Analista Contábil'),
            ('auxiliar_contabil', 'Auxiliar Contábil'), ('estagiario', 'Estagiário'),
        ],
        default='contador_pleno'
    )
    formacao = serializers.CharField(max_length=200, help_text="Formação acadêmica principal")
    data_admissao = serializers.DateField(help_text="Data de admissão no escritório")

    # Relacionamentos obrigatórios
    escritorio_id = serializers.IntegerField(help_text="ID do escritório onde trabalhará")
    especialidades_ids = serializers.ListField(child=serializers.IntegerField(), required=False, help_text="Lista de IDs das especialidades")

    # Campos opcionais
    whatsapp_pessoal = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email_pessoal = serializers.EmailField(required=False, allow_blank=True)
    pos_graduacao = serializers.CharField(max_length=200, required=False, allow_blank=True)
    certificacoes = serializers.CharField(required=False, allow_blank=True)
    eh_responsavel_tecnico = serializers.BooleanField(default=False)
    pode_assinar_documentos = serializers.BooleanField(default=False)
    observacoes = serializers.CharField(required=False, allow_blank=True)

    # Validações mantidas do código original
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        return value.lower().strip()

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")
        return value.lower().strip()

    def validate_cpf(self, value):
        cpf_clean = ''.join(filter(str.isdigit, value))
        cpf_validator = CPF()
        if not cpf_validator.validate(cpf_clean):
            raise serializers.ValidationError("CPF inválido.")
        if Contador.objects.filter(cpf__contains=cpf_clean).exists():
            raise serializers.ValidationError("Já existe um contador com este CPF.")
        return f"{cpf_clean[:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:]}"

    def validate_crc(self, value):
        crc_pattern = r'^CRC-[A-Z]{2}\s+\d+/[OT]-\d+$'
        if not re.match(crc_pattern, value.upper()):
            raise serializers.ValidationError("CRC inválido.")
        if Contador.objects.filter(crc__iexact=value).exists():
            raise serializers.ValidationError("Já existe um contador com este CRC.")
        return value.upper()

    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'As senhas não coincidem.'})
        return data

    @transaction.atomic
    def create(self, validated_data):
        # Implementação mantida do código original
        user_data = {
            'username': validated_data.get('username'),
            'email': validated_data.get('email'),
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', ''),
            'password': validated_data.get('password'),
        }

        especialidades_ids = validated_data.pop('especialidades_ids', [])
        user = User.objects.create_user(**user_data)
        
        contador_data = validated_data.copy()
        for campo in ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']:
            contador_data.pop(campo, None)
            
        escritorio = Escritorio.objects.get(id=contador_data.pop('escritorio_id'))
        contador_data['escritorio'] = escritorio
        contador_data['user'] = user
        
        contador = Contador.objects.create(**contador_data)
        
        if especialidades_ids:
            from apps.contadores.models import Especialidade
            especialidades = Especialidade.objects.filter(id__in=especialidades_ids, ativa=True)
            contador.especialidades.set(especialidades)
            
        return contador


class ContadorLoginSerializer(serializers.Serializer):
    """
    Serializer original para login de contadores
    MANTIDO para compatibilidade
    """
    
    login = serializers.CharField(max_length=150, help_text="Email, CRC ou username")
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validated_user = None
        self.validated_contador = None
        self.detected_login_type = None

    def detect_login_type(self, login):
        if '@' in login and '.' in login.split('@')[-1]:
            return 'email'
        crc_pattern = r'^crc-[a-z]{2}\s+\d+/[ot]-\d+$'
        if re.match(crc_pattern, login.lower()):
            return 'crc'
        return 'username'

    def find_user_by_login_type(self, login, login_type):
        try:
            if login_type == 'email':
                return User.objects.select_related().get(email=login)
            elif login_type == 'crc':
                contador = Contador.objects.select_related('user').get(crc=login.upper())
                return contador.user
            elif login_type == 'username':
                return User.objects.select_related().get(username=login)
        except (User.DoesNotExist, Contador.DoesNotExist):
            return None

    def validate(self, data):
        login = data.get('login')
        password = data.get('password')

        self.detected_login_type = self.detect_login_type(login)
        user = self.find_user_by_login_type(login, self.detected_login_type)
        
        if not user:
            raise serializers.ValidationError({'login': 'Nenhuma conta encontrada com este dado de login.'})
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Senha incorreta.'})
        if not user.is_active:
            raise serializers.ValidationError({'login': 'Esta conta está desativada.'})

        try:
            contador = Contador.objects.select_related('escritorio').get(user=user)
        except Contador.DoesNotExist:
            raise serializers.ValidationError({'login': 'Conta sem perfil de contador.'})

        if not contador.ativo:
            raise serializers.ValidationError({'login': 'Perfil de contador desativado.'})

        self.validated_user = user
        self.validated_contador = contador
        
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        return data


# ========== NOVOS SERIALIZERS PARA FLUXO BPO ==========

class DocumentoValidationSerializer(serializers.Serializer):
    """
    Serializer para validação de CPF/CNPJ em tempo real
    Usado em: POST /api/v1/validate/document/
    """
    
    documento = serializers.CharField(
        max_length=18,
        help_text="CPF ou CNPJ para validar"
    )
    tipo = serializers.ChoiceField(
        choices=[('cpf', 'CPF'), ('cnpj', 'CNPJ')],
        required=False,
        help_text="Tipo de documento (opcional, detectado automaticamente)"
    )
    
    def validate_documento(self, value):
        """Validação básica de formato"""
        documento_clean = ''.join(filter(str.isdigit, value))
        
        if len(documento_clean) == 11:
            # Validar CPF
            cpf_validator = CPF()
            if not cpf_validator.validate(documento_clean):
                raise serializers.ValidationError("CPF inválido")
            return f"{documento_clean[:3]}.{documento_clean[3:6]}.{documento_clean[6:9]}-{documento_clean[9:]}"
            
        elif len(documento_clean) == 14:
            # Validar CNPJ
            cnpj_validator = CNPJ()
            if not cnpj_validator.validate(documento_clean):
                raise serializers.ValidationError("CNPJ inválido")
            return f"{documento_clean[:2]}.{documento_clean[2:5]}.{documento_clean[5:8]}/{documento_clean[8:12]}-{documento_clean[12:]}"
            
        else:
            raise serializers.ValidationError("Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)")
    
    def validate(self, data):
        documento = data.get('documento')
        documento_clean = ''.join(filter(str.isdigit, documento))
        
        # Detectar tipo automaticamente se não informado
        if not data.get('tipo'):
            if len(documento_clean) == 11:
                data['tipo'] = 'cpf'
            elif len(documento_clean) == 14:
                data['tipo'] = 'cnpj'
        
        # Verificar se já existe no sistema
        documento_formatado = self.validate_documento(documento)
        
        if data['tipo'] == 'cpf':
            # Verificar no campo documento (novo) e cpf (legado)
            exists = Contador.objects.filter(
                models.Q(documento=documento_formatado) | 
                models.Q(cpf=documento_formatado)
            ).exists()
        else:
            # Verificar CNPJ no Contador (PJ) e Escritorio
            exists = (
                Contador.objects.filter(documento=documento_formatado).exists() or
                Escritorio.objects.filter(cnpj=documento_formatado).exists()
            )
        
        data['available'] = not exists
        data['formatted'] = documento_formatado
        
        return data


class BPORegistroSerializer(serializers.Serializer):
    """
    Serializer para registro simplificado de serviços BPO
    Usado em: POST /api/v1/auth/register-service/
    
    Suporta tanto Pessoa Física (CPF) quanto Pessoa Jurídica (CNPJ)
    """
    
    # Dados de login (obrigatórios)
    email = serializers.EmailField(help_text="Email para login")
    password = serializers.CharField(write_only=True, min_length=8, help_text="Senha mínimo 8 caracteres")
    password_confirm = serializers.CharField(write_only=True, help_text="Confirmação da senha")
    
    # Documento único (obrigatório)
    documento = serializers.CharField(max_length=18, help_text="CPF ou CNPJ")
    
    # Contato (obrigatório)
    telefone = serializers.CharField(max_length=20, help_text="Telefone principal")
    
    # Dados pessoais/empresariais (condicionais)
    nome_completo = serializers.CharField(
        max_length=150, 
        required=False, 
        allow_blank=True,
        help_text="Nome completo (PF) ou será preenchido automaticamente (PJ)"
    )
    
    # Opções para PJ
    usar_dados_receita = serializers.BooleanField(
        default=True,
        help_text="Se true, busca dados automáticos da Receita Federal (apenas CNPJ)"
    )
    
    # Campos calculados (read-only)
    tipo_pessoa = serializers.CharField(read_only=True)
    dados_receita = serializers.JSONField(read_only=True)
    escritorio_criado = serializers.BooleanField(read_only=True)
    
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Já existe uma conta com este email.")
        return value.lower().strip()
    
    def validate_documento(self, value):
        """Validação e formatação de CPF/CNPJ"""
        documento_clean = ''.join(filter(str.isdigit, value))
        
        if len(documento_clean) == 11:
            # Validar CPF
            cpf_validator = CPF()
            if not cpf_validator.validate(documento_clean):
                raise serializers.ValidationError("CPF inválido")
            
            # Verificar duplicatas
            if Contador.objects.filter(
                models.Q(documento__contains=documento_clean) | 
                models.Q(cpf__contains=documento_clean)
            ).exists():
                raise serializers.ValidationError("Já existe um cadastro com este CPF.")
                
            return f"{documento_clean[:3]}.{documento_clean[3:6]}.{documento_clean[6:9]}-{documento_clean[9:]}"
            
        elif len(documento_clean) == 14:
            # Validar CNPJ
            cnpj_validator = CNPJ()
            if not cnpj_validator.validate(documento_clean):
                raise serializers.ValidationError("CNPJ inválido")
            
            # Verificar duplicatas
            cnpj_formatado = f"{documento_clean[:2]}.{documento_clean[2:5]}.{documento_clean[5:8]}/{documento_clean[8:12]}-{documento_clean[12:]}"
            if (Contador.objects.filter(documento=cnpj_formatado).exists() or 
                Escritorio.objects.filter(cnpj=cnpj_formatado).exists()):
                raise serializers.ValidationError("Já existe um cadastro com este CNPJ.")
                
            return cnpj_formatado
            
        else:
            raise serializers.ValidationError("Documento deve ser um CPF (11 dígitos) ou CNPJ (14 dígitos)")
    
    def validate(self, data):
        # Validar senhas
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'As senhas não coincidem.'})
        
        # Detectar tipo de pessoa baseado no documento
        documento_clean = ''.join(filter(str.isdigit, data['documento']))
        if len(documento_clean) == 11:
            data['tipo_pessoa'] = 'fisica'
            # Para PF, nome é obrigatório
            if not data.get('nome_completo'):
                raise serializers.ValidationError({'nome_completo': 'Nome completo é obrigatório para pessoa física.'})
        else:
            data['tipo_pessoa'] = 'juridica'
            # Para PJ, buscar dados da Receita Federal se solicitado
            if data.get('usar_dados_receita', True):
                # TODO: Integrar com API da Receita Federal
                # Por enquanto, simular dados
                data['dados_receita'] = {
                    'razao_social': 'Empresa Exemplo Ltda',
                    'nome_fantasia': 'Exemplo Corp',
                    'situacao': 'ATIVA'
                }
                # Se não tem nome_completo, usar razão social
                if not data.get('nome_completo'):
                    data['nome_completo'] = data['dados_receita'].get('razao_social', '')
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """
        Criação inteligente baseada no tipo de pessoa
        """
        try:
            # Extrair dados
            tipo_pessoa = validated_data['tipo_pessoa']
            documento = validated_data['documento']
            email = validated_data['email']
            password = validated_data['password']
            nome_completo = validated_data['nome_completo']
            telefone = validated_data['telefone']
            dados_receita = validated_data.get('dados_receita', {})
            
            # Criar User Django
            username = email.split('@')[0]  # Usar parte do email como username
            
            # Garantir username único
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=nome_completo.split()[0] if nome_completo else '',
                last_name=' '.join(nome_completo.split()[1:]) if len(nome_completo.split()) > 1 else ''
            )
            
            logger.info(f"User criado: {user.username} (ID: {user.id})")
            
            # Preparar dados do contador
            contador_data = {
                'user': user,
                'tipo_pessoa': tipo_pessoa,
                'documento': documento,
                'nome_completo': nome_completo,
                'telefone_pessoal': telefone,
                'cargo': 'cliente_bpo',
                'ativo': True
            }
            
            escritorio_criado = False
            
            if tipo_pessoa == 'juridica':
                # Para PJ, criar escritório automaticamente
                if dados_receita:
                    escritorio = Escritorio.criar_via_cnpj(documento, dados_receita)
                    contador_data['escritorio'] = escritorio
                    contador_data['dados_receita_federal'] = dados_receita
                    escritorio_criado = True
                    logger.info(f"Escritório criado automaticamente: {escritorio.razao_social}")
                else:
                    # Criar escritório básico se não tem dados da Receita
                    escritorio = Escritorio.objects.create(
                        cnpj=documento,
                        razao_social=nome_completo,
                        nome_fantasia=nome_completo,
                        email=email,
                        telefone=telefone,
                        criado_automaticamente=True,
                        ativo=True
                    )
                    contador_data['escritorio'] = escritorio
                    escritorio_criado = True
            
            # Criar Contador
            contador = Contador.objects.create(**contador_data)
            
            logger.info(f"Contador BPO criado: {contador.nome_completo} (ID: {contador.id})")
            
            # Adicionar dados de retorno
            validated_data['user_id'] = user.id
            validated_data['contador_id'] = contador.id
            validated_data['escritorio_criado'] = escritorio_criado
            
            return contador
            
        except Exception as e:
            logger.error(f"Erro na criação de conta BPO: {e}")
            raise serializers.ValidationError({
                'non_field_errors': 'Erro interno na criação da conta. Tente novamente.'
            })
    
    def to_representation(self, instance):
        """Retorna dados completos do registro criado"""
        data = super().to_representation(instance)
        
        # Adicionar dados do contador criado
        if instance:
            data.update({
                'success': True,
                'message': f'Conta BPO criada com sucesso para {instance.nome_completo}!',
                'user_id': instance.user.id,
                'contador_id': instance.id,
                'tipo_pessoa': instance.tipo_pessoa,
                'escritorio_criado': bool(instance.escritorio),
                'dados_receita': instance.dados_receita_federal if hasattr(instance, 'dados_receita_federal') else {}
            })
        
        return data