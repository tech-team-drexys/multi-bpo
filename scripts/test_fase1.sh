#!/bin/bash

# Cores para saída colorida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

# Caminho relativo para o .env fora da pasta scripts
ENV_PATH="$(dirname "$0")/../.env"

# Carrega variáveis do .env externo
if [ -f "$ENV_PATH" ]; then
    export $(grep -v '^#' "$ENV_PATH" | xargs)
else
    echo -e "${RED}❌ Arquivo .env não encontrado em: $ENV_PATH. Abortando.${NC}"
    exit 1
fi

# Função para testar conectividade
test_connectivity() {
    URL=$1
    DESCRIPTION=$2
    EXPECTED_STATUS=$3

    HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" "$URL")

    if [ "$HTTP_CODE" == "$EXPECTED_STATUS" ]; then
        echo -e "${GREEN}✅ $DESCRIPTION OK [$HTTP_CODE]${NC}"
    else
        echo -e "${RED}❌ $DESCRIPTION Falhou [$HTTP_CODE]${NC}"
    fi
}

echo -e "${CYAN}🔍 Iniciando testes de conectividade...${NC}"

# Testes via nginx reverso
test_connectivity "http://${IP_BASE}:${PORT_NGINX}/health/" "Health Check do Sistema" "200"
test_connectivity "http://${IP_BASE}:${PORT_NGINX}/admin/" "Django Admin (redirecionamento)" "302"
test_connectivity "http://${IP_BASE}:${PORT_NGINX}/" "Página inicial (Frontend Astro)" "200"

# Testes diretos
test_connectivity "http://${IP_BASE}:${PORT_BACKEND}/admin/" "Django direto (porta backend)" "302"
test_connectivity "http://${IP_BASE}:${PORT_FRONTEND}/" "Astro direto (porta frontend)" "200"

# Teste extra: identidade visual da landing page
echo -e "${CYAN}🎨 Verificando identidade visual da página inicial...${NC}"
test_response=$(curl -s http://${IP_BASE}:${PORT_NGINX}/ 2>/dev/null)

if echo "$test_response" | grep -q "Astro"; then
    echo -e "${GREEN}✅ Frontend identificado como Astro.${NC}"
else
    echo -e "${YELLOW}⚠️  Não foi possível identificar o frontend (esperado: Astro).${NC}"
fi

# URLs úteis
echo -e "${CYAN}📄 URLs úteis:${NC}"
echo -e "${CYAN}   • URL Principal: http://${IP_BASE}:${PORT_NGINX}/${NC}"
echo -e "${CYAN}   • Django Admin: http://${IP_BASE}:${PORT_NGINX}/admin/${NC}"
echo -e "${CYAN}   • Health Check: http://${IP_BASE}:${PORT_NGINX}/health/${NC}"
echo -e "${CYAN}   • Backend direto: http://${IP_BASE}:${PORT_BACKEND}/${NC}"
echo -e "${CYAN}   • Frontend direto: http://${IP_BASE}:${PORT_FRONTEND}/${NC}"

echo -e "${GREEN}✅ Testes finalizados.${NC}"
