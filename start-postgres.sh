#!/bin/bash

echo "🔧 Limpiando procesos anteriores..."

# Matar cualquier proceso en el puerto 5432
lsof -ti:5432 | xargs kill -9 2>/dev/null

# Esperar un momento
sleep 2

echo "🚀 Iniciando PostgreSQL con Docker..."

# Intentar eliminar contenedor anterior
docker rm -f gdi-postgres 2>/dev/null

# Crear nuevo contenedor
docker run --name gdi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gdi_db \
  -p 5432:5432 \
  -d postgres:14

# Verificar si funcionó
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL está corriendo!"
    echo ""
    echo "📝 Tu archivo .env debe tener:"
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gdi_db?schema=public"'
    echo ""
    echo "🚀 Ahora ejecuta:"
    echo "  npm run prisma:migrate"
    echo "  npm run prisma:seed"
    echo "  npm run dev"
else
    echo "❌ Error. Asegúrate de que Docker Desktop esté abierto y funcionando."
fi
