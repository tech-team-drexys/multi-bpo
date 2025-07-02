#!/bin/bash
# ========== MONITOR SYSTEM - MULTIBPO FASE 4 ==========
# Script para monitoramento em tempo real

METRICS_URL="http://localhost:8090/api/v1/whatsapp/metrics/?secret=multibpo_metrics_2025"

echo "📊 MultiBPO System Monitor - $(date)"
echo "=========================================="

# Função para formatar números
format_number() {
    printf "%'d" "$1" 2>/dev/null || echo "$1"
}

# Loop de monitoramento
while true; do
    clear
    echo "📊 MultiBPO System Monitor - $(date)"
    echo "=========================================="
    
    # Status dos containers
    echo ""
    echo "🐳 CONTAINERS:"
    docker ps --filter="name=multibpo" --format="table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    # Métricas via API
    echo ""
    echo "📈 MÉTRICAS:"
    
    metrics=$(curl -s "$METRICS_URL" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ ! -z "$metrics" ]; then
        # Extrair dados usando jq se disponível
        if command -v jq >/dev/null 2>&1; then
            echo "👥 Usuários:"
            echo "   Hoje: $(echo "$metrics" | jq -r '.users.today // "N/A"')"
            echo "   Semana: $(echo "$metrics" | jq -r '.users.week // "N/A"')"
            echo "   Total: $(echo "$metrics" | jq -r '.users.total // "N/A"')"
            
            echo ""
            echo "💬 Mensagens:"
            echo "   Hoje: $(echo "$metrics" | jq -r '.messages.today // "N/A"')"
            echo "   Semana: $(echo "$metrics" | jq -r '.messages.week // "N/A"')"
            
            echo ""
            echo "📧 Email:"
            echo "   Pendentes: $(echo "$metrics" | jq -r '.email_verification.pending // "N/A"')"
            echo "   Verificados (7d): $(echo "$metrics" | jq -r '.email_verification.verified_week // "N/A"')"
            
            echo ""
            echo "📊 Conversão:"
            echo "   Taxa Cadastro: $(echo "$metrics" | jq -r '.conversion.signup_rate // "N/A"')%"
            echo "   Taxa Premium: $(echo "$metrics" | jq -r '.conversion.premium_rate // "N/A"')%"
            
            echo ""
            echo "🏥 Health Checks:"
            echo "   Database: $(echo "$metrics" | jq -r '.health.database // "N/A"')"
            echo "   Email: $(echo "$metrics" | jq -r '.health.email // "N/A"')"
            echo "   WhatsApp API: $(echo "$metrics" | jq -r '.health.whatsapp_api // "N/A"')"
            echo "   Disk Space: $(echo "$metrics" | jq -r '.health.disk_space // "N/A"')"
        else
            echo "📊 Métricas disponíveis (instale jq para formatação):"
            echo "$metrics" | python3 -m json.tool 2>/dev/null || echo "$metrics"
        fi
    else
        echo "❌ Erro ao obter métricas"
        echo "🔗 Tentando: $METRICS_URL"
    fi
    
    # Uso de disco
    echo ""
    echo "💾 DISCO:"
    df -h | grep -E "(Filesystem|/dev/)" | head -2
    
    # Logs recentes
    echo ""
    echo "📋 LOGS RECENTES:"
    docker logs multibpo_backend --tail=3 2>/dev/null | sed 's/^/   /' || echo "   Sem logs disponíveis"
    
    echo ""
    echo "⏱️  Atualizando em 30s... (Ctrl+C para sair)"
    sleep 30
done