# 🚀 DEPLOY RÁPIDO - 5 MINUTOS

## 1️⃣ PREPARACIÓN (1 min)

```bash
# Sube tu código a GitHub
cd /Users/mac/Documents/GDI
git add .
git commit -m "Ready for deploy"
git push origin main
```

## 2️⃣ BASE DE DATOS (1 min)

1. Ve a https://dashboard.render.com
2. **New +** → **PostgreSQL**
3. Name: `gdi-database`
4. Plan: **Free**
5. **Create Database**
6. Copia el **Internal Database URL**

## 3️⃣ BACKEND (2 min)

1. En Render: **New +** → **Web Service**
2. Conecta tu repo de GitHub
3. Configuración:
   - Name: `gdi-backend`
   - Root Directory: `server`
   - Build: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start: `npm start`
   - Plan: **Free**

4. **Environment Variables:**
   ```
   DATABASE_URL = [pega la URL de PostgreSQL]
   JWT_SECRET = [genera con: openssl rand -base64 32]
   JWT_REFRESH_SECRET = [genera con: openssl rand -base64 32]
   PORT = 3000
   NODE_ENV = production
   ```

5. **Create Web Service**
6. Espera 3-5 minutos al deploy
7. Copia tu URL: `https://gdi-backend-xxx.onrender.com`

## 4️⃣ FRONTEND (1 min)

1. Ve a https://vercel.com/new
2. Importa tu repo de GitHub
3. Configuración:
   - Root Directory: `client`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

4. **Environment Variable:**
   ```
   VITE_API_URL = https://tu-backend.onrender.com/api
   ```

5. **Deploy**
6. Copia tu URL: `https://gdi-frontend-xxx.vercel.app`

## 5️⃣ CONFIGURACIÓN FINAL (30 seg)

1. Vuelve a Render (backend)
2. Agrega estas variables:
   ```
   FRONTEND_URL = https://tu-frontend.vercel.app
   CLIENT_URL = https://tu-frontend.vercel.app
   ```
3. Guarda (auto-redeploy)

## 6️⃣ DATOS (30 seg)

En Render Shell (backend):
```bash
node prisma/seed-production.js
```

## ✅ ¡LISTO!

**Prueba tu app:**
- URL: `https://tu-frontend.vercel.app`
- Login: `superadmin@gdi.com` / `password123`

---

**⚠️ IMPORTANTE:**
- El plan gratuito de Render se duerme después de 15 min
- El primer request tardará ~30 segundos en despertar
- PostgreSQL gratis por 90 días, luego $7/mes

---

**📚 Documentación completa:** Ver `DEPLOY_GUIDE.md`
