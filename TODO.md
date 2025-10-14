# ✅ TODO - Sistema GDI DOCU

**Última actualización:** 2025-10-11  
**Progreso General:** 46% (6 de 13 módulos)

---

## 🎯 PRIORIDAD ALTA (Core del Sistema)

### 1. Módulo: Correspondences 🔴
**Complejidad:** Alta | **Tiempo estimado:** 3-4 horas

- [ ] Crear modelo Correspondence en Prisma
- [ ] Crear modelo CorrespondenceThread en Prisma
- [ ] Backend: Service completo
  - [ ] Generar radicados automáticos
  - [ ] CRUD de correspondencias
  - [ ] Gestión de hilos
  - [ ] Cambio de estados
  - [ ] Usar templates para respuestas
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Lista de correspondencias
- [ ] Frontend: Vista detallada
- [ ] Frontend: Hilos de conversación
- [ ] Frontend: Selector de templates
- [ ] Frontend: Responder correspondencia
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

**Dependencias:** Templates (✅ Completado)

---

### 2. Módulo: Documents 🔴
**Complejidad:** Alta | **Tiempo estimado:** 2-3 horas

- [ ] Crear modelo Document en Prisma
- [ ] Backend: Service completo
  - [ ] Carga de archivos (multer)
  - [ ] CRUD de documentos
  - [ ] Adjuntar a expedientes
  - [ ] Metadatos
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Uploader de archivos
- [ ] Frontend: Lista de documentos
- [ ] Frontend: Vista previa
- [ ] Frontend: Adjuntar a expedientes
- [ ] Integración con AWS S3 (opcional)
- [ ] Integración con AWS Textract (opcional)
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

**Dependencias:** Proceedings (✅ Completado)

---

## 🎯 PRIORIDAD MEDIA (Complementarios)

### 3. Módulo: Entities 🟡
**Complejidad:** Baja | **Tiempo estimado:** 1 hora

- [ ] Crear modelo EntityCategory en Prisma
- [ ] Crear modelo Entity en Prisma
- [ ] Backend: Service completo
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Lista de entidades
- [ ] Frontend: Categorías
- [ ] Frontend: Información clave/valor
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

---

### 4. Módulo: Warehouses & Boxes 🟡
**Complejidad:** Media | **Tiempo estimado:** 2 horas

- [ ] Crear modelo Warehouse en Prisma
- [ ] Crear modelo Box en Prisma
- [ ] Backend: Service completo
  - [ ] CRUD de bodegas
  - [ ] CRUD de cajas
  - [ ] Ubicación (isla, estantería, estante)
  - [ ] Vincular con expedientes
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Lista de bodegas
- [ ] Frontend: Lista de cajas
- [ ] Frontend: Ubicación detallada
- [ ] Frontend: Vincular expedientes
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

---

## 🎯 PRIORIDAD BAJA (Opcionales)

### 5. Módulo: Forms 🟢
**Complejidad:** Media | **Tiempo estimado:** 2 horas

- [ ] Crear modelo Form en Prisma
- [ ] Crear modelo FormField en Prisma
- [ ] Crear modelo FormSubmission en Prisma
- [ ] Backend: Service completo
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Constructor de formularios
- [ ] Frontend: Vista de formulario
- [ ] Frontend: Submissions
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

---

### 6. Módulo: External Users 🟢
**Complejidad:** Media | **Tiempo estimado:** 2 horas

- [ ] Crear modelo ExternalUser en Prisma
- [ ] Backend: Service completo
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Portal externo
- [ ] Frontend: Compartir expedientes
- [ ] Frontend: Permisos de visualización
- [ ] Integrar en sidebar
- [ ] Documentación del módulo

---

### 7. Módulo: Roles & Permissions 🟢
**Complejidad:** Alta | **Tiempo estimado:** 3 horas

- [ ] Crear modelo Permission en Prisma
- [ ] Crear modelo Role en Prisma
- [ ] Crear modelo RolePermission en Prisma
- [ ] Backend: Service completo
- [ ] Backend: Middleware de permisos
- [ ] Backend: Controller y Routes
- [ ] Backend: Validaciones
- [ ] Frontend: Gestión de roles
- [ ] Frontend: Asignación de permisos
- [ ] Frontend: Nivel de rol
- [ ] Integrar en todos los módulos
- [ ] Documentación del módulo

---

## 🔧 MEJORAS Y OPTIMIZACIONES

### Testing
- [ ] Configurar Jest para backend
- [ ] Tests unitarios de services
- [ ] Tests de integración de API
- [ ] Configurar React Testing Library
- [ ] Tests de componentes
- [ ] Tests E2E con Playwright
- [ ] Configurar coverage

### Infraestructura
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Dockerfile para backend
- [ ] Dockerfile para frontend
- [ ] Docker Compose completo
- [ ] Scripts de deployment
- [ ] Configurar AWS RDS
- [ ] Configurar AWS S3
- [ ] Configurar AWS Textract

### Seguridad
- [ ] Rate limiting
- [ ] CORS configuración
- [ ] Helmet.js
- [ ] Sanitización de inputs
- [ ] Logs de auditoría
- [ ] Encriptación de datos sensibles

### Performance
- [ ] Caché con Redis
- [ ] Optimización de queries
- [ ] Lazy loading en frontend
- [ ] Code splitting
- [ ] Compresión de assets
- [ ] CDN para archivos estáticos

