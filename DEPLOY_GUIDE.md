# 🚀 GUÍA DE DEPLOY GRATUITO - GDI

**Fecha:** 2025-10-13  
**Plataformas:** Render (Backend + DB) + Vercel (Frontend)

---

## 📋 ÍNDICE

1. [Requisitos Previos](#requisitos-previos)
2. [Deploy del Backend (Render)](#deploy-del-backend-render)
3. [Deploy de la Base de Datos (Render PostgreSQL)](#deploy-de-la-base-de-datos)
4. [Deploy del Frontend (Vercel)](#deploy-del-frontend-vercel)
5. [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
6. [Migración de Datos](#migración-de-datos)
7. [Verificación](#verificación)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 REQUISITOS PREVIOS

### **Cuentas Necesarias:**
- ✅ Cuenta de GitHub (para código)
- ✅ Cuenta de Render (https://render.com) - GRATIS
- ✅ Cuenta de Vercel (https://vercel.com) - GRATIS

### **Preparación:**
```bash
# 1. Asegúrate de tener Git instalado
git --version

# 2. Inicializa el repositorio (si no lo has hecho)
cd /Users/mac/Documents/GDI
git init
git add .
git commit -m "Initial commit"

# 3. Crea un repositorio en GitHub y súbelo
git remote add origin https://github.com/tu-usuario/gdi.git
git branch -M main
git push -u origin main
```

---

## 🔧 DEPLOY DEL BACKEND (RENDER)

### **Paso 1: Crear Servicio Web en Render**

1. Ve a https://dashboard.render.com
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

```yaml
Name: gdi-backend
Region: Oregon (US West)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

### **Paso 2: Plan Gratuito**
- Selecciona **"Free"** plan
- ⚠️ **Nota:** El plan gratuito se duerme después de 15 minutos de inactividad

---

## 🗄️ DEPLOY DE LA BASE DE DATOS

### **Paso 1: Crear PostgreSQL en Render**

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configura:

```yaml
Name: gdi-database
Database: gdi_db
User: gdi_user
Region: Oregon (US West) - MISMO que el backend
PostgreSQL Version: 15
```

3. Selecciona **"Free"** plan
4. Click **"Create Database"**

### **Paso 2: Obtener URL de Conexión**

1. Una vez creada, ve a la pestaña **"Info"**
2. Copia el **"Internal Database URL"** (más rápido que External)
3. Ejemplo: `postgresql://user:pass@dpg-xxx/db_xxx`

---

## 🌐 DEPLOY DEL FRONTEND (VERCEL)

### **Paso 1: Importar Proyecto**

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Configura:

```yaml
Project Name: gdi-frontend
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **Paso 2: Variables de Entorno**

En la sección **"Environment Variables"**, agrega:

```
VITE_API_URL = https://tu-backend.onrender.com/api
```

⚠️ **Importante:** Reemplaza `tu-backend` con el nombre real de tu servicio en Render

### **Paso 3: Deploy**

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. Obtendrás una URL como: `https://gdi-frontend.vercel.app`

---

## ⚙️ CONFIGURACIÓN DE VARIABLES DE ENTORNO

### **Backend (Render)**

En tu servicio web de Render, ve a **"Environment"** y agrega:

```bash
# Database
DATABASE_URL = [URL de tu PostgreSQL de Render]

# JWT Secrets (genera valores aleatorios seguros)
JWT_SECRET = [genera con: openssl rand -base64 32]
JWT_REFRESH_SECRET = [genera con: openssl rand -base64 32]

# Server
PORT = 3000
NODE_ENV = production

# CORS
FRONTEND_URL = https://tu-frontend.vercel.app
CLIENT_URL = https://tu-frontend.vercel.app
```

### **Frontend (Vercel)**

En tu proyecto de Vercel, ve a **Settings → Environment Variables**:

```bash
VITE_API_URL = https://tu-backend.onrender.com/api
```

---

## 📦 MIGRACIÓN DE DATOS

### **Opción 1: Exportar e Importar (Recomendado)**

#### **1. Exportar tu base de datos local:**

```bash
cd /Users/mac/Documents/GDI/server

# Exportar
pg_dump gdi_development > backups/gdi_backup.sql

# O usar el script
./scripts/export-db.sh
```

#### **2. Importar a Render:**

```bash
# Obtén la External Database URL de Render
# Ejemplo: postgresql://user:pass@dpg-xxx-a.oregon-postgres.render.com/db_xxx

# Importar
psql "postgresql://user:pass@dpg-xxx-a.oregon-postgres.render.com/db_xxx" < backups/gdi_backup.sql
```

### **Opción 2: Usar Seed de Producción**

Si prefieres empezar con datos de prueba:

```bash
# En Render, después del deploy, ejecuta en la consola:
npm run prisma:seed
```

O manualmente:

```bash
# Conecta a tu servicio en Render Shell
node prisma/seed-production.js
```

---

## ✅ VERIFICACIÓN

### **1. Verifica el Backend:**

```bash
# Health check
curl https://tu-backend.onrender.com/api/health

# Debería retornar:
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-13T..."
}
```

### **2. Verifica la Base de Datos:**

```bash
# En Render Shell de tu backend:
npx prisma studio

# O verifica las migraciones:
npx prisma migrate status
```

### **3. Verifica el Frontend:**

1. Abre tu URL de Vercel: `https://tu-frontend.vercel.app`
2. Intenta hacer login con:
   - Email: `superadmin@gdi.com`
   - Password: `password123`

---

## 🔐 CREDENCIALES DE PRUEBA

Después del seed, puedes usar:

```
Super Admin:
Email: superadmin@gdi.com
Password: password123

Admin Empresa 1:
Email: admin1@empresa1.com
Password: password123

Usuario Regular:
Email: juan.perez@empresa1.com
Password: password123
```

---

## 🐛 TROUBLESHOOTING

### **Error: "Application failed to respond"**

**Causa:** El backend no está respondiendo

**Solución:**
1. Verifica los logs en Render Dashboard
2. Asegúrate de que `DATABASE_URL` esté configurada
3. Verifica que las migraciones se ejecutaron: `npx prisma migrate status`

### **Error: "CORS policy"**

**Causa:** El frontend no puede conectarse al backend

**Solución:**
1. Verifica que `FRONTEND_URL` en Render incluya tu URL de Vercel
2. Asegúrate de que no haya espacios en la URL
3. Redeploy el backend después de cambiar variables

### **Error: "Cannot connect to database"**

**Causa:** URL de base de datos incorrecta

**Solución:**
1. Usa la **Internal Database URL** (no External) en Render
2. Verifica que backend y DB estén en la misma región
3. Copia la URL completa sin espacios

### **Frontend muestra "Network Error"**

**Causa:** `VITE_API_URL` incorrecta

**Solución:**
1. Verifica que la URL termine en `/api`
2. Asegúrate de usar `https://` (no `http://`)
3. Redeploy el frontend después de cambiar variables

### **El servicio se "duerme"**

**Causa:** Plan gratuito de Render

**Solución:**
- El primer request después de 15 min de inactividad tardará ~30 segundos
- Considera usar un servicio de "ping" como UptimeRobot (gratis)
- O actualiza a plan pagado ($7/mes)

---

## 📊 MONITOREO

### **Render:**
- Dashboard: https://dashboard.render.com
- Logs en tiempo real
- Métricas de uso

### **Vercel:**
- Dashboard: https://vercel.com/dashboard
- Analytics
- Logs de deploy

---

## 🔄 ACTUALIZACIONES

### **Backend:**

```bash
# 1. Haz cambios en tu código local
git add .
git commit -m "Update backend"
git push origin main

# 2. Render auto-deploya automáticamente
```

### **Frontend:**

```bash
# 1. Haz cambios en tu código local
git add .
git commit -m "Update frontend"
git push origin main

# 2. Vercel auto-deploya automáticamente
```

---

## 💰 COSTOS

### **Plan Gratuito:**
- ✅ Render Web Service: GRATIS (750 horas/mes)
- ✅ Render PostgreSQL: GRATIS (90 días, luego $7/mes)
- ✅ Vercel: GRATIS (100 GB bandwidth/mes)

### **Total Mensual:**
- **Primeros 90 días:** $0
- **Después:** $7/mes (solo PostgreSQL)

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Deploy completado
2. ⏭️ Configura dominio personalizado (opcional)
3. ⏭️ Configura SSL (automático en Render y Vercel)
4. ⏭️ Configura backups automáticos
5. ⏭️ Configura monitoreo con UptimeRobot

---

## 📞 SOPORTE

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## ✨ RESUMEN RÁPIDO

```bash
# 1. Sube código a GitHub
git push origin main

# 2. Crea PostgreSQL en Render
# 3. Crea Web Service en Render (backend)
# 4. Configura variables de entorno en Render
# 5. Importa proyecto en Vercel (frontend)
# 6. Configura VITE_API_URL en Vercel
# 7. Importa datos a PostgreSQL
# 8. ¡Listo! 🎉
```

---

**URLs Finales:**
- 🌐 Frontend: `https://tu-app.vercel.app`
- 🔧 Backend: `https://tu-backend.onrender.com`
- 📚 API Docs: `https://tu-backend.onrender.com/api-docs`

---

**¡Deploy completado exitosamente!** 🚀
