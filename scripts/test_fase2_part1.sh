#!/bin/bash

# =================================================================
# SCRIPT DE VALIDAÇÃO COMPLETA - MINI-FASE 2.1 MELHORADO
# MultiBPO - Sistema Contábil Django
# Versão: 2.1.2 - Testes Aprimorados
# =================================================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Contadores de testes
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para executar teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "   🧪 $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Função para teste com detalhes
run_detailed_test() {
    local test_name="$1"
    local test_command="$2"
    local show_details="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "   🧪 $test_name... "
    
    local result=$(eval "$test_command" 2>/dev/null)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ] && [ -n "$result" ]; then
        echo -e "${GREEN}✅ PASSOU${NC}"
        if [ "$show_details" = "true" ]; then
            echo "      💡 $result"
        fi
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FALHOU${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Cabeçalho aprimorado
echo -e "${BLUE}🔍 VALIDAÇÃO COMPLETA DA MINI-FASE 2.1${NC}"
echo -e "${BLUE}===========================================${NC}"
echo "📅 Data/Hora: $(date '+%d/%m/%Y %H:%M:%S')"
echo "🖥️  Servidor: $(hostname)"
echo "📁 Diretório: $(pwd)"
echo "🐳 Docker Compose: $(docker-compose version --short 2>/dev/null || echo 'N/A')"
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ ERRO: Execute este script no diretório do projeto MultiBPO${NC}"
    exit 1
fi

# 1. TESTE DO SISTEMA BASE
echo -e "${YELLOW}1️⃣ TESTANDO SISTEMA BASE${NC}"
run_test "Health check MultiBPO" 'curl -s http://192.168.0.10:8082/health/ | grep -q "MultiBPO OK"'
run_test "Nginx proxy funcionando" 'curl -s -I http://192.168.0.10:8082/ | head -n1 | grep -q "200\|302"'
run_test "Backend acessível via proxy" 'curl -s -I http://192.168.0.10:8082/admin/ | grep -q "302"'

# 2. TESTE DOS CONTAINERS DOCKER
echo -e "${YELLOW}2️⃣ TESTANDO CONTAINERS DOCKER${NC}"
run_test "4 Containers Up" 'docker-compose ps | grep -c "Up" | grep -q "4"'
run_test "Backend container ativo" 'docker-compose ps | grep -q "multibpo_backend.*Up"'
run_test "Frontend container ativo" 'docker-compose ps | grep -q "multibpo_frontend.*Up"'
run_test "Database container ativo" 'docker-compose ps | grep -q "multibpo_db.*Up"'
run_test "Nginx container ativo" 'docker-compose ps | grep -q "multibpo_nginx.*Up"'

# 3. TESTE DOS APPS DJANGO OBRIGATÓRIOS
echo -e "${YELLOW}3️⃣ TESTANDO APPS DJANGO OBRIGATÓRIOS${NC}"
run_test "App authentication criado" 'curl -s http://192.168.0.10:8082/api/v1/auth/test/ | grep -q "authentication"'
run_test "App contadores criado" 'curl -s http://192.168.0.10:8082/api/v1/contadores/test/ | grep -q "contadores"'
run_test "Django Admin acessível" 'curl -s -I http://192.168.0.10:8082/admin/ | grep -q "302"'

# Teste de configuração de apps no Django
APP_CONFIG_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.conf import settings
installed = settings.INSTALLED_APPS

auth_app = 'apps.authentication' in installed
contadores_app = 'apps.contadores' in installed
jwt_app = 'rest_framework_simplejwt' in installed

print(f'AUTH_APP_INSTALLED:{auth_app}')
print(f'CONTADORES_APP_INSTALLED:{contadores_app}')
print(f'JWT_APP_INSTALLED:{jwt_app}')
" 2>/dev/null)

run_test "App authentication configurado" 'echo "$APP_CONFIG_TEST" | grep -q "AUTH_APP_INSTALLED:True"'
run_test "App contadores configurado" 'echo "$APP_CONFIG_TEST" | grep -q "CONTADORES_APP_INSTALLED:True"'
run_test "SimpleJWT instalado" 'echo "$APP_CONFIG_TEST" | grep -q "JWT_APP_INSTALLED:True"'

# 4. TESTE DE SINTAXE E CONFIGURAÇÃO DJANGO - CORRIGIDO
echo -e "${YELLOW}4️⃣ TESTANDO SINTAXE E CONFIGURAÇÃO DJANGO${NC}"
run_test "Django check sem erros críticos" 'docker-compose exec -T backend python manage.py check --fail-level ERROR >/dev/null 2>&1'

# ✅ CORREÇÃO: Usar manage.py shell -c ao invés de python -c direto
# Versão que remove espaços e caracteres invisíveis
run_test "Models importáveis" 'MODELS_RESULT=$(docker-compose exec -T backend python manage.py shell -c "from apps.contadores.models import Escritorio, Contador, Especialidade; print(\"SUCCESS\")" 2>/dev/null | tail -1 | tr -d "\r\n\t "); [ "$MODELS_RESULT" = "SUCCESS" ]'

run_test "Admin importável" 'ADMIN_RESULT=$(docker-compose exec -T backend python manage.py shell -c "from apps.contadores.admin import EscritorioAdmin, ContadorAdmin, EspecialidadeAdmin; print(\"SUCCESS\")" 2>/dev/null | tail -1 | tr -d "\r\n\t "); [ "$ADMIN_RESULT" = "SUCCESS" ]'

# 5. TESTE DAS MIGRAÇÕES OBRIGATÓRIAS
echo -e "${YELLOW}5️⃣ TESTANDO MIGRAÇÕES OBRIGATÓRIAS${NC}"

# Verificar se migrações existem e estão aplicadas
MIGRATION_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.db import connection
from django.core.management import execute_from_command_line
import sys
from io import StringIO

# Verificar migrações aplicadas
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

try:
    execute_from_command_line(['manage.py', 'showmigrations', 'contadores'])
    migration_output = mystdout.getvalue()
finally:
    sys.stdout = old_stdout

# Verificar se schema contadores existe
with connection.cursor() as cursor:
    cursor.execute(\"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'contadores_%'\")
    tables = cursor.fetchall()

has_migrations = '[X]' in migration_output and 'contadores' in migration_output
has_tables = len(tables) >= 3  # Pelo menos 3 tabelas do schema contadores

print(f'HAS_MIGRATIONS_APPLIED:{has_migrations}')
print(f'HAS_CONTADORES_TABLES:{has_tables}')
print(f'TABLE_COUNT:{len(tables)}')
" 2>/dev/null)

run_test "Migrações contadores aplicadas" 'echo "$MIGRATION_TEST" | grep -q "HAS_MIGRATIONS_APPLIED:True"'
run_test "Tabelas schema contadores criadas" 'echo "$MIGRATION_TEST" | grep -q "HAS_CONTADORES_TABLES:True"'
run_test "Models sem migrações pendentes" 'docker-compose exec -T backend python manage.py makemigrations --dry-run | grep -q "No changes detected"'

# 6. TESTE DOS DADOS NO BANCO
echo -e "${YELLOW}6️⃣ TESTANDO DADOS NO BANCO${NC}"

# Executar teste de dados em bloco
DADOS_RESULT=$(docker-compose exec -T backend python manage.py shell -c "
from apps.contadores.models import Escritorio, Contador, Especialidade
from django.contrib.auth.models import User

# Contagens detalhadas
escritorios = Escritorio.objects.count()
contadores = Contador.objects.count()
especialidades = Especialidade.objects.count()
usuarios = User.objects.count()
superusers = User.objects.filter(is_superuser=True).count()

print(f'ESCRITORIOS:{escritorios}')
print(f'CONTADORES:{contadores}')
print(f'ESPECIALIDADES:{especialidades}')
print(f'USUARIOS:{usuarios}')
print(f'SUPERUSERS:{superusers}')

# Verificar dados mínimos para funcionamento
dados_minimos = (
    especialidades >= 8 and 
    escritorios >= 1 and 
    usuarios >= 1 and
    superusers >= 1
)

print(f'DADOS_MINIMOS_OK:{dados_minimos}')
" 2>/dev/null)

# Processar e exibir resultados
ESCRITORIOS=$(echo "$DADOS_RESULT" | grep "ESCRITORIOS:" | cut -d':' -f2)
CONTADORES=$(echo "$DADOS_RESULT" | grep "CONTADORES:" | cut -d':' -f2)
ESPECIALIDADES=$(echo "$DADOS_RESULT" | grep "ESPECIALIDADES:" | cut -d':' -f2)
USUARIOS=$(echo "$DADOS_RESULT" | grep "USUARIOS:" | cut -d':' -f2)
SUPERUSERS=$(echo "$DADOS_RESULT" | grep "SUPERUSERS:" | cut -d':' -f2)
DADOS_MINIMOS_OK=$(echo "$DADOS_RESULT" | grep "DADOS_MINIMOS_OK:" | cut -d':' -f2)

echo "   📊 Escritórios: $ESCRITORIOS"
echo "   📊 Contadores: $CONTADORES"
echo "   📊 Especialidades: $ESPECIALIDADES"
echo "   📊 Usuários: $USUARIOS"
echo "   📊 Superusers: $SUPERUSERS"

run_test "Especialidades criadas (≥8)" '[ "$ESPECIALIDADES" -ge 8 ]'
run_test "Pelo menos 1 escritório" '[ "$ESCRITORIOS" -ge 1 ]'
run_test "Pelo menos 1 superuser" '[ "$SUPERUSERS" -ge 1 ]'
run_test "Dados mínimos consistentes" '[ "$DADOS_MINIMOS_OK" = "True" ]'

# 7. TESTE DOS MODELS OBRIGATÓRIOS DA MINI-FASE 2.1
echo -e "${YELLOW}7️⃣ TESTANDO MODELS OBRIGATÓRIOS${NC}"

# Teste detalhado do Model Contador
CONTADOR_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from apps.contadores.models import Contador, Escritorio, Especialidade
from django.db import models

# Verificar campos específicos OBRIGATÓRIOS do Model Contador
contador_fields = [f.name for f in Contador._meta.get_fields()]

# Campos obrigatórios Mini-Fase 2.1
required_fields = ['crc', 'crc_estado', 'especialidades', 'escritorio', 'user', 'nome_completo', 'cpf']
missing_fields = [field for field in required_fields if field not in contador_fields]

print(f'CONTADOR_FIELDS_OK:{len(missing_fields) == 0}')
print(f'HAS_CRC_FIELD:{\"crc\" in contador_fields}')
print(f'HAS_CRC_ESTADO:{\"crc_estado\" in contador_fields}')
print(f'HAS_ESPECIALIDADES:{\"especialidades\" in contador_fields}')
print(f'HAS_ESCRITORIO:{\"escritorio\" in contador_fields}')
print(f'HAS_USER:{\"user\" in contador_fields}')
print(f'HAS_NOME_COMPLETO:{\"nome_completo\" in contador_fields}')
print(f'HAS_CPF:{\"cpf\" in contador_fields}')

# Verificar relacionamentos específicos
try:
    crc_field = Contador._meta.get_field('crc')
    especialidades_field = Contador._meta.get_field('especialidades')
    escritorio_field = Contador._meta.get_field('escritorio')
    user_field = Contador._meta.get_field('user')
    
    print(f'CRC_IS_CHARFIELD:{isinstance(crc_field, models.CharField)}')
    print(f'ESPECIALIDADES_IS_M2M:{isinstance(especialidades_field, models.ManyToManyField)}')
    print(f'ESCRITORIO_IS_FK:{isinstance(escritorio_field, models.ForeignKey)}')
    print(f'USER_IS_ONETOONE:{isinstance(user_field, models.OneToOneField)}')
    
    # Verificar tamanhos de campos
    crc_max_length = getattr(crc_field, 'max_length', 0)
    print(f'CRC_MAX_LENGTH_OK:{crc_max_length >= 20}')
    
except Exception as e:
    print(f'FIELD_ERROR:{str(e)}')
" 2>/dev/null)

# Teste detalhado do Model Escritorio  
ESCRITORIO_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from apps.contadores.models import Escritorio
from django.db import models

# Verificar campos específicos OBRIGATÓRIOS do Model Escritorio
escritorio_fields = [f.name for f in Escritorio._meta.get_fields()]

# Campos obrigatórios Mini-Fase 2.1
required_fields = ['razao_social', 'cnpj', 'crc_responsavel', 'telefone', 'email', 'responsavel_tecnico']
missing_fields = [field for field in required_fields if field not in escritorio_fields]

print(f'ESCRITORIO_FIELDS_OK:{len(missing_fields) == 0}')
print(f'HAS_RAZAO_SOCIAL:{\"razao_social\" in escritorio_fields}')
print(f'HAS_CNPJ:{\"cnpj\" in escritorio_fields}')
print(f'HAS_CRC_RESPONSAVEL:{\"crc_responsavel\" in escritorio_fields}')
print(f'HAS_TELEFONE:{\"telefone\" in escritorio_fields}')
print(f'HAS_EMAIL:{\"email\" in escritorio_fields}')
print(f'HAS_RESPONSAVEL_TECNICO:{\"responsavel_tecnico\" in escritorio_fields}')

# Verificar se CRC responsável aceita 20 caracteres (correção aplicada)
try:
    crc_responsavel_field = Escritorio._meta.get_field('crc_responsavel')
    cnpj_field = Escritorio._meta.get_field('cnpj')
    
    print(f'CRC_RESPONSAVEL_MAX_LENGTH:{crc_responsavel_field.max_length}')
    print(f'CRC_RESPONSAVEL_FIXED:{crc_responsavel_field.max_length >= 20}')
    print(f'CNPJ_UNIQUE:{cnpj_field.unique}')
    
except Exception as e:
    print(f'CRC_FIELD_ERROR:{str(e)}')
" 2>/dev/null)

# Teste do Model Especialidade
ESPECIALIDADE_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from apps.contadores.models import Especialidade
from django.db import models

especialidade_fields = [f.name for f in Especialidade._meta.get_fields()]
required_fields = ['nome', 'codigo', 'area_principal', 'ativa']
missing_fields = [field for field in required_fields if field not in especialidade_fields]

print(f'ESPECIALIDADE_FIELDS_OK:{len(missing_fields) == 0}')
print(f'HAS_NOME:{\"nome\" in especialidade_fields}')
print(f'HAS_CODIGO:{\"codigo\" in especialidade_fields}')
print(f'HAS_AREA_PRINCIPAL:{\"area_principal\" in especialidade_fields}')
print(f'HAS_ATIVA:{\"ativa\" in especialidade_fields}')

# Verificar choices da área principal
try:
    area_field = Especialidade._meta.get_field('area_principal')
    has_choices = hasattr(area_field, 'choices') and len(area_field.choices) > 0
    print(f'AREA_HAS_CHOICES:{has_choices}')
except:
    print('AREA_HAS_CHOICES:False')
" 2>/dev/null)

# Processar resultados dos models
run_test "Campos obrigatórios Model Contador" 'echo "$CONTADOR_TEST" | grep -q "CONTADOR_FIELDS_OK:True"'
run_test "Campo CRC presente e válido" 'echo "$CONTADOR_TEST" | grep -q "HAS_CRC_FIELD:True" && echo "$CONTADOR_TEST" | grep -q "CRC_IS_CHARFIELD:True"'
run_test "Campo CRC Estado presente" 'echo "$CONTADOR_TEST" | grep -q "HAS_CRC_ESTADO:True"'
run_test "Relacionamento Especialidades M2M" 'echo "$CONTADOR_TEST" | grep -q "ESPECIALIDADES_IS_M2M:True"'
run_test "Relacionamento Escritorio FK" 'echo "$CONTADOR_TEST" | grep -q "ESCRITORIO_IS_FK:True"'
run_test "Relacionamento User OneToOne" 'echo "$CONTADOR_TEST" | grep -q "USER_IS_ONETOONE:True"'

run_test "Campos obrigatórios Model Escritorio" 'echo "$ESCRITORIO_TEST" | grep -q "ESCRITORIO_FIELDS_OK:True"'
run_test "Campo CNPJ único" 'echo "$ESCRITORIO_TEST" | grep -q "CNPJ_UNIQUE:True"'
run_test "Campo CRC Responsável presente" 'echo "$ESCRITORIO_TEST" | grep -q "HAS_CRC_RESPONSAVEL:True"'
run_test "CRC Responsável corrigido (≥20 chars)" 'echo "$ESCRITORIO_TEST" | grep -q "CRC_RESPONSAVEL_FIXED:True"'

run_test "Campos obrigatórios Model Especialidade" 'echo "$ESPECIALIDADE_TEST" | grep -q "ESPECIALIDADE_FIELDS_OK:True"'
run_test "Área Principal com choices" 'echo "$ESPECIALIDADE_TEST" | grep -q "AREA_HAS_CHOICES:True"'

# 8. TESTE CONFIGURAÇÃO JWT OBRIGATÓRIA
echo -e "${YELLOW}8️⃣ TESTANDO CONFIGURAÇÃO JWT OBRIGATÓRIA${NC}"

JWT_CONFIG_TEST=$(docker-compose exec -T backend python manage.py shell -c "
import os
from django.conf import settings

# Verificar se JWT está instalado
try:
    import rest_framework_simplejwt
    from rest_framework_simplejwt.tokens import RefreshToken
    jwt_installed = True
    jwt_functional = True
except ImportError:
    jwt_installed = False
    jwt_functional = False

# Verificar configurações JWT no settings
has_simple_jwt = hasattr(settings, 'SIMPLE_JWT')
has_rest_framework = hasattr(settings, 'REST_FRAMEWORK')

# Verificar apps instalados
installed_apps = getattr(settings, 'INSTALLED_APPS', [])
has_jwt_app = 'rest_framework_simplejwt' in installed_apps
has_auth_app = 'apps.authentication' in installed_apps
has_contadores_app = 'apps.contadores' in installed_apps

print(f'JWT_INSTALLED:{jwt_installed}')
print(f'JWT_FUNCTIONAL:{jwt_functional}')
print(f'HAS_SIMPLE_JWT_CONFIG:{has_simple_jwt}')
print(f'HAS_REST_FRAMEWORK_CONFIG:{has_rest_framework}')
print(f'HAS_JWT_APP:{has_jwt_app}')
print(f'HAS_AUTH_APP:{has_auth_app}')
print(f'HAS_CONTADORES_APP:{has_contadores_app}')

# Verificar autenticação JWT configurada
if has_rest_framework:
    auth_classes = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', [])
    has_jwt_auth = any('JWTAuthentication' in auth_class for auth_class in auth_classes)
    print(f'HAS_JWT_AUTHENTICATION:{has_jwt_auth}')
    
    # Verificar configurações específicas do SimpleJWT
    if has_simple_jwt:
        simple_jwt_config = settings.SIMPLE_JWT
        has_access_lifetime = 'ACCESS_TOKEN_LIFETIME' in simple_jwt_config
        has_refresh_lifetime = 'REFRESH_TOKEN_LIFETIME' in simple_jwt_config
        print(f'JWT_ACCESS_CONFIGURED:{has_access_lifetime}')
        print(f'JWT_REFRESH_CONFIGURED:{has_refresh_lifetime}')
    else:
        print('JWT_ACCESS_CONFIGURED:False')
        print('JWT_REFRESH_CONFIGURED:False')
else:
    print('HAS_JWT_AUTHENTICATION:False')
    print('JWT_ACCESS_CONFIGURED:False')
    print('JWT_REFRESH_CONFIGURED:False')

# Verificar CSRF configurado
csrf_origins = getattr(settings, 'CSRF_TRUSTED_ORIGINS', [])
has_csrf_config = len(csrf_origins) > 0
print(f'HAS_CSRF_TRUSTED_ORIGINS:{has_csrf_config}')
" 2>/dev/null)

run_test "JWT library instalada e funcional" 'echo "$JWT_CONFIG_TEST" | grep -q "JWT_FUNCTIONAL:True"'
run_test "Configuração SIMPLE_JWT presente" 'echo "$JWT_CONFIG_TEST" | grep -q "HAS_SIMPLE_JWT_CONFIG:True"'
run_test "JWT Authentication configurado no DRF" 'echo "$JWT_CONFIG_TEST" | grep -q "HAS_JWT_AUTHENTICATION:True"'
run_test "JWT Access Token configurado" 'echo "$JWT_CONFIG_TEST" | grep -q "JWT_ACCESS_CONFIGURED:True"'
run_test "JWT Refresh Token configurado" 'echo "$JWT_CONFIG_TEST" | grep -q "JWT_REFRESH_CONFIGURED:True"'
run_test "CSRF Trusted Origins configurado" 'echo "$JWT_CONFIG_TEST" | grep -q "HAS_CSRF_TRUSTED_ORIGINS:True"'

# 9. TESTE DJANGO ADMIN PERSONALIZADO OBRIGATÓRIO
echo -e "${YELLOW}9️⃣ TESTANDO DJANGO ADMIN PERSONALIZADO${NC}"

ADMIN_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.contrib import admin
from apps.contadores.models import Contador, Escritorio, Especialidade

# Verificar se models estão registrados no admin
contador_registered = Contador in admin.site._registry
escritorio_registered = Escritorio in admin.site._registry  
especialidade_registered = Especialidade in admin.site._registry

print(f'CONTADOR_ADMIN_REGISTERED:{contador_registered}')
print(f'ESCRITORIO_ADMIN_REGISTERED:{escritorio_registered}')
print(f'ESPECIALIDADE_ADMIN_REGISTERED:{especialidade_registered}')

# Verificar configurações específicas dos admins
if contador_registered:
    contador_admin = admin.site._registry[Contador]
    has_list_display = hasattr(contador_admin, 'list_display') and len(contador_admin.list_display) > 0
    has_fieldsets = hasattr(contador_admin, 'fieldsets') and len(contador_admin.fieldsets) > 0
    has_filter_horizontal = hasattr(contador_admin, 'filter_horizontal') and 'especialidades' in contador_admin.filter_horizontal
    
    print(f'CONTADOR_HAS_LIST_DISPLAY:{has_list_display}')
    print(f'CONTADOR_HAS_FIELDSETS:{has_fieldsets}')
    print(f'CONTADOR_HAS_FILTER_HORIZONTAL:{has_filter_horizontal}')
else:
    print('CONTADOR_HAS_LIST_DISPLAY:False')
    print('CONTADOR_HAS_FIELDSETS:False')
    print('CONTADOR_HAS_FILTER_HORIZONTAL:False')

if escritorio_registered:
    escritorio_admin = admin.site._registry[Escritorio]
    has_list_display = hasattr(escritorio_admin, 'list_display') and len(escritorio_admin.list_display) > 0
    has_search_fields = hasattr(escritorio_admin, 'search_fields') and len(escritorio_admin.search_fields) > 0
    
    print(f'ESCRITORIO_HAS_LIST_DISPLAY:{has_list_display}')
    print(f'ESCRITORIO_HAS_SEARCH_FIELDS:{has_search_fields}')
else:
    print('ESCRITORIO_HAS_LIST_DISPLAY:False')
    print('ESCRITORIO_HAS_SEARCH_FIELDS:False')

# Verificar se admin está acessível
try:
    from django.contrib.admin.sites import site
    admin_working = len(site._registry) > 3  # Pelo menos os 3 models + User
    print(f'ADMIN_WORKING:{admin_working}')
except Exception as e:
    print(f'ADMIN_ERROR:{str(e)}')
" 2>/dev/null)

run_test "Model Contador registrado no Admin" 'echo "$ADMIN_TEST" | grep -q "CONTADOR_ADMIN_REGISTERED:True"'
run_test "Model Escritorio registrado no Admin" 'echo "$ADMIN_TEST" | grep -q "ESCRITORIO_ADMIN_REGISTERED:True"'
run_test "Model Especialidade registrado no Admin" 'echo "$ADMIN_TEST" | grep -q "ESPECIALIDADE_ADMIN_REGISTERED:True"'
run_test "ContadorAdmin personalizado" 'echo "$ADMIN_TEST" | grep -q "CONTADOR_HAS_FIELDSETS:True"'
run_test "Contador com filter_horizontal" 'echo "$ADMIN_TEST" | grep -q "CONTADOR_HAS_FILTER_HORIZONTAL:True"'
run_test "EscritorioAdmin personalizado" 'echo "$ADMIN_TEST" | grep -q "ESCRITORIO_HAS_SEARCH_FIELDS:True"'
run_test "Django Admin funcionando" 'echo "$ADMIN_TEST" | grep -q "ADMIN_WORKING:True"'

# 10. TESTE DE VALIDAÇÕES BRASILEIRAS OBRIGATÓRIAS
echo -e "${YELLOW}🔟 TESTANDO VALIDAÇÕES BRASILEIRAS${NC}"

VALIDACAO_RESULT=$(docker-compose exec -T backend python manage.py shell -c "
# Teste das bibliotecas de validação
try:
    from validate_docbr import CPF, CNPJ
    lib_installed = True
except ImportError:
    lib_installed = False
    print('VALIDACAO_LIB_INSTALLED:False')
    exit()

print('VALIDACAO_LIB_INSTALLED:True')

# Teste CPF
cpf = CPF()
cpf_valido = cpf.validate('12345678909')
cpf_invalido = not cpf.validate('11111111111')

# Teste CNPJ  
cnpj = CNPJ()
cnpj_valido = cnpj.validate('11444777000161')
cnpj_invalido = not cnpj.validate('11111111111111')

print(f'CPF_VALIDO:{cpf_valido}')
print(f'CPF_INVALIDO:{cpf_invalido}')
print(f'CNPJ_VALIDO:{cnpj_valido}')
print(f'CNPJ_INVALIDO:{cnpj_invalido}')

# Teste integração com models
from apps.contadores.models import Contador, Escritorio

# Verificar se models têm validação
try:
    from django.core.exceptions import ValidationError
    
    # Teste CNPJ inválido no Escritorio
    escritorio = Escritorio(
        razao_social='Teste',
        cnpj='11111111111111',  # CNPJ inválido
        email='test@test.com',
        telefone='+5511999999999',
        responsavel_tecnico='Teste',
        crc_responsavel='CRC-SP 123456/O-1',
        cep='01234-567',
        logradouro='Rua Teste',
        numero='123',
        bairro='Centro',
        cidade='São Paulo',
        estado='SP'
    )
    
    try:
        escritorio.full_clean()
        model_validation_working = False
    except ValidationError:
        model_validation_working = True
    
    print(f'MODEL_VALIDATION_WORKING:{model_validation_working}')
    
except Exception as e:
    print(f'MODEL_VALIDATION_ERROR:{str(e)}')
" 2>/dev/null)

run_test "Biblioteca validate-docbr instalada" 'echo "$VALIDACAO_RESULT" | grep -q "VALIDACAO_LIB_INSTALLED:True"'

CPF_VALIDO=$(echo "$VALIDACAO_RESULT" | grep "CPF_VALIDO:" | cut -d':' -f2)
CPF_INVALIDO=$(echo "$VALIDACAO_RESULT" | grep "CPF_INVALIDO:" | cut -d':' -f2)
CNPJ_VALIDO=$(echo "$VALIDACAO_RESULT" | grep "CNPJ_VALIDO:" | cut -d':' -f2)
CNPJ_INVALIDO=$(echo "$VALIDACAO_RESULT" | grep "CNPJ_INVALIDO:" | cut -d':' -f2)

run_test "Validação CPF válido" '[ "$CPF_VALIDO" = "True" ]'
run_test "Validação CPF inválido" '[ "$CPF_INVALIDO" = "True" ]'
run_test "Validação CNPJ válido" '[ "$CNPJ_VALIDO" = "True" ]'
run_test "Validação CNPJ inválido" '[ "$CNPJ_INVALIDO" = "True" ]'
run_test "Validação integrada nos models" 'echo "$VALIDACAO_RESULT" | grep -q "MODEL_VALIDATION_WORKING:True"'

# 11. TESTE DE RELACIONAMENTOS OBRIGATÓRIOS
echo -e "${YELLOW}1️⃣1️⃣ TESTANDO RELACIONAMENTOS OBRIGATÓRIOS${NC}"

RELACIONAMENTOS_RESULT=$(docker-compose exec -T backend python manage.py shell -c "
from apps.contadores.models import Escritorio, Contador, Especialidade
from django.contrib.auth.models import User

try:
    # Verificar se conseguimos acessar relacionamentos
    if Contador.objects.count() > 0:
        contador = Contador.objects.select_related('user', 'escritorio').prefetch_related('especialidades').first()
        
        # Testar acesso aos relacionamentos obrigatórios
        user_ok = hasattr(contador, 'user') and contador.user is not None
        escritorio_ok = hasattr(contador, 'escritorio') and contador.escritorio is not None
        especialidades_ok = hasattr(contador, 'especialidades')
        
        # Testar relacionamento reverso
        if contador.escritorio:
            escritorio_contadores = contador.escritorio.contadores.count() >= 0
        else:
            escritorio_contadores = False
            
        print(f'USER_RELACIONAMENTO:{user_ok}')
        print(f'ESCRITORIO_RELACIONAMENTO:{escritorio_ok}')
        print(f'ESPECIALIDADES_RELACIONAMENTO:{especialidades_ok}')
        print(f'RELACIONAMENTO_REVERSO_OK:{escritorio_contadores}')
        
        # Testar se conseguimos criar relacionamentos
        try:
            # Testar criação de especialidade
            if Especialidade.objects.count() > 0:
                primeira_esp = Especialidade.objects.first()
                contador.especialidades.add(primeira_esp)
                adicao_ok = True
            else:
                adicao_ok = False
                
            print(f'PODE_ADICIONAR_ESPECIALIDADES:{adicao_ok}')
        except Exception as e:
            print(f'PODE_ADICIONAR_ESPECIALIDADES:False')
            
    else:
        print('USER_RELACIONAMENTO:False')
        print('ESCRITORIO_RELACIONAMENTO:False')
        print('ESPECIALIDADES_RELACIONAMENTO:False')
        print('RELACIONAMENTO_REVERSO_OK:False')
        print('PODE_ADICIONAR_ESPECIALIDADES:False')
        
except Exception as e:
    print(f'ERRO_RELACIONAMENTO:{str(e)}')
" 2>/dev/null)

if echo "$RELACIONAMENTOS_RESULT" | grep -q "USER_RELACIONAMENTO:True"; then
    run_test "Relacionamento User OneToOne" 'true'
else
    run_test "Relacionamento User OneToOne" 'false'
fi

if echo "$RELACIONAMENTOS_RESULT" | grep -q "ESCRITORIO_RELACIONAMENTO:True"; then
    run_test "Relacionamento Escritorio FK" 'true'  
else
    run_test "Relacionamento Escritorio FK" 'false'
fi

if echo "$RELACIONAMENTOS_RESULT" | grep -q "ESPECIALIDADES_RELACIONAMENTO:True"; then
    run_test "Relacionamento Especialidades M2M" 'true'
else
    run_test "Relacionamento Especialidades M2M" 'false'
fi

run_test "Relacionamentos reversos funcionais" 'echo "$RELACIONAMENTOS_RESULT" | grep -q "RELACIONAMENTO_REVERSO_OK:True"'
run_test "Pode adicionar especialidades" 'echo "$RELACIONAMENTOS_RESULT" | grep -q "PODE_ADICIONAR_ESPECIALIDADES:True"'

# 12. TESTE DE CONFIGURAÇÕES DE PRODUÇÃO
echo -e "${YELLOW}1️⃣2️⃣ TESTANDO CONFIGURAÇÕES DE PRODUÇÃO${NC}"

PROD_CONFIG_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.conf import settings
import os

# Verificar configurações importantes
debug_mode = getattr(settings, 'DEBUG', True)
secret_key_set = len(getattr(settings, 'SECRET_KEY', '')) > 10
allowed_hosts = getattr(settings, 'ALLOWED_HOSTS', [])
csrf_origins = getattr(settings, 'CSRF_TRUSTED_ORIGINS', [])
cors_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])

# Verificar configuração de banco
databases = getattr(settings, 'DATABASES', {})
using_postgresql = 'postgresql' in str(databases.get('default', {}).get('ENGINE', ''))

# Verificar phonenumber configuração
phone_region = getattr(settings, 'PHONENUMBER_DEFAULT_REGION', '')

print(f'DEBUG_MODE:{debug_mode}')
print(f'SECRET_KEY_SET:{secret_key_set}')
print(f'HAS_ALLOWED_HOSTS:{len(allowed_hosts) > 0}')
print(f'HAS_CSRF_ORIGINS:{len(csrf_origins) > 0}')
print(f'HAS_CORS_ORIGINS:{len(cors_origins) > 0}')
print(f'USING_POSTGRESQL:{using_postgresql}')
print(f'PHONE_REGION_BR:{phone_region == \"BR\"}')

# Verificar se .env está sendo usado
env_vars_count = 0
env_vars = ['DJANGO_SECRET_KEY', 'DATABASE_NAME', 'DATABASE_USER', 'CORS_ALLOWED_ORIGINS']
for var in env_vars:
    if var in os.environ:
        env_vars_count += 1

env_properly_configured = env_vars_count >= 3
print(f'ENV_PROPERLY_CONFIGURED:{env_properly_configured}')
" 2>/dev/null)

run_test "Secret Key configurada" 'echo "$PROD_CONFIG_TEST" | grep -q "SECRET_KEY_SET:True"'
run_test "Allowed Hosts configurado" 'echo "$PROD_CONFIG_TEST" | grep -q "HAS_ALLOWED_HOSTS:True"'
run_test "CSRF Trusted Origins configurado" 'echo "$PROD_CONFIG_TEST" | grep -q "HAS_CSRF_ORIGINS:True"'
run_test "CORS Origins configurado" 'echo "$PROD_CONFIG_TEST" | grep -q "HAS_CORS_ORIGINS:True"'
run_test "PostgreSQL configurado" 'echo "$PROD_CONFIG_TEST" | grep -q "USING_POSTGRESQL:True"'
run_test "Região telefone Brasil" 'echo "$PROD_CONFIG_TEST" | grep -q "PHONE_REGION_BR:True"'
run_test "Variáveis ambiente configuradas" 'echo "$PROD_CONFIG_TEST" | grep -q "ENV_PROPERLY_CONFIGURED:True"'

# 13. TESTE DE ENDPOINTS PREPARADOS PARA MINI-FASE 2.2
echo -e "${YELLOW}1️⃣3️⃣ TESTANDO PREPARAÇÃO PARA MINI-FASE 2.2${NC}"

# Testar se URLs estão configuradas para próxima fase
run_test "JWT Token endpoints disponíveis" 'curl -s -I http://192.168.0.10:8082/api/v1/token/ | grep -q "405\|200\|400"'  # Method not allowed é esperado
run_test "Auth endpoints preparados" 'curl -s http://192.168.0.10:8082/api/v1/auth/test/ | grep -q "jwt_ready.*true"'

# Verificar estrutura de URLs
URL_STRUCTURE_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.urls import reverse
from django.conf import settings
import sys
from io import StringIO

# Capturar lista de URLs
old_stdout = sys.stdout
sys.stdout = mystdout = StringIO()

try:
    from django.core.management import execute_from_command_line
    execute_from_command_line(['manage.py', 'show_urls'])
    urls_output = mystdout.getvalue()
except:
    urls_output = ''
finally:
    sys.stdout = old_stdout

# Verificar URLs importantes
has_auth_urls = '/api/v1/auth/' in urls_output
has_contadores_urls = '/api/v1/contadores/' in urls_output
has_token_urls = '/api/v1/token/' in urls_output
has_admin_urls = '/admin/' in urls_output

print(f'HAS_AUTH_URLS:{has_auth_urls}')
print(f'HAS_CONTADORES_URLS:{has_contadores_urls}')
print(f'HAS_TOKEN_URLS:{has_token_urls}')
print(f'HAS_ADMIN_URLS:{has_admin_urls}')

# Verificar se apps estão prontos para APIs
try:
    from apps.authentication.urls import urlpatterns as auth_urls
    from apps.contadores.urls import urlpatterns as contadores_urls
    
    auth_urls_configured = len(auth_urls) > 0
    contadores_urls_configured = len(contadores_urls) > 0
    
    print(f'AUTH_URLS_CONFIGURED:{auth_urls_configured}')
    print(f'CONTADORES_URLS_CONFIGURED:{contadores_urls_configured}')
except:
    print('AUTH_URLS_CONFIGURED:False')
    print('CONTADORES_URLS_CONFIGURED:False')
" 2>/dev/null)

run_test "URLs auth configuradas" 'echo "$URL_STRUCTURE_TEST" | grep -q "HAS_AUTH_URLS:True"'
run_test "URLs contadores configuradas" 'echo "$URL_STRUCTURE_TEST" | grep -q "HAS_CONTADORES_URLS:True"'
run_test "URLs token JWT configuradas" 'echo "$URL_STRUCTURE_TEST" | grep -q "HAS_TOKEN_URLS:True"'
run_test "URLs admin configuradas" 'echo "$URL_STRUCTURE_TEST" | grep -q "HAS_ADMIN_URLS:True"'

# 14. TESTE DE SCHEMA DE BANCO ESPECÍFICO
echo -e "${YELLOW}1️⃣4️⃣ TESTANDO SCHEMA DE BANCO CONTADORES${NC}"

SCHEMA_TEST=$(docker-compose exec -T backend python manage.py shell -c "
from django.db import connection

with connection.cursor() as cursor:
    # Verificar tabelas do schema contadores
    cursor.execute(\"\"\"
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'contadores_%'
    \"\"\")
    
    tables = [row[0] for row in cursor.fetchall()]
    
    expected_tables = [
        'contadores_escritorio',
        'contadores_especialidade', 
        'contadores_contador',
        'contadores_contador_especialidades'
    ]
    
    tables_found = []
    for table in expected_tables:
        if table in tables:
            tables_found.append(table)
    
    print(f'EXPECTED_TABLES_COUNT:{len(expected_tables)}')
    print(f'FOUND_TABLES_COUNT:{len(tables_found)}')
    print(f'ALL_TABLES_CREATED:{len(tables_found) == len(expected_tables)}')
    
    # Verificar estrutura da tabela contador
    if 'contadores_contador' in tables:
        cursor.execute(\"\"\"
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'contadores_contador'
        \"\"\")
        
        contador_columns = [row[0] for row in cursor.fetchall()]
        required_columns = ['id', 'user_id', 'escritorio_id', 'nome_completo', 'cpf', 'crc', 'crc_estado']
        
        has_required_columns = all(col in contador_columns for col in required_columns)
        print(f'CONTADOR_HAS_REQUIRED_COLUMNS:{has_required_columns}')
    else:
        print('CONTADOR_HAS_REQUIRED_COLUMNS:False')
    
    # Verificar constraints e índices
    cursor.execute(\"\"\"
        SELECT constraint_name, constraint_type 
        FROM information_schema.table_constraints 
        WHERE table_name LIKE 'contadores_%'
    \"\"\")
    
    constraints = cursor.fetchall()
    has_constraints = len(constraints) > 0
    print(f'HAS_DATABASE_CONSTRAINTS:{has_constraints}')
" 2>/dev/null)

run_test "Todas tabelas schema contadores criadas" 'echo "$SCHEMA_TEST" | grep -q "ALL_TABLES_CREATED:True"'
run_test "Tabela contador com colunas obrigatórias" 'echo "$SCHEMA_TEST" | grep -q "CONTADOR_HAS_REQUIRED_COLUMNS:True"'
run_test "Constraints de banco criadas" 'echo "$SCHEMA_TEST" | grep -q "HAS_DATABASE_CONSTRAINTS:True"'

# RESUMO FINAL DETALHADO
echo ""
echo -e "${BLUE}📊 RESUMO COMPLETO DA VALIDAÇÃO${NC}"
echo "=============================================="
echo -e "📅 Data/Hora Final: $(date '+%d/%m/%Y %H:%M:%S')"
echo -e "🧪 Total de testes: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "✅ Testes aprovados: ${GREEN}$PASSED_TESTS${NC}"
echo -e "❌ Testes falharam: ${RED}$FAILED_TESTS${NC}"

# Calcular porcentagem
if [ $TOTAL_TESTS -gt 0 ]; then
    PERCENTAGE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "📈 Taxa de sucesso: ${BLUE}$PERCENTAGE%${NC}"
    
    # Classificação do resultado
    if [ $PERCENTAGE -eq 100 ]; then
        CLASSIFICATION="${GREEN}🏆 EXCELENTE${NC}"
    elif [ $PERCENTAGE -ge 95 ]; then
        CLASSIFICATION="${GREEN}🎯 MUITO BOM${NC}"
    elif [ $PERCENTAGE -ge 90 ]; then
        CLASSIFICATION="${YELLOW}⚠️ BOM (necessário revisar)${NC}"
    elif [ $PERCENTAGE -ge 80 ]; then
        CLASSIFICATION="${YELLOW}🔧 REGULAR (correções necessárias)${NC}"
    else
        CLASSIFICATION="${RED}❌ INSUFICIENTE${NC}"
    fi
    
    echo -e "🏅 Classificação: $CLASSIFICATION"
fi

echo ""
echo -e "${PURPLE}📋 RESUMO DOS REQUISITOS DA MINI-FASE 2.1:${NC}"
echo "✅ App Django authentication para JWT"
echo "✅ App Django contadores para dados profissionais"  
echo "✅ Model Contador com campos CRC, especialidades, escritório"
echo "✅ Model Escritorio para dados empresariais contábeis"
echo "✅ Configuração JWT no Django settings"
echo "✅ Migrações de banco de dados no schema contadores"
echo "✅ Django Admin personalizado para gestão"
echo ""

# Resultado final
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 VALIDAÇÃO CONCLUÍDA COM SUCESSO TOTAL!${NC}"
    echo -e "${GREEN}✅ Mini-Fase 2.1 está 100% funcional e completa!${NC}"
    echo -e "${GREEN}🚀 Sistema aprovado para avançar para Mini-Fase 2.2 (APIs JWT)${NC}"
    echo ""
    echo -e "${CYAN}📋 PRÓXIMOS PASSOS RECOMENDADOS:${NC}"
    echo "1. 💾 Fazer backup do estado atual"
    echo "2. 📚 Revisar documentação da Mini-Fase 2.2"
    echo "3. 🚀 Iniciar implementação das APIs de autenticação JWT"
    echo "4. 🧪 Executar testes das APIs após implementação"
    echo ""
    exit 0
elif [ $PERCENTAGE -ge 95 ]; then
    echo -e "${YELLOW}⚠️ VALIDAÇÃO QUASE COMPLETA!${NC}"
    echo -e "${YELLOW}🔧 $FAILED_TESTS teste(s) falharam, mas o sistema está quase pronto${NC}"
    echo -e "${YELLOW}📝 Revise os erros menores acima antes de prosseguir${NC}"
    echo ""
    exit 1
else
    echo -e "${RED}⚠️ VALIDAÇÃO ENCONTROU PROBLEMAS SIGNIFICATIVOS!${NC}"
    echo -e "${RED}❌ $FAILED_TESTS teste(s) falharam${NC}"
    echo -e "${RED}🔧 Correções obrigatórias necessárias antes de avançar${NC}"
    echo -e "${YELLOW}📚 Consulte a documentação da Mini-Fase 2.1 para correções${NC}"
    echo ""
    exit 1
fi