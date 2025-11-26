# ⚡ Configuración Rápida - Base de Datos Externa

## 📝 Pasos para Configurar

### 1. Editar archivo de configuración

```bash
cd server
nano .env  # o usa tu editor preferido
```

### 2. Configurar DATABASE_URL

Reemplaza con tus datos reales:

```env
DATABASE_URL="postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BD]?schema=public"
```

**Ejemplo:**
```env
DATABASE_URL="postgresql://gdi_admin:MiPassword123@db.miempresa.com:5432/gdi_production?schema=public"
```

### 3. Parámetros necesarios

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| **USUARIO** | Usuario de PostgreSQL | `gdi_admin` |
| **CONTRASEÑA** | Contraseña del usuario | `MiPassword123` |
| **HOST** | Dirección del servidor | `db.miempresa.com` o `192.168.1.100` |
| **PUERTO** | Puerto de PostgreSQL | `5432` (por defecto) |
| **NOMBRE_BD** | Nombre de la base de datos | `gdi_production` |

### 4. Ejecutar migraciones

```bash
# Desde la raíz del proyecto
npm run prisma:generate
npm run prisma:migrate
```

### 5. Verificar conexión

```bash
npm run prisma:studio
```

## 🔒 Para Producción

Agrega SSL a la conexión:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/db?schema=public&sslmode=require"
```

## ✅ Checklist

- [ ] Tengo las credenciales de la base de datos (usuario, contraseña, host, puerto, nombre)
- [ ] He editado el archivo `server/.env` con la URL correcta
- [ ] La base de datos está accesible desde mi máquina/servidor
- [ ] He ejecutado `npm run prisma:generate`
- [ ] He ejecutado `npm run prisma:migrate`
- [ ] He verificado que las tablas se crearon correctamente

## 🆘 Problemas Comunes

### No puedo conectarme

1. Verifica que el servidor de BD esté activo
2. Confirma que el firewall permite conexiones al puerto
3. Prueba la conexión con: `telnet HOST PUERTO`

### Error de autenticación

1. Verifica usuario y contraseña
2. Confirma que el usuario tiene permisos en la base de datos

### Base de datos no existe

Créala manualmente:
```sql
CREATE DATABASE nombre_bd;
GRANT ALL PRIVILEGES ON DATABASE nombre_bd TO usuario;
```

## 📖 Documentación Completa

Para más detalles, consulta: [docs/database-setup.md](./docs/database-setup.md)
