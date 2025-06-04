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

echo "=== Teste: Login com login=Email ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testeuser@example.com",
    "password": "senha1234"
  }'
echo -e "\n\n"

echo "=== Teste: Login com login=CRC ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "123456789",
    "password": "senha1234"
  }'
echo -e "\n\n"

echo "=== Teste: Login com login=Username ==="
curl -v -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testeuser",
    "password": "senha1234"
  }'
echo -e "\n\n"
