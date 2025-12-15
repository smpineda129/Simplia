# Documentación del Sistema GDI

Bienvenido a la documentación del Sistema de Gestión Documental Integral (GDI).

## 📚 Índice de Documentación

### Para Desarrolladores

1. **[Guía del Desarrollador](./DEVELOPER_GUIDE.md)** ⭐ **INICIO AQUÍ**
   - Guía completa para nuevos desarrolladores
   - Configuración del entorno
   - Estructura del proyecto
   - Módulos del sistema
   - Flujos de trabajo
   - Mejores prácticas
   - **Recomendado para desarrolladores que se incorporan al proyecto**

2. **[Referencia de API](./api-reference.md)**
   - Referencia rápida de todos los endpoints
   - Ejemplos de uso
   - Códigos de estado HTTP
   - Autenticación
   - Estructura de respuestas

3. **[Arquitectura](./architecture.md)**
   - Visión general de la arquitectura
   - Patrones de diseño
   - Stack tecnológico
   - Decisiones de arquitectura
   - Diagramas del sistema

4. **[Guía de Módulos](./modules.md)**
   - Cómo crear nuevos módulos
   - Estructura de módulos
   - Ejemplos paso a paso
   - Checklist de desarrollo

### Para Configuración

5. **[Configuración de Base de Datos](./database-setup.md)**
   - Configuración de PostgreSQL
   - Conexión a BD externa
   - Migraciones
   - Troubleshooting

6. **[Configuración Inicial](./setup.md)**
   - Instalación paso a paso
   - Variables de entorno
   - Comandos útiles
   - Verificación de instalación

## 🚀 Inicio Rápido

### Para Desarrolladores Backend/Frontend

```bash
# 1. Clonar e instalar
git clone <repository-url>
cd GDI
npm run install:all

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 3. Configurar base de datos
npm run prisma:migrate

# 4. Ejecutar en desarrollo
npm run dev
```

**Luego lee**: [Guía del Desarrollador](./DEVELOPER_GUIDE.md)

### Para Probar la API

1. Inicia el servidor: `npm run dev:server`
2. Visita Swagger UI: `http://localhost:5000/api-docs`
3. Prueba los endpoints directamente desde Swagger

## 📖 Documentación por Rol

### Nuevo Desarrollador Backend

1. ✅ Lee [Guía del Desarrollador](./DEVELOPER_GUIDE.md) - Secciones: Introducción, Stack Tecnológico, Desarrollo Backend
2. ✅ Revisa [Arquitectura](./architecture.md) - Sección: Backend
3. ✅ Consulta [Guía de Módulos](./modules.md) - Para crear nuevos módulos
4. ✅ Explora [Referencia de API](./api-reference.md) - Para entender los endpoints
5. ✅ Usa Swagger UI para probar: `http://localhost:5000/api-docs`

### Nuevo Desarrollador Frontend

1. ✅ Lee [Guía del Desarrollador](./DEVELOPER_GUIDE.md) - Secciones: Introducción, Stack Tecnológico, Desarrollo Frontend
2. ✅ Revisa [Arquitectura](./architecture.md) - Sección: Frontend
3. ✅ Consulta [Guía de Módulos](./modules.md) - Para crear nuevos módulos
4. ✅ Revisa [Referencia de API](./api-reference.md) - Para consumir la API

### DevOps / Configuración

1. ✅ [Configuración Inicial](./setup.md)
2. ✅ [Configuración de Base de Datos](./database-setup.md)
3. ✅ [Arquitectura](./architecture.md) - Sección: Despliegue

## 🏗️ Arquitectura del Sistema

GDI es un monolito fullstack con:

- **Frontend**: React 18 + Vite + Material-UI + Tailwind CSS
- **Backend**: Node.js + Express + Prisma ORM
- **Base de Datos**: PostgreSQL 14+
- **Autenticación**: JWT con refresh tokens
- **Documentación**: Swagger/OpenAPI 3.0

### Módulos Principales

1. **Autenticación** - Sistema JWT completo
2. **Usuarios** - Gestión con roles y permisos
3. **Empresas** - Multi-tenancy
4. **Áreas** - Departamentos organizacionales
5. **Correspondencia** - Radicados automáticos
6. **Documentos** - Gestión documental
7. **Plantillas** - Templates dinámicos
8. **Expedientes** - Gestión de expedientes
9. **Retenciones** - Tablas de Retención Documental (TRD)
10. **Entidades** - Entidades externas
11. **Bodegas** - Ubicaciones físicas
12. **Roles y Permisos** - RBAC completo

## 🔗 Enlaces Rápidos

### Documentación Interactiva

- **Swagger UI**: `http://localhost:5000/api-docs`
- **Prisma Studio**: `npm run prisma:studio`

### Repositorio

- **GitHub**: [URL del repositorio]
- **Issues**: [URL de issues]
- **Wiki**: [URL de wiki]

## 📝 Convenciones

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar módulo de reportes
fix: corregir validación de email
docs: actualizar guía de API
refactor: mejorar servicio de usuarios
test: agregar tests de correspondencia
```

### Branches

- `main` - Producción
- `develop` - Desarrollo
- `feature/nombre` - Nuevas características
- `fix/nombre` - Correcciones
- `docs/nombre` - Documentación

### Código

- **Backend**: Seguir patrones en [Guía de Módulos](./modules.md)
- **Frontend**: Componentes funcionales con hooks
- **Tests**: Escribir tests para funcionalidad crítica
- **Documentación**: Documentar funciones complejas

## 🆘 Soporte

### Problemas Comunes

1. **Error de conexión a BD**: Ver [database-setup.md](./database-setup.md)
2. **Error de autenticación**: Ver [api-reference.md](./api-reference.md#autenticación)
3. **Error en migraciones**: Ver [database-setup.md](./database-setup.md#troubleshooting)

### Recursos

- **Swagger UI**: Documentación interactiva completa
- **Logs del servidor**: `cd server && npm run dev`
- **Prisma Studio**: Visualización de datos
- **Documentación de Prisma**: https://www.prisma.io/docs

### Contacto

Para preguntas o problemas:

1. Revisa esta documentación
2. Consulta Swagger UI
3. Revisa los logs
4. Contacta al equipo de desarrollo

## 📊 Estado del Proyecto

### Módulos Implementados

- ✅ Autenticación (Auth)
- ✅ Usuarios (Users)
- ✅ Empresas (Companies)
- ✅ Áreas (Areas)
- ✅ Correspondencia (Correspondences)
- ✅ Documentos (Documents)
- ✅ Plantillas (Templates)
- ✅ Expedientes (Proceedings)
- ✅ Retenciones (Retentions)
- ✅ Entidades (Entities)
- ✅ Bodegas (Warehouses)
- ✅ Roles (Roles)
- ✅ Permisos (Permissions)
- ✅ Tipos de Correspondencia (Correspondence Types)

### Características Técnicas

- ✅ API RESTful completa
- ✅ Autenticación JWT
- ✅ Sistema RBAC
- ✅ Multi-tenancy
- ✅ Paginación
- ✅ Búsqueda y filtros
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Documentación Swagger
- ✅ Tests automatizados

## 🔄 Actualizaciones

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0

### Changelog

- **v1.0.0** (Diciembre 2024)
  - Sistema completo de gestión documental
  - 14 módulos implementados
  - Documentación completa
  - Swagger UI integrado
  - Sistema RBAC
  - Multi-tenancy

---

**¿Nuevo en el proyecto?** Comienza con la [Guía del Desarrollador](./DEVELOPER_GUIDE.md) 🚀
