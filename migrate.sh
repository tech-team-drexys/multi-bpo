#!/bin/bash

echo "🚀 Iniciando migração Astro → React + Vite..."

# Parar containers atuais
echo "📦 Parando containers..."
docker-compose down

# Backup da estrutura atual
echo "💾 Fazendo backup..."
cp -r multibpo_frontend multibpo_frontend_backup_$(date +%Y%m%d_%H%M%S)

# Limpar node_modules e arquivos desnecessários
echo "🧹 Limpeza..."
cd multibpo_frontend
rm -rf node_modules package-lock.json
rm -f astro.config.mjs
rm -rf .astro
rm -rf dist

# Criar nova estrutura de diretórios
echo "📁 Criando estrutura React..."
mkdir -p src/components

echo "✅ Backup criado e estrutura preparada!"
echo ""
echo "🔧 Próximos passos:"
echo "1. Copie os novos arquivos para multibpo_frontend/"
echo "2. Execute: npm install"
echo "3. Execute: docker-compose up --build"
echo ""
echo "📋 Lista de arquivos para copiar:"
echo "- package.json"
echo "- vite.config.ts"
echo "- tailwind.config.js"
echo "- postcss.config.js"
echo "- tsconfig.json"
echo "- tsconfig.node.json"
echo "- index.html"
echo "- nginx.conf"
echo "- Dockerfile"
echo "- src/main.tsx"
echo "- src/App.tsx"
echo "- src/index.css"
echo "- src/vite-env.d.ts"
echo "- src/components/*.tsx"
