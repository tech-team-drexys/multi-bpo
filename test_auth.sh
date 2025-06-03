#!/bin/bash

BASE_URL="http://192.168.1.4:8010/api/v1/auth"

echo "=== Teste: Registrar Contador ==="
curl -v -X POST "$BASE_URL/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testeuser",
    "email": "testeuser@example.com",
    "password": "senha1234"
  }'
echo -e "\n\n"

echo "=== Teste: Login com Email ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testeuser@example.com",
    "password": "senha1234"
  }'
echo -e "\n\n"

echo "=== Teste: Login com CRC ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "crc": "123456789",
    "password": "senha1234"
  }'
echo -e "\n\n"

echo "=== Teste: Login com Username ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testeuser",
    "password": "senha1234"
  }'
echo -e "\n\n"
