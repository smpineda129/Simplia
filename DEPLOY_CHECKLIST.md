# ✅ CHECKLIST DE DEPLOY

## 📋 ANTES DE EMPEZAR

- [ ] Código subido a GitHub
- [ ] Cuenta de Render creada
- [ ] Cuenta de Vercel creada
- [ ] Base de datos local funcionando

---

## 🗄️ BASE DE DATOS (RENDER)

- [ ] PostgreSQL creado en Render
- [ ] Plan gratuito seleccionado
- [ ] Internal Database URL copiada
- [ ] Región: Oregon (US West)

---

## 🔧 BACKEND (RENDER)

- [ ] Web Service creado
- [ ] Repositorio conectado
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
- [ ] Start Command: `npm start`
- [ ] Plan gratuito seleccionado

### Variables de Entorno:

- [ ] `DATABASE_URL` = [Internal Database URL]
- [ ] `JWT_SECRET` = [generado con ./scripts/generate-secrets.sh]
- [ ] `JWT_REFRESH_SECRET` = [generado con ./scripts/generate-secrets.sh]
- [ ] `PORT` = 3000
- [ ] `NODE_ENV` = production
- [ ] `FRONTEND_URL` = [URL de Vercel]
- [ ] `CLIENT_URL` = [URL de Vercel]

### Verificación:

- [ ] Deploy exitoso (sin errores)
- [ ] Logs sin errores
- [ ] Health check funciona: `https://tu-backend.onrender.com/api/health`

---

## 🌐 FRONTEND (VERCEL)

- [ ] Proyecto importado desde GitHub
- [ ] Framework: Vite
- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Variables de Entorno:

- [ ] `VITE_API_URL` = `https://tu-backend.onrender.com/api`

### Verificación:

- [ ] Deploy exitoso
- [ ] Sitio carga correctamente
- [ ] No hay errores en consola del navegador

---

## 📦 MIGRACIÓN DE DATOS

Elige una opción:

### Opción A: Importar Base de Datos Existente

- [ ] Exportar DB local: `./scripts/export-db.sh`
- [ ] Importar a Render: `psql "[External URL]" < backups/gdi_backup.sql`
- [ ] Verificar datos en Render Shell: `npx prisma studio`

### Opción B: Usar Seed de Producción

- [ ] Conectar a Render Shell
- [ ] Ejecutar: `node prisma/seed-production.js`
- [ ] Verificar usuarios creados

---

## 🧪 PRUEBAS

- [ ] Abrir frontend en Vercel
- [ ] Login con `superadmin@gdi.com` / `password123`
- [ ] Navegar por módulos
- [ ] Crear un registro de prueba
- [ ] Verificar que se guarda en la BD

---

## 🔄 CONFIGURACIÓN FINAL

- [ ] Actualizar `FRONTEND_URL` en Render con URL final de Vercel
- [ ] Redeploy backend si fue necesario
- [ ] Verificar CORS funcionando
- [ ] Probar desde diferentes navegadores

---

## 📝 DOCUMENTACIÓN

- [ ] Guardar URLs en lugar seguro:
  - Frontend: `https://_____.vercel.app`
  - Backend: `https://_____.onrender.com`
  - API Docs: `https://_____.onrender.com/api-docs`
- [ ] Guardar credenciales de admin
- [ ] Compartir URLs con el equipo

---

## 🎉 ¡DEPLOY COMPLETADO!

**URLs Finales:**
- 🌐 App: ___________________
- 🔧 API: ___________________
- 📚 Docs: ___________________

**Credenciales:**
- 👤 Super Admin: superadmin@gdi.com / password123

---

**Fecha de Deploy:** _______________
**Realizado por:** _______________
