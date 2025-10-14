#!/bin/bash

# Script para exportar la base de datos PostgreSQL
# Uso: ./scripts/export-db.sh

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Exportando base de datos...${NC}"

# Crear directorio de backups si no existe
mkdir -p backups

# Nombre del archivo con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/gdi_backup_${TIMESTAMP}.sql"

# Exportar base de datos
pg_dump gdi_development > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de datos exportada exitosamente!${NC}"
    echo -e "${GREEN}📁 Archivo: ${BACKUP_FILE}${NC}"
    
    # Comprimir el archivo
    gzip "$BACKUP_FILE"
    echo -e "${GREEN}🗜️  Archivo comprimido: ${BACKUP_FILE}.gz${NC}"
else
    echo -e "${RED}❌ Error al exportar la base de datos${NC}"
    exit 1
fi
