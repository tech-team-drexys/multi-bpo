#!/bin/bash
echo "🔍 Análise do Código Crítico - IA WhatsApp"
echo "==========================================="

echo ""
echo "1. 📥 WEBHOOK PRINCIPAL (webhook_app/views.py)..."
echo "================================================"
docker exec -it multibpo_ia_whatsapp cat webhook_app/views.py

echo ""
echo "2. 🤖 PROCESSADOR DE MENSAGENS (webhook_app/services/message_processor.py)..."
echo "=========================================================================="
docker exec -it multibpo_ia_whatsapp cat webhook_app/services/message_processor.py

echo ""
echo "3. 🧠 SERVIÇO OPENAI (webhook_app/services/openai_service.py)..."
echo "============================================================="
docker exec -it multibpo_ia_whatsapp cat webhook_app/services/openai_service.py

echo ""
echo "4. 📱 SERVIÇO WHATSAPP (webhook_app/services/whatsapp_service.py)..."
echo "================================================================"
docker exec -it multibpo_ia_whatsapp cat webhook_app/services/whatsapp_service.py

echo ""
echo "5. 🗄️ MODELS (webhook_app/models.py)..."
echo "====================================="
docker exec -it multibpo_ia_whatsapp cat webhook_app/models.py

echo ""
echo "6. ⚙️ SETTINGS PRINCIPAIS (ia_whatsapp_drexys/settings.py)..."
echo "=========================================================="
docker exec -it multibpo_ia_whatsapp cat ia_whatsapp_drexys/settings.py | head -50

echo ""
echo "🎯 Análise crítica concluída!"