#!/bin/bash

echo "🐳 Configurando PostgreSQL con Docker..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo."
    echo "👉 Por favor, abre Docker Desktop desde Aplicaciones y espera a que inicie."
    echo "👉 Luego ejecuta este script nuevamente: ./setup-database.sh"
    exit 1
fi

echo "✅ Docker está corriendo"

# Detener y eliminar contenedor existente si existe
docker stop gdi-postgres 2>/dev/null
docker rm gdi-postgres 2>/dev/null

# Crear y ejecutar contenedor de PostgreSQL
echo "🚀 Creando contenedor de PostgreSQL..."
docker run --name gdi-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gdi_db \
  -p 5432:5432 \
  -d postgres:14

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Verificar que el contenedor esté corriendo
if docker ps | grep -q gdi-postgres; then
    echo "✅ PostgreSQL está corriendo en Docker"
    echo ""
    echo "📝 Actualiza tu archivo .env con:"
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gdi_db?schema=public"'
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. Actualiza el archivo .env"
    echo "2. Ejecuta: npm run prisma:migrate"
    echo "3. Ejecuta: npm run prisma:seed"
    echo "4. Ejecuta: npm run dev"
else
    echo "❌ Error al iniciar PostgreSQL"
    exit 1
fi
