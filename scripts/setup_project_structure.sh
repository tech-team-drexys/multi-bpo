#!/bin/bash

echo "🏗️ ESTRUTURA MULTIBPO - FOCADA NO PROJETO"
echo "========================================="
echo ""

echo "📁 ESTRUTURA DE DIRETÓRIOS (SEM VENV):"
echo "--------------------------------------"
find . -type d -not -path './multibpo_backend/venv*' -not -path './.git*' -not -path './__pycache__*' | sort

echo ""
echo "📄 ARQUIVOS PYTHON DO PROJETO:"
echo "-------------------------------"
find . -name "*.py" -not -path './multibpo_backend/venv*' -not -path './.git*' -not -path './__pycache__*' | sort

echo ""
echo "🔧 ARQUIVOS DE CONFIGURAÇÃO:"
echo "-----------------------------"
echo "docker-compose.yml:"
[ -f docker-compose.yml ] && echo "✅ Existe" || echo "❌ Não encontrado"

echo ".env:"
[ -f .env ] && echo "✅ Existe" || echo "❌ Não encontrado"

echo "requirements.txt (backend):"
[ -f multibpo_backend/requirements.txt ] && echo "✅ Existe" || echo "❌ Não encontrado"

echo ""
echo "📋 ARQUIVOS ESPECÍFICOS:"
echo "------------------------"
echo "multibpo_backend/config/urls.py:"
[ -f multibpo_backend/config/urls.py ] && cat multibpo_backend/config/urls.py || echo "❌ Não encontrado"

echo ""
echo "multibpo_backend/config/settings.py (primeiras 50 linhas):"
[ -f multibpo_backend/config/settings.py ] && head -50 multibpo_backend/config/settings.py || echo "❌ Não encontrado"

echo ""
echo "📂 APPS EXISTENTES:"
echo "-------------------"
[ -d multibpo_backend/apps ] && ls -la multibpo_backend/apps/ || echo "❌ Diretório apps não encontrado"

echo ""
echo "🔗 URLs DOS APPS:"
echo "----------------"
for app_dir in multibpo_backend/apps/*/; do
    if [ -d "$app_dir" ]; then
        app_name=$(basename "$app_dir")
        echo "📱 App: $app_name"
        
        if [ -f "${app_dir}urls.py" ]; then
            echo "   ✅ urls.py existe"
            echo "   Conteúdo:"
            cat "${app_dir}urls.py"
        else
            echo "   ❌ urls.py não encontrado"
        fi
        
        if [ -f "${app_dir}views.py" ]; then
            echo "   ✅ views.py existe (primeiras 20 linhas):"
            head -20 "${app_dir}views.py"
        else
            echo "   ❌ views.py não encontrado"
        fi
        echo ""
    fi
done

echo ""
echo "🚀 STATUS DOS CONTAINERS:"
echo "------------------------"
docker ps | grep multibpo || echo "❌ Nenhum container multibpo rodando"

echo ""
echo "🔍 LOGS DO BACKEND (últimas 15 linhas):"
echo "---------------------------------------"
docker logs multibpo_backend --tail=15 2>/dev/null || echo "❌ Container multibpo_backend não acessível"