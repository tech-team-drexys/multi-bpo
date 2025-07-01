#!/bin/bash
echo "🔍 Análise da Estrutura IA WhatsApp - Dias 5-6"
echo "============================================="

echo ""
echo "1. 📁 Estrutura de arquivos do projeto IA WhatsApp..."
docker exec -it multibpo_ia_whatsapp find . -name "*.py" -type f | head -20

echo ""
echo "2. 📋 Principais arquivos de configuração..."
docker exec -it multibpo_ia_whatsapp ls -la

echo ""
echo "3. 🔧 Apps Django instalados..."
docker exec -it multibpo_ia_whatsapp python manage.py shell -c "
from django.conf import settings
print('INSTALLED_APPS:')
for app in settings.INSTALLED_APPS:
    print(f'  - {app}')
"

echo ""
echo "4. 🗄️ Models existentes..."
docker exec -it multibpo_ia_whatsapp python manage.py shell -c "
from django.apps import apps
for model in apps.get_models():
    print(f'{model._meta.app_label}.{model.__name__}')
"

echo ""
echo "5. 🌐 URLs configuradas..."
docker exec -it multibpo_ia_whatsapp find . -name "urls.py" -exec echo "=== {} ===" \; -exec cat {} \;

echo ""
echo "6. 📱 Verificar webhook WhatsApp atual..."
docker exec -it multibpo_ia_whatsapp find . -name "*webhook*" -o -name "*whatsapp*" | head -10

echo ""
echo "7. 🤖 Verificar integração OpenAI atual..."
docker exec -it multibpo_ia_whatsapp find . -name "*.py" -exec grep -l "openai\|OpenAI" {} \;

echo ""
echo "8. ⚙️ Verificar settings.py..."
docker exec -it multibpo_ia_whatsapp cat settings.py | grep -A5 -B5 "DEBUG\|ALLOWED_HOSTS\|DATABASES"

echo ""
echo "9. 📦 Dependências instaladas..."
docker exec -it multibpo_ia_whatsapp pip list | grep -E "(django|openai|requests)"

echo ""
echo "🎯 Análise concluída! Use estes dados para implementar a integração."