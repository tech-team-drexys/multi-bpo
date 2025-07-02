#!/bin/bash
# ========== BACKUP PRODUCTION - MULTIBPO FASE 4 ==========
# Script para backup completo do sistema MultiBPO
# Data: $(date)

set -e  # Parar se houver erro

# Configurações
BACKUP_DIR="/tmp/multibpo_backups/$(date +%Y%m%d_%H%M%S)"
PROJECT_DIR="$HOME/multibpo_project/multibpo_project_site"
CONTAINER_BACKEND="multibpo_backend"
CONTAINER_DB="multibpo_db"

echo "🔄 Iniciando backup MultiBPO - $(date)"
echo "📁 Diretório: $BACKUP_DIR"

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# 1. Backup do banco PostgreSQL
echo "💾 Backup do banco de dados..."
docker exec $CONTAINER_DB pg_dump -U multibpo multibpo_db > "$BACKUP_DIR/database.sql"
echo "✅ Banco salvo: database.sql"

# 2. Backup dos arquivos de configuração
echo "📄 Backup das configurações..."
cp "$PROJECT_DIR/.env" "$BACKUP_DIR/env_backup"
cp "$PROJECT_DIR/docker-compose.yml" "$BACKUP_DIR/docker-compose_backup.yml"
echo "✅ Configurações salvas"

# 3. Backup dos logs
echo "📋 Backup dos logs..."
docker exec $CONTAINER_BACKEND tar -czf /tmp/logs_backup.tar.gz /app/logs/ 2>/dev/null || true
docker cp $CONTAINER_BACKEND:/tmp/logs_backup.tar.gz "$BACKUP_DIR/logs_backup.tar.gz"
echo "✅ Logs salvos"

# 4. Backup do código (apenas configurações importantes)
echo "💻 Backup do código..."
tar -czf "$BACKUP_DIR/code_backup.tar.gz" \
    -C "$PROJECT_DIR" \
    --exclude="node_modules" \
    --exclude="__pycache__" \
    --exclude=".git" \
    --exclude="multibpo_frontend/dist" \
    multibpo_backend/apps/whatsapp_users/ \
    infrastructure/ \
    scripts/

echo "✅ Código salvo"

# 5. Backup dos dados de usuários WhatsApp
echo "👥 Backup dados usuários..."
docker exec $CONTAINER_BACKEND python manage.py shell -c "
from apps.whatsapp_users.models import WhatsAppUser, WhatsAppMessage
import json

# Exportar usuários
users = list(WhatsAppUser.objects.values())
messages = list(WhatsAppMessage.objects.values())

data = {
    'users': users,
    'messages': messages[:1000],  # Últimas 1000 mensagens
    'export_date': '$(date -Iseconds)'
}

with open('/tmp/users_backup.json', 'w') as f:
    json.dump(data, f, default=str, indent=2)
" 2>/dev/null || echo "⚠️ Erro no backup de usuários (pode ser normal)"

docker cp $CONTAINER_BACKEND:/tmp/users_backup.json "$BACKUP_DIR/users_backup.json" 2>/dev/null || true

# 6. Informações do sistema
echo "📊 Salvando informações do sistema..."
cat > "$BACKUP_DIR/system_info.txt" << EOF
MultiBPO Backup Information
==========================
Data: $(date)
Versão: MVP Fase 4
Host: $(hostname)

Containers:
$(docker ps --filter="name=multibpo" --format="table {{.Names}}\t{{.Status}}\t{{.Image}}")

Volumes:
$(docker volume ls --filter="name=multibpo")

Disk Usage:
$(df -h)

EOF

echo "✅ Informações do sistema salvas"

# 7. Compactar tudo
echo "📦 Compactando backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C "$(dirname $BACKUP_DIR)" "$(basename $BACKUP_DIR)"
rm -rf "$BACKUP_DIR"

echo ""
echo "🎉 Backup concluído com sucesso!"
echo "📁 Arquivo: $BACKUP_DIR.tar.gz"
echo "💾 Tamanho: $(du -h "$BACKUP_DIR.tar.gz" | cut -f1)"
echo ""
echo "Para restaurar:"
echo "  tar -xzf $BACKUP_DIR.tar.gz"
echo "  ./scripts/restore_production.sh $(basename $BACKUP_DIR)"