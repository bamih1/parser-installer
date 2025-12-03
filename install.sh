#!/bin/bash
set -e

echo "🚀 Установка Parser Backend..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker не установлен"
  exit 1
fi

sudo mkdir -p /opt/parser-backend
sudo chown $USER:$USER /opt/parser-backend
cd /opt/parser-backend

mkdir -p frontend parsers routes

echo "✅ Файлы готовы!"
echo "Запуск: docker compose up -d --build"
echo "🌐 Доступ: http://parser.bamih1-n8n.ru"