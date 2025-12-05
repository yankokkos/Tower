#!/bin/bash
# Script de inicialização rápida do Docker

set -e

echo "🐳 Iniciando Tower RPG com Docker..."
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📋 Copiando exemplo..."
    cp docker/env.example .env
    echo "✅ Arquivo .env criado. Por favor, edite com suas configurações!"
    echo ""
    read -p "Pressione Enter para continuar ou Ctrl+C para editar o .env primeiro..."
fi

# Build e iniciar containers
echo "🔨 Fazendo build dos containers..."
docker-compose build

echo "🚀 Iniciando containers..."
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Serviços iniciados!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:8080/api"
echo ""
echo "📝 Para ver logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"

