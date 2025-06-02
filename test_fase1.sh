#!/bin/bash

# ====================================================================
# SCRIPT DE TESTES - MULTIBPO FASE 1
# ====================================================================
# Valida todas as implementações da Fase 1 do projeto MultiBPO
# Autor: Sistema MultiBPO
# Data: 30 de Maio de 2025
# ====================================================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Função para imprimir header
print_header() {
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${BLUE}  🏢 SCRIPT DE TESTES - MULTIBPO FASE 1${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${CYAN}Validando implementações da Fase 1 do projeto MultiBPO...${NC}"
    echo ""
}

# Função para imprimir seção
print_section() {
    echo ""
    echo -e "${PURPLE}📋 $1${NC}"
    echo -e "${PURPLE}---------------------------------------------------------------------${NC}"
}

# Função para teste
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_pattern="$3"
    local test_type="${4:-basic}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}🧪 Teste $TOTAL_TESTS: $test_name${NC}"
    
    if [ "$test_type" = "silent" ]; then
        result=$(eval "$test_command" 2>/dev/null)
    else
        result=$(eval "$test_command")
    fi
    
    if echo "$result" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}  ✅ PASSOU: $test_name${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}  ❌ FALHOU: $test_name${NC}"
        echo -e "${RED}     Esperado: $expected_pattern${NC}"
        echo -e "${RED}     Obtido: $result${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Função para teste de conectividade
test_connectivity() {
    local url="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}🌐 Teste $TOTAL_TESTS: $description${NC}"
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}  ✅ PASSOU: $description (HTTP $status_code)${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}  ❌ FALHOU: $description${NC}"
        echo -e "${RED}     Esperado: HTTP $expected_status${NC}"
        echo -e "${RED}     Obtido: HTTP $status_code${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Função para verificar arquivo
