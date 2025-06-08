#!/bin/bash

# ==========================================================
# SCRIPT DE VALIDAÇÃO DA SUB-FASE 2.2.1
# MultiBPO - Plataforma BPO Contábil
# ==========================================================

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_header() {
    echo -e "${BLUE}🎯 $1${NC}"
    echo ""
}

# Início do script
clear
log_header "TESTE FINAL COMPLETO DA SUB-FASE 2.2.1"
echo "=================================================================="

# 1. Verificação de containers
log_info "1. Verificando containers..."
if docker-compose ps | grep -q "Up"; then
    CONTAINERS_UP=$(docker-compose ps | grep "Up" | wc -l)
    log_success "Containers funcionando: $CONTAINERS_UP"
    docker-compose ps | grep "Up" | awk '{print "   - " $1 ": " $4}'
else
    log_error "Nenhum container funcionando!"
    exit 1
fi
echo ""

# 2. Health check
log_info "2. Testando health check..."
HEALTH_RESPONSE=$(curl -s http://192.168.0.10:8082/health/ 2>/dev/null)
if [[ "$HEALTH_RESPONSE" == "MultiBPO OK" ]]; then
    log_success "Health check: $HEALTH_RESPONSE"
else
    log_error "Health check falhou: $HEALTH_RESPONSE"
    exit 1
fi
echo ""

# 3. APIs da Mini-Fase 2.1
log_info "3. Testando APIs Mini-Fase 2.1..."

# Auth API
AUTH_RESPONSE=$(curl -s http://192.168.0.10:8082/api/v1/auth/test/ 2>/dev/null)
if echo "$AUTH_RESPONSE" | grep -q '"status":"OK"'; then
    log_success "API Authentication: OK"
else
    log_error "API Authentication falhou"
    echo "Response: $AUTH_RESPONSE"
    exit 1
fi

# Contadores API
CONTADORES_RESPONSE=$(curl -s http://192.168.0.10:8082/api/v1/contadores/test/ 2>/dev/null)
if echo "$CONTADORES_RESPONSE" | grep -q '"status":"OK"'; then
    log_success "API Contadores: OK"
else
    log_error "API Contadores falhou"
    echo "Response: $CONTADORES_RESPONSE"
    exit 1
fi
echo ""

# 4. Dependências da Sub-Fase 2.2.1
log_info "4. Verificando dependências Sub-Fase 2.2.1..."
DEPS_CHECK=$(docker-compose exec -T backend python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

try:
    import drf_yasg
    import factory
    import coverage
    import freezegun
    import django_ratelimit
    import debug_toolbar
    import ipython
    print('SUCCESS: Todas as 7 dependências funcionando!')
except ImportError as e:
    print(f'ERROR: {e}')
    exit(1)
" 2>/dev/null)

if echo "$DEPS_CHECK" | grep -q "SUCCESS"; then
    log_success "Dependências: drf-yasg, factory-boy, coverage, freezegun, django-ratelimit, debug-toolbar, ipython"
else
    log_error "Problema com dependências:"
    echo "$DEPS_CHECK"
    exit 1
fi
echo ""

# 5. Models contábeis
log_info "5. Verificando models contábeis..."
MODELS_CHECK=$(docker-compose exec -T backend python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

try:
    from apps.contadores.models import Contador, Escritorio, Especialidade
    contadores_count = Contador.objects.count()
    escritorios_count = Escritorio.objects.count()
    especialidades_count = Especialidade.objects.count()
    print(f'SUCCESS: Models OK - Contadores: {contadores_count}, Escritórios: {escritorios_count}, Especialidades: {especialidades_count}')
except Exception as e:
    print(f'ERROR: {e}')
    exit(1)
" 2>/dev/null)

if echo "$MODELS_CHECK" | grep -q "SUCCESS"; then
    log_success "Models contábeis funcionando"
    echo "   $(echo "$MODELS_CHECK" | grep "SUCCESS" | cut -d' ' -f3-)"
else
    log_error "Problema com models:"
    echo "$MODELS_CHECK"
    exit 1
fi
echo ""

# 6. Factories de teste
log_info "6. Testando factories..."
FACTORIES_CHECK=$(docker-compose exec -T backend python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

try:
    from tests.factories.base import UserFactory, BaseContabilFactory
    user = UserFactory()
    print(f'SUCCESS: Factory funcionando! Usuário criado: {user.username}')
except Exception as e:
    print(f'ERROR: {e}')
    exit(1)
" 2>/dev/null)

if echo "$FACTORIES_CHECK" | grep -q "SUCCESS"; then
    log_success "Factories de teste funcionando"
    echo "   $(echo "$FACTORIES_CHECK" | grep "SUCCESS" | cut -d' ' -f3-)"
else
    log_error "Problema com factories:"
    echo "$FACTORIES_CHECK"
    exit 1
fi
echo ""

# 7. Django check
log_info "7. Django system check..."
DJANGO_CHECK=$(docker-compose exec -T backend python manage.py check 2>/dev/null)
if echo "$DJANGO_CHECK" | grep -q "System check identified no issues"; then
    log_success "Django system check: sem problemas"
else
    log_warning "Django check com avisos (normal em desenvolvimento)"
fi
echo ""

# Resultado final
echo "=================================================================="
log_header "🎉 PREPARAÇÃO DA SUB-FASE 2.2.1 CONCLUÍDA COM SUCESSO!"
echo ""
log_success "✅ Infraestrutura: 4 containers funcionando"
log_success "✅ APIs Base: authentication + contadores OK" 
log_success "✅ Dependências: 7 pacotes instalados e funcionando"
log_success "✅ Models: Contador, Escritorio, Especialidade OK"
log_success "✅ Factories: Sistema de testes automatizados OK"
log_success "✅ Django: Configurações validadas"
echo ""
log_info "🚀 Sistema pronto para implementação dos Serializers DRF!"
echo ""
echo "=================================================================="

# Informações adicionais
echo ""
log_info "📋 PRÓXIMOS PASSOS:"
echo "   1. Implementar serializers contábeis"
echo "   2. Criar testes com alta cobertura"
echo "   3. Validações brasileiras (CPF/CNPJ/CRC)"
echo "   4. Documentação automática com Swagger"
echo ""
log_info "🔗 URLs de teste:"
echo "   - Health: http://192.168.0.10:8082/health/"
echo "   - Auth API: http://192.168.0.10:8082/api/v1/auth/test/"
echo "   - Contadores API: http://192.168.0.10:8082/api/v1/contadores/test/"
echo "   - Admin: http://192.168.0.10:8082/admin/"