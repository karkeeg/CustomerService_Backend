#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "1. Registering Consumer..."
curl -X POST "$BASE_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "consumer1", "email": "consumer1@test.com", "password": "password123", "role": "consumer"}'
echo -e "\n"

echo "2. Registering Provider..."
curl -X POST "$BASE_URL/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "provider1", "email": "provider1@test.com", "password": "password123", "role": "provider"}'
echo -e "\n"

echo "3. Fetching all services (Consumer endpoint)..."
curl -X GET "$BASE_URL/consumer/services"
echo -e "\n"
