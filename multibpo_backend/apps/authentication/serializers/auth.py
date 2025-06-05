"""
Serializers de Autenticação JWT
MultiBPO Sub-Fase 2.2.2 - Artefato 1A

Implementa ContadorRegistroSerializer para registro completo com validações brasileiras
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from validate_docbr import CPF
import re
import logging

from apps.contadores.models import Contador, Escritorio, Especialidade
from apps.contadores.serializers import ContadorPerfilSerializer

logger = logging.getLogger(__name__)


class ContadorRegistroSerializer(serializers.Serializer):
    """
    Serializer para registro completo de Contador

    Cria automaticamente:
    - User Django (username, email, password, first_name, last_name)
    - Contador (dados profissionais completos)
    - Vinculação com Escritório existente
    - Associação com Especialidades

    Usado em: POST /api/v1/auth/register/
    """

    # Dados do User Django
    username = serializers.CharField(max_length=150, help_text="Nome de usuário único (recomendado: email ou CRC)")
    email = serializers.EmailField(help_text="Email será usado para login")
    password = serializers.CharField(write_only=True, min_length=8, help_text="Senha deve ter pelo menos 8 caracteres")
    password_confirm = serializers.CharField(write_only=True, help_text="Confirmação da senha")
    first_name = serializers.CharField(max_length=30, help_text="Primeiro nome")
    last_name = serializers.CharField(max_length=150, help_text="Sobrenome")

    # Dados pessoais do Contador
    nome_completo = serializers.CharField(max_length=150, help_text="Nome completo do contador")
    cpf = serializers.CharField(max_length=14, help_text="CPF do contador (com ou sem formatação)")
    data_nascimento = serializers.DateField(help_text="Data de nascimento (YYYY-MM-DD)")

    # Dados profissionais obrigatórios
    crc = serializers.CharField(max_length=20, help_text="Registro CRC (ex: CRC-SP 123456/O-7)")
    crc_estado = serializers.CharField(max_length=2, help_text="Estado do CRC (ex: SP)")
    data_registro_crc = serializers.DateField(help_text="Data de registro no CRC")
    categoria_crc = serializers.ChoiceField(choices=[('contador', 'Contador'), ('tecnico', 'Técnico em Contabilidade')], default='contador')

    # Contato obrigatório
    telefone_pessoal = serializers.CharField(max_length=20, help_text="Telefone pessoal brasileiro")

    # Dados profissionais
    cargo = serializers.ChoiceField(
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
    formacao = serializers.CharField(max_length=200, help_text="Formação acadêmica principal")
    data_admissao = serializers.DateField(help_text="Data de admissão no escritório")

    # Relacionamentos obrigatórios
    escritorio_id = serializers.IntegerField(help_text="ID do escritório onde trabalhará")
    especialidades_ids = serializers.ListField(child=serializers.IntegerField(), required=False, help_text="Lista de IDs das especialidades (opcional)")

    # Campos opcionais
    whatsapp_pessoal = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email_pessoal = serializers.EmailField(required=False, allow_blank=True)
    pos_graduacao = serializers.CharField(max_length=200, required=False, allow_blank=True)
    certificacoes = serializers.CharField(required=False, allow_blank=True)
    eh_responsavel_tecnico = serializers.BooleanField(default=False)
    pode_assinar_documentos = serializers.BooleanField(default=False)
    observacoes = serializers.CharField(required=False, allow_blank=True)

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
            raise serializers.ValidationError("CPF inválido. Verifique os números digitados.")
        if Contador.objects.filter(cpf__contains=cpf_clean).exists():
            raise serializers.ValidationError("Já existe um contador cadastrado com este CPF.")
        return f"{cpf_clean[:3]}.{cpf_clean[3:6]}.{cpf_clean[6:9]}-{cpf_clean[9:]}"

    def validate_crc(self, value):
        crc_pattern = r'^CRC-[A-Z]{2}\s+\d+/[OT]-\d+$'
        if not re.match(crc_pattern, value.upper()):
            raise serializers.ValidationError("CRC deve estar no formato: CRC-UF 123456/O-7 ou CRC-UF 123456/T-8")
        if Contador.objects.filter(crc__iexact=value).exists():
            raise serializers.ValidationError("Já existe um contador cadastrado com este CRC.")
        return value.upper()

    def validate_crc_estado(self, value):
        value = value.upper().strip()
        ufs_validas = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
        if value not in ufs_validas:
            raise serializers.ValidationError(f"Estado deve ser uma UF válida: {', '.join(ufs_validas)}")
        return value

    def validate_escritorio_id(self, value):
        try:
            escritorio = Escritorio.objects.get(id=value)
            if not escritorio.ativo:
                raise serializers.ValidationError("Escritório está inativo e não pode receber novos contadores.")
            return value
        except Escritorio.DoesNotExist:
            raise serializers.ValidationError("Escritório não encontrado.")

    def validate_especialidades_ids(self, value):
        if value:
            especialidades_existentes = Especialidade.objects.filter(id__in=value, ativa=True).count()
            if especialidades_existentes != len(value):
                raise serializers.ValidationError("Uma ou mais especialidades não existem ou estão inativas.")
        return value or []

    def validate(self, data):
        # Validação de confirmação de senha
        password = data.get('password')
        password_confirm = data.get('password_confirm')
        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'As senhas não coincidem.'
            })

        # Validações de datas
        data_nascimento = data.get('data_nascimento')
        data_registro_crc = data.get('data_registro_crc')
        data_admissao = data.get('data_admissao')

        if data_nascimento and data_registro_crc:
            idade_registro = (data_registro_crc - data_nascimento).days // 365
            if idade_registro < 18:
                raise serializers.ValidationError({
                    'data_registro_crc': 'Contador deve ter pelo menos 18 anos na data de registro do CRC.'
                })

        if data_admissao and data_registro_crc:
            if data_admissao < data_registro_crc:
                raise serializers.ValidationError({
                    'data_admissao': 'Data de admissão não pode ser anterior ao registro no CRC.'
                })

        # Validação de responsável técnico
        eh_responsavel = data.get('eh_responsavel_tecnico', False)
        categoria_crc = data.get('categoria_crc', 'contador')
        if eh_responsavel and categoria_crc != 'contador':
            raise serializers.ValidationError({
                'eh_responsavel_tecnico': 'Apenas contadores (não técnicos) podem ser responsáveis técnicos.'
            })

        # Nome completo
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        nome_completo = data.get('nome_completo', '').strip()

        if not nome_completo and first_name and last_name:
            data['nome_completo'] = f"{first_name} {last_name}"
        elif nome_completo and (not first_name or not last_name):
            nomes = nome_completo.split()
            if len(nomes) >= 2:
                data['first_name'] = nomes[0]
                data['last_name'] = ' '.join(nomes[1:])
            else:
                data['first_name'] = nome_completo

        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Criação atômica de User + Contador + relacionamentos

        ACID Transaction que garante consistência total:
        - Cria User Django
        - Cria Contador vinculado
        - Associa Especialidades 
        - Mantém relacionamentos íntegros

        Rollback automático em caso de qualquer erro.
        """
        try:
            # 1. Extrair dados para User Django
            user_data = {
                'username': validated_data.get('username'),
                'email': validated_data.get('email'),
                'first_name': validated_data.get('first_name', ''),
                'last_name': validated_data.get('last_name', ''),
                'password': validated_data.get('password'),
            }

            # 2. Extrair especialidades (ManyToMany - tratar separadamente)
            especialidades_ids = validated_data.pop('especialidades_ids', [])

            # 3. Criar User Django dentro da transação
            user = User.objects.create_user(
                username=user_data['username'],
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                password=user_data['password']
            )

            # Log para auditoria
            logger.info(f"User criado: {user.username} (ID: {user.id})")

            # 4. Preparar dados do Contador (remover campos do User)
            contador_data = validated_data.copy()
            campos_user = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm']
            for campo in campos_user:
                contador_data.pop(campo, None)

            # 5. Buscar escritório
            escritorio = Escritorio.objects.get(id=contador_data.pop('escritorio_id'))
            contador_data['escritorio'] = escritorio

            # 6. Criar Contador vinculado ao User
            contador_data['user'] = user
            contador = Contador.objects.create(**contador_data)

            # Log para auditoria
            logger.info(f"Contador criado: {contador.nome_completo} (CRC: {contador.crc})")

            # 7. Associar especialidades (ManyToMany)
            if especialidades_ids:
                especialidades = Especialidade.objects.filter(id__in=especialidades_ids, ativa=True)
                contador.especialidades.set(especialidades)
                especialidades_nomes = [esp.nome for esp in especialidades]
                logger.info(f"Especialidades associadas: {', '.join(especialidades_nomes)}")

            # 8. Verificação final de integridade
            contador.refresh_from_db()
            if not contador.user:
                raise ValueError("Falha na vinculação User-Contador")

            if not contador.escritorio:
                raise ValueError("Contador deve estar vinculado a um escritório")

            # 9. Success log
            logger.info(f"Contador {contador.crc} criado com sucesso - Transaction committed")

            return contador

        except serializers.ValidationError as e:
            # Erro de validação - rollback automático
            logger.error(f"Erro de validação na criação do contador: {e}")
            raise e

        except Exception as e:
            # Erro inesperado - rollback automático
            logger.error(f"Erro inesperado na criação do contador: {e}")
            
            # Tratar erros específicos
            if 'cpf' in str(e).lower():
                raise serializers.ValidationError({
                    'cpf': 'Este CPF já está cadastrado no sistema.'
                })
            elif 'email' in str(e).lower():
                raise serializers.ValidationError({
                    'email': 'Este email já está em uso.'
                })
            elif 'crc' in str(e).lower():
                raise serializers.ValidationError({
                    'crc': 'Este CRC já está cadastrado.'
                })
            else:
                raise serializers.ValidationError({
                    'non_field_errors': 'Erro interno na criação do contador. Tente novamente.'
                })

    def to_representation(self, instance):
        """
        Retorna representação completa do contador criado

        Usa o ContadorPerfilSerializer já implementado para evitar
        duplicação de código e garantir consistência na resposta.
        """
        from apps.contadores.serializers import ContadorPerfilSerializer

        # Usar serializer existente para response completa
        perfil_serializer = ContadorPerfilSerializer(instance)
        response_data = perfil_serializer.data

        # Adicionar metadados específicos da criação
        response_data.update({
            'criado_em': instance.created_at,
            'status_criacao': 'sucesso',
            'message': f'Contador {instance.nome_completo} criado com sucesso!',
            'especialidades_count': instance.especialidades.count(),
            'escritorio_vinculado': bool(instance.escritorio),
        })

        return response_data
    
