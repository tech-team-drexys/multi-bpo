#!/bin/bash
set -e

# Carregar variáveis do .env
if [ -f .env ]; then
  export $(grep -v '^#' ../.env | xargs)
fi

BASE_URL="$API_BASE_URL"

echo "=== Teste: Registrar Contador ==="
curl -s -X POST "$BASE_URL/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq
echo -e "\n\n"

echo "=== Teste: Login com Email ==="
curl -s -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq
echo -e "\n\n"

echo "=== Teste: Login com CRC ==="
curl -s -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"crc\": \"$TEST_CRC\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq
echo -e "\n\n"

echo "=== Teste: Login com Username ==="
curl -s -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_USERNAME\",
    \"password\": \"$TEST_PASSWORD\"
  }" | jq
echo -e "\n\n"
