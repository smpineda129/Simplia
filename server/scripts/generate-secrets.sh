#!/bin/bash

# Script para generar secrets JWT seguros
# Uso: ./scripts/generate-secrets.sh

echo "🔐 Generando JWT Secrets..."
echo ""
echo "Copia estos valores en las variables de entorno de Render:"
echo ""
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)"
echo ""
echo "✅ Secrets generados!"