### Monitoreo
- [ ] Integración con Sentry
- [ ] Logs centralizados
- [ ] Métricas de performance
- [ ] Alertas automáticas
- [ ] Dashboard de monitoreo

---

## 📊 MEJORAS DE MÓDULOS EXISTENTES

### Companies
- [ ] Vista detallada de empresa
- [ ] Gestión de suscripción Stripe
- [ ] Límite de usuarios activo
- [ ] Estadísticas por empresa

### Areas
- [ ] Vista detallada con usuarios
- [ ] Asignación masiva de usuarios
- [ ] Jerarquía de áreas (sub-áreas)
- [ ] Exportar a Excel

### Retentions
- [ ] Frontend para gestión de líneas
- [ ] Vista detallada con líneas
- [ ] Importar líneas desde Excel
- [ ] Exportar TRD a PDF
- [ ] Validación de duplicados

### Correspondence Types
- [ ] Estadísticas de uso
- [ ] Plantillas por defecto
- [ ] Workflow personalizado

### Templates
- [ ] Editor WYSIWYG (rich text)
- [ ] Vista previa en tiempo real
- [ ] Más helpers (empresa, área, etc.)
- [ ] Versionado de plantillas
- [ ] Plantillas compartidas

### Proceedings
- [ ] Vista detallada con documentos
- [ ] Adjuntar documentos
- [ ] Adjuntar entidades
- [ ] Sistema de préstamos
- [ ] Compartir con externos
- [ ] Historial de cambios

---

## 🎨 UI/UX

### Dashboard
- [ ] Estadísticas reales
- [ ] Gráficos con Recharts
- [ ] Widgets personalizables
- [ ] Filtros por fecha
- [ ] Exportar reportes

### General
- [ ] Tema oscuro
- [ ] Personalización de colores
- [ ] Accesibilidad (WCAG)
- [ ] Internacionalización (i18n)
- [ ] Mejoras de responsive
- [ ] Animaciones
- [ ] Skeleton loaders

---

## 📚 DOCUMENTACIÓN

### Técnica
- [ ] Swagger/OpenAPI completo
- [ ] Diagramas de arquitectura
- [ ] Diagramas de flujo
- [ ] Guía de contribución
- [ ] Guía de estilo de código

### Usuario
- [ ] Manual de usuario
- [ ] Videos tutoriales
- [ ] FAQ
- [ ] Casos de uso
- [ ] Mejores prácticas

---

## 🐛 BUGS CONOCIDOS

- [ ] Ninguno reportado (Primera versión)

---

## 💡 IDEAS FUTURAS

### Funcionalidades
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Chat interno entre usuarios
- [ ] Firma digital de documentos
- [ ] Workflow de aprobaciones
- [ ] Calendario de vencimientos
- [ ] Recordatorios automáticos
- [ ] Integración con email (SMTP)
- [ ] Integración con escáner
- [ ] App móvil (React Native)

### Integraciones
- [ ] Google Drive
- [ ] Dropbox
- [ ] OneDrive
- [ ] Slack
- [ ] Microsoft Teams
- [ ] Zapier

---

## 📅 ROADMAP

### v1.1.0 (Próxima versión)
- Correspondences
- Documents
- Tests básicos

### v1.2.0
- Entities
- Warehouses & Boxes
- CI/CD

### v1.3.0
- Forms
- External Users
- Roles & Permissions

### v2.0.0
- Notificaciones en tiempo real
- App móvil
- Integraciones externas

---

## 🎯 MÉTRICAS DE PROGRESO

### Módulos
- ✅ Completados: 6 de 13 (46%)
- 🔄 En progreso: 0
- ⏳ Pendientes: 7 (54%)

### Testing
- ✅ Completado: 0%
- 🎯 Objetivo: 80% coverage

### Documentación
- ✅ Completado: 100% (módulos actuales)
- 🎯 Objetivo: 100% (todos los módulos)

### Performance
- ✅ Optimizado: 60%
- 🎯 Objetivo: 90%

---

## 📝 NOTAS

### Prioridades Actuales
1. Completar módulo de Correspondences
2. Completar módulo de Documents
3. Agregar tests básicos
4. Conectar a AWS

### Decisiones Pendientes
- [ ] Definir estrategia de deployment
- [ ] Seleccionar proveedor de hosting
- [ ] Definir plan de backup
- [ ] Establecer SLA

---

**Última revisión:** 2025-10-11  
**Próxima revisión:** Después de implementar Correspondences

---

## 🚀 INICIO RÁPIDO PARA DESARROLLO

```bash
# 1. Ver estado actual
cat PROJECT_STATUS.md

# 2. Ver siguiente tarea
# Revisar sección "PRIORIDAD ALTA" de este archivo

# 3. Crear rama para nueva feature
git checkout -b feature/correspondences

# 4. Desarrollar módulo
# Seguir patrón de módulos existentes

# 5. Actualizar documentación
# Crear [MODULO]_MODULE_COMPLETE.md

# 6. Actualizar este TODO
# Marcar tareas completadas

# 7. Actualizar CHANGELOG
# Agregar cambios a CHANGELOG.md
```

---

**¡Mantén este archivo actualizado!** ✅
