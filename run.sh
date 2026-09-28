#!/bin/bash
set -e
trap 'kill 0' EXIT

echo "Starting database..."
docker compose up -d --wait db

echo "Starting backend..."
(cd backend && ./mvnw spring-boot:run) &

echo "Starting frontend..."
(cd frontend && npm run dev) &

wait