class ContadorLoginSerializer(serializers.Serializer):
    """
    Serializer para autenticação flexível de contadores
    
    Suporta login via:
    - Email: contador@escritorio.com.br
    - CRC: CRC-SP 123456/O-7  
    - Username: joao.contador
    
    Response inclui dados completos do contador autenticado.
    """
    
    login = serializers.CharField(
        max_length=150,
        help_text="Email, CRC ou username do contador"
    )
    password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        help_text="Senha do contador"
    )

    user = serializers.SerializerMethodField()
    contador = serializers.SerializerMethodField()
    login_type = serializers.SerializerMethodField()
    last_login = serializers.SerializerMethodField()

    class Meta:
        fields = ['login', 'password', 'user', 'contador', 'login_type', 'last_login']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.validated_user = None
        self.validated_contador = None
        self.detected_login_type = None

    def validate_login(self, value):
        login_clean = value.strip().lower()
        if len(login_clean) < 3:
            raise serializers.ValidationError("Login deve ter pelo menos 3 caracteres.")
        return login_clean

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
            raise serializers.ValidationError({
                'login': 'Nenhuma conta encontrada com este dado de login.'
            })

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

        if contador.escritorio and not contador.escritorio.ativo:
            raise serializers.ValidationError({'login': 'Escritório desativado.'})

        self.validated_user = user
        self.validated_contador = contador

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        return data

    def get_user(self, obj):
        if self.validated_user:
            return {
                'id': self.validated_user.id,
                'username': self.validated_user.username,
                'email': self.validated_user.email,
                'first_name': self.validated_user.first_name,
                'last_name': self.validated_user.last_name,
                'is_active': self.validated_user.is_active,
                'date_joined': self.validated_user.date_joined,
            }
        return None

    def get_contador(self, obj):
        if self.validated_contador:
            perfil_serializer = ContadorPerfilSerializer(self.validated_contador)
            return perfil_serializer.data
        return None

    def get_login_type(self, obj):
        return self.detected_login_type

    def get_last_login(self, obj):
        if self.validated_user:
            return self.validated_user.last_login
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if self.validated_contador:
            data.update({
                'login_success': True,
                'message': f'Login realizado com sucesso via {self.detected_login_type}!',
                'escritorio': {
                    'id': self.validated_contador.escritorio.id if self.validated_contador.escritorio else None,
                    'nome': self.validated_contador.escritorio.nome_fantasia if self.validated_contador.escritorio else None,
                },
                'especialidades_count': self.validated_contador.especialidades.count(),
                'is_responsavel_tecnico': self.validated_contador.eh_responsavel_tecnico,
            })
        return data