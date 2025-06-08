#!/bin/bash

# 🚧 Parando e removendo containers, redes e cache intermediário
echo "🛑 Parando e removendo containers..."
docker-compose down

# 🔨 Reconstruindo apenas o container do backend sem cache
echo "🔨 Reconstruindo container backend (sem cache)..."
docker-compose build --no-cache backend

# 🚀 Subindo todos os containers novamente
echo "🚀 Iniciando containers..."
docker-compose up -d

echo "✅ Containers estão rodando! ✔️"
