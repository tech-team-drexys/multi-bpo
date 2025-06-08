#!/bin/bash

ENV_FILE="$(cd "$(dirname "$0")/.." && pwd)/.env"

if [ -f "$ENV_FILE" ]; then
  while IFS='=' read -r key value || [ -n "$key" ]; do
    # Pula comentários e linhas vazias
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue

    # Remove espaços em branco no início e fim da chave e valor
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)

    # Exporta variável com valor entre aspas para proteger caracteres especiais
    export "$key=$value"
  done < "$ENV_FILE"
else
  echo "Arquivo .env não encontrado em $ENV_FILE"
fi

echo "API_BASE_URL=$API_BASE_URL"

echo "=== Teste: Registrar Contador ==="
curl -v -X POST "$BASE_URL/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }"
echo -e "\n\n"

echo "=== Teste: Login com Email ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }"
echo -e "\n\n"

echo "=== Teste: Login com CRC ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"crc\": \"$TEST_CRC\",
    \"password\": \"$TEST_PASSWORD\"
  }"
echo -e "\n\n"

echo "=== Teste: Login com Username ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }"
echo -e "\n\n"