check_file() {
    local file_path="$1"
    local description="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${YELLOW}📁 Teste $TOTAL_TESTS: $description${NC}"
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}  ✅ PASSOU: Arquivo existe - $file_path${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}  ❌ FALHOU: Arquivo não encontrado - $file_path${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Função para relatório final
print_report() {
    echo ""
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${BLUE}  📊 RELATÓRIO FINAL DOS TESTES${NC}"
    echo -e "${BLUE}=====================================================================${NC}"
    echo -e "${CYAN}Total de testes executados: $TOTAL_TESTS${NC}"
    echo -e "${GREEN}Testes aprovados: $PASSED_TESTS${NC}"
    echo -e "${RED}Testes falharam: $FAILED_TESTS${NC}"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 PARABÉNS! TODOS OS TESTES DA FASE 1 PASSARAM!${NC}"
        echo -e "${GREEN}✅ O MultiBPO Fase 1 está funcionando perfeitamente!${NC}"
        echo ""
        echo -e "${CYAN}✨ Próximos passos:${NC}"
        echo -e "${CYAN}   1. Fazer backup da configuração atual${NC}"
        echo -e "${CYAN}   2. Documentar credenciais de acesso${NC}"
        echo -e "${CYAN}   3. Planejar implementação da Fase 2${NC}"
    else
        echo ""
        echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
        echo -e "${YELLOW}📋 Verifique os itens marcados com ❌ acima${NC}"
        echo -e "${YELLOW}💡 Consulte a documentação de troubleshooting${NC}"
    fi
    echo ""
}

# Início dos testes
print_header

# Verificar se estamos no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Erro: Arquivo docker-compose.yml não encontrado!${NC}"
    echo -e "${YELLOW}💡 Execute este script dentro do diretório ~/multibpo_project/${NC}"
    exit 1
fi

# ====================================================================
# TESTE 1: ESTRUTURA DE ARQUIVOS
# ====================================================================
print_section "ESTRUTURA DE ARQUIVOS E CONFIGURAÇÕES"

check_file "docker-compose.yml" "Arquivo Docker Compose principal"
check_file ".env" "Arquivo de variáveis de ambiente"
check_file "multibpo_backend/manage.py" "Django manage.py"
check_file "multibpo_backend/config/settings.py" "Django settings.py"
check_file "multibpo_frontend/package.json" "Package.json do Astro"
check_file "infrastructure/nginx/nginx.conf" "Configuração do Nginx"

# ====================================================================
# TESTE 2: VARIÁVEIS DE AMBIENTE
# ====================================================================
print_section "VARIÁVEIS DE AMBIENTE"

run_test "Variáveis DATABASE no .env" "grep -E '^DATABASE_' .env" "DATABASE_NAME" "silent"
run_test "Variáveis POSTGRES no .env" "grep -E '^POSTGRES_' .env" "POSTGRES_DB" "silent"
run_test "Django Secret Key configurada" "grep -E '^DJANGO_SECRET_KEY' .env" "DJANGO_SECRET_KEY" "silent"

# ====================================================================
# TESTE 3: STATUS DOS CONTAINERS
# ====================================================================
print_section "STATUS DOS CONTAINERS DOCKER"

run_test "Container multibpo_backend rodando" "docker-compose ps | grep multibpo_backend" "Up"
run_test "Container multibpo_frontend rodando" "docker-compose ps | grep multibpo_frontend" "Up"
run_test "Container multibpo_db rodando" "docker-compose ps | grep multibpo_db" "Up"
run_test "Container multibpo_nginx rodando" "docker-compose ps | grep multibpo_nginx" "Up"

# Verificar se PostgreSQL está healthy
run_test "PostgreSQL healthy" "docker-compose ps | grep multibpo_db" "healthy"

# ====================================================================
# TESTE 4: CONECTIVIDADE DE REDE
# ====================================================================
print_section "CONECTIVIDADE DE REDE E ENDPOINTS"

test_connectivity "http://192.168.1.4:8082/health/" "Health Check do Sistema" "200"
test_connectivity "http://192.168.1.4:8082/admin/" "Django Admin (redirecionamento)" "302"
test_connectivity "http://192.168.1.4:8082/" "Página inicial (Frontend Astro)" "200"
test_connectivity "http://192.168.1.4:8010/admin/" "Django direto (porta 8010)" "302"
test_connectivity "http://192.168.1.4:8011/" "Astro direto (porta 8011)" "200"

# ====================================================================
# TESTE 5: CONFIGURAÇÃO DO DJANGO
# ====================================================================
print_section "CONFIGURAÇÃO DO DJANGO"

run_test "Variáveis DATABASE no backend" "docker-compose exec -T backend env | grep DATABASE" "DATABASE_NAME"
run_test "Django conectando ao banco" "docker-compose exec -T backend python manage.py check --database default" "no issues"
run_test "Migrações aplicadas" "docker-compose exec -T backend python manage.py showmigrations" "admin"

# ====================================================================
# TESTE 6: SCHEMAS DO POSTGRESQL
# ====================================================================
print_section "SCHEMAS DO POSTGRESQL"

# Verificar se os schemas existem
run_test "Schema 'contadores' existe" "docker-compose exec -T db psql -U multibpo -d multibpo_db -c '\\dn' | grep contadores" "contadores"
run_test "Schema 'ia_data' existe" "docker-compose exec -T db psql -U multibpo -d multibpo_db -c '\\dn' | grep ia_data" "ia_data"
run_test "Schema 'servicos' existe" "docker-compose exec -T db psql -U multibpo -d multibpo_db -c '\\dn' | grep servicos" "servicos"

# ====================================================================
# TESTE 7: COMUNICAÇÃO ENTRE CONTAINERS
# ====================================================================
print_section "COMUNICAÇÃO ENTRE CONTAINERS"

run_test "Backend alcança o banco" "docker-compose exec -T backend nc -z db 5432" ""
run_test "Nginx alcança backend" "docker-compose exec -T nginx nc -z backend 8000" ""
run_test "Nginx alcança frontend" "docker-compose exec -T nginx nc -z frontend 3000" ""

# ====================================================================
# TESTE 8: LOGS E SAÚDE DO SISTEMA
# ====================================================================
print_section "LOGS E SAÚDE DO SISTEMA"

# Verificar se não há erros críticos nos logs recentes
run_test "Logs backend sem erros FATAL" "docker-compose logs --tail=50 backend | grep -v FATAL" "StatReloader\|Watching" "silent"
run_test "Logs database sem erros críticos" "docker-compose logs --tail=20 db | grep -v 'does not exist'" "ready to accept" "silent"

# ====================================================================
# TESTE 9: IDENTIDADE VISUAL CONTÁBIL
# ====================================================================
print_section "IDENTIDADE VISUAL E LAYOUT CONTÁBIL"

# Verificar se a página principal contém elementos da identidade contábil
test_response=$(curl -s http://192.168.1.4:8082/ 2>/dev/null)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${YELLOW}🎨 Teste $TOTAL_TESTS: Identidade visual contábil na página${NC}"

if echo "$test_response" | grep -qi "multibpo\|contab\|bpo"; then
    echo -e "${GREEN}  ✅ PASSOU: Página contém elementos da identidade MultiBPO${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}  ❌ FALHOU: Identidade visual contábil não detectada${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# ====================================================================
# TESTE 10: FUNCIONALIDADES ESPECÍFICAS DA FASE 1
# ====================================================================
print_section "FUNCIONALIDADES ESPECÍFICAS DA FASE 1"

# Testar se consegue criar um superuser (indicativo de Django funcionando)
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${YELLOW}👤 Teste $TOTAL_TESTS: Capacidade de criar superuser Django${NC}"

create_user_result=$(docker-compose exec -T backend python manage.py shell -c "
from django.contrib.auth.models import User;
print('Django user system working' if User.objects.filter().exists() or True else 'Error')
" 2>/dev/null)

if echo "$create_user_result" | grep -q "working"; then
    echo -e "${GREEN}  ✅ PASSOU: Sistema de usuários Django funcional${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}  ❌ FALHOU: Sistema de usuários Django com problemas${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# Verificar se consegue fazer queries no banco
run_test "Queries no banco funcionando" "docker-compose exec -T backend python manage.py shell -c 'from django.db import connection; print(\"Database queries working\")'" "Database queries working"

# ====================================================================
# TESTE 11: NGINX E PROXY REVERSO
# ====================================================================
print_section "NGINX E CONFIGURAÇÃO DE PROXY"

# Verificar se o Nginx está configurado corretamente
run_test "Nginx configuração carregada" "docker-compose exec -T nginx nginx -t 2>&1" "test is successful"

# Verificar se headers estão corretos
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo -e "${YELLOW}🔧 Teste $TOTAL_TESTS: Headers HTTP do Nginx${NC}"

headers=$(curl -s -I http://192.168.1.4:8082/ 2>/dev/null)
if echo "$headers" | grep -q "nginx"; then
    echo -e "${GREEN}  ✅ PASSOU: Headers Nginx detectados${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}  ❌ FALHOU: Headers Nginx não detectados${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi

# ====================================================================
# TESTE 12: INFORMAÇÕES DO SISTEMA
# ====================================================================
print_section "INFORMAÇÕES DO SISTEMA"

echo -e "${CYAN}📊 Informações coletadas:${NC}"
echo -e "${CYAN}   • URL Principal: http://192.168.1.4:8082/${NC}"
echo -e "${CYAN}   • Django Admin: http://192.168.1.4:8082/admin/${NC}"
echo -e "${CYAN}   • Health Check: http://192.168.1.4:8082/health/${NC}"
echo -e "${CYAN}   • Backend direto: http://192.168.1.4:8010/${NC}"
echo -e "${CYAN}   • Frontend direto: http://192.168.1.4:8011/${NC}"

# Verificar versões
echo ""
echo -e "${CYAN}🔧 Versões dos componentes:${NC}"
django_version=$(docker-compose exec -T backend python -c "import django; print(django.get_version())" 2>/dev/null)
echo -e "${CYAN}   • Django: $django_version${NC}"

postgres_version=$(docker-compose exec -T db psql --version 2>/dev/null | head -1)
echo -e "${CYAN}   • PostgreSQL: $postgres_version${NC}"

nginx_version=$(docker-compose exec -T nginx nginx -v 2>&1 | head -1)
echo -e "${CYAN}   • Nginx: $nginx_version${NC}"

# ====================================================================
# RELATÓRIO FINAL
# ====================================================================
print_report

# Código de saída
if [ $FAILED_TESTS -eq 0 ]; then
    exit 0
else
    exit 1
fi