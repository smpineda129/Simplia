# Guía de Configuración Inicial

Esta guía te ayudará a configurar y ejecutar el proyecto GDI en tu entorno local.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** (v9 o superior)
- **PostgreSQL** (v14 o superior)
- **Git**

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd GDI
```

### 2. Instalar Dependencias

Instala todas las dependencias del proyecto (raíz, cliente y servidor):

```bash
npm run install:all
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gdi_db?schema=public"
JWT_SECRET="tu-clave-secreta-muy-segura"
JWT_REFRESH_SECRET="tu-clave-refresh-muy-segura"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 4. Configurar Base de Datos

#### Crear la base de datos en PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE gdi_db;

# Salir de psql
\q
```

#### Ejecutar migraciones de Prisma

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### (Opcional) Poblar con datos de prueba

```bash
npm run prisma:seed
```

Esto creará dos usuarios de prueba:
- **Admin**: admin@gdi.com / admin123
- **User**: user@gdi.com / user123

### 5. Ejecutar el Proyecto

#### Modo Desarrollo (Cliente + Servidor)

```bash
npm run dev
```

Esto ejecutará:
- **Cliente React**: http://localhost:5173
- **Servidor Express**: http://localhost:5000
- **Swagger Docs**: http://localhost:5000/api-docs

#### Ejecutar Solo el Cliente

```bash
npm run dev:client
```

#### Ejecutar Solo el Servidor

```bash
npm run dev:server
```

## Verificación de la Instalación

### 1. Verificar el Servidor

Abre tu navegador en http://localhost:5000 y deberías ver:

```json
{
  "message": "Bienvenido a GDI API",
  "documentation": "/api-docs",
  "version": "1.0.0"
}
```

### 2. Verificar Swagger

Visita http://localhost:5000/api-docs para ver la documentación interactiva de la API.

### 3. Verificar el Cliente

Abre http://localhost:5173 y deberías ver la página de login.

### 4. Probar el Login

Usa las credenciales de prueba:
- **Email**: admin@gdi.com
- **Password**: admin123

## Comandos Útiles

### Prisma

```bash
# Generar cliente Prisma
npm run prisma:generate

# Crear nueva migración
npm run prisma:migrate

# Abrir Prisma Studio (GUI para la DB)
npm run prisma:studio

# Ejecutar seed
npm run prisma:seed
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Tests del cliente
npm run test:client

# Tests del servidor
npm run test:server

# Tests con coverage
npm run test:coverage
```

### Build

```bash
# Build del cliente para producción
npm run build
```

## Solución de Problemas

### Error de conexión a PostgreSQL

- Verifica que PostgreSQL esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos `gdi_db` exista

### Puerto ya en uso

Si el puerto 5000 o 5173 está ocupado:

1. Cambia el puerto en `.env`
2. Actualiza `CLIENT_URL` si cambias el puerto del servidor

### Errores de Prisma

```bash
# Resetear la base de datos (¡CUIDADO: Borra todos los datos!)
cd server
npx prisma migrate reset
```

### Limpiar node_modules

```bash
# Eliminar todas las dependencias
rm -rf node_modules client/node_modules server/node_modules

# Reinstalar
npm run install:all
```

## Próximos Pasos

Una vez que tengas el proyecto funcionando:

1. Lee la [Arquitectura del Proyecto](./architecture.md)
2. Revisa la [Referencia de la API](./api-reference.md)
3. Explora la [Guía de Módulos](./modules.md)

## Soporte

Si encuentras problemas durante la instalación, revisa:

- La documentación de Prisma: https://www.prisma.io/docs
- La documentación de Vite: https://vitejs.dev
- La documentación de Express: https://expressjs.com
