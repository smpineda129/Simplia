# ✅ Módulo de Retentions (Tablas de Retención) - Completado

## 📦 Archivos Creados

### Backend (Server)

#### **Services**
- ✅ `/server/src/modules/retentions/retention.service.js`
  - `getAll()` - Listar tablas de retención con filtros
  - `getById()` - Obtener tabla con líneas de retención
  - `create()` - Crear nueva tabla de retención
  - `update()` - Actualizar tabla
  - `delete()` - Eliminar tabla (soft delete)
  - `createLine()` - Crear línea de retención
  - `updateLine()` - Actualizar línea
  - `deleteLine()` - Eliminar línea

#### **Controllers**
- ✅ `/server/src/modules/retentions/retention.controller.js`
  - Manejo de requests/responses
  - Endpoints para tablas y líneas

#### **Validations**
- ✅ `/server/src/modules/retentions/retention.validation.js`
  - `createRetentionValidation`
  - `updateRetentionValidation`
  - `createRetentionLineValidation`
  - `updateRetentionLineValidation`

#### **Routes**
- ✅ `/server/src/modules/retentions/retention.routes.js`
  - GET `/api/retentions` - Listar tablas
  - GET `/api/retentions/:id` - Obtener tabla
  - POST `/api/retentions` - Crear tabla
  - PUT `/api/retentions/:id` - Actualizar tabla
  - DELETE `/api/retentions/:id` - Eliminar tabla
  - POST `/api/retentions/:id/lines` - Crear línea
  - PUT `/api/retentions/:id/lines/:lineId` - Actualizar línea
  - DELETE `/api/retentions/:id/lines/:lineId` - Eliminar línea

---

### Frontend (Client)

#### **Services**
- ✅ `/client/src/modules/retentions/services/retentionService.js`
  - Llamadas a API para tablas y líneas

#### **Schemas**
- ✅ `/client/src/modules/retentions/schemas/retentionSchema.js`
  - `retentionSchema` - Validación de tablas
  - `retentionLineSchema` - Validación de líneas

#### **Pages**
- ✅ `/client/src/modules/retentions/pages/RetentionList.jsx`
  - Lista de tablas de retención
  - Búsqueda
  - Filtro por empresa y área
  - Paginación
  - CRUD completo

#### **Components**
- ✅ `/client/src/modules/retentions/components/RetentionTable.jsx`
  - Tabla con Material UI
  - Muestra empresa, área, fecha
  - Contador de líneas de retención

- ✅ `/client/src/modules/retentions/components/RetentionModalForm.jsx`
  - Modal para crear/editar tablas
  - Selector de empresa y área (cascada)
  - Formulario con Formik + Yup

---

## 🎯 Características Implementadas

### Backend
- ✅ CRUD completo para tablas de retención
- ✅ CRUD completo para líneas de retención
- ✅ Soft delete
- ✅ Paginación
- ✅ Búsqueda por nombre o código
- ✅ Filtro por empresa y área
- ✅ Relación con empresas y áreas
- ✅ Validaciones robustas
- ✅ Documentación Swagger
- ✅ Autenticación JWT requerida

### Frontend
- ✅ Lista con tabla Material UI
- ✅ Búsqueda en tiempo real
- ✅ Filtro por empresa (dropdown)
- ✅ Filtro por área (cascada, depende de empresa)
- ✅ Paginación
- ✅ Modal para crear/editar
- ✅ Validaciones con Yup
- ✅ Notificaciones (Snackbar)
- ✅ Confirmación antes de eliminar
- ✅ Muestra empresa, área y contador de líneas
- ✅ Responsive design
- ✅ Integrado en sidebar

---

## 📊 Modelo de Datos

```prisma
model Retention {
  id        Int       @id @default(autoincrement())
  name      String    @db.VarChar(255)
  companyId Int
  areaId    Int
  code      String    @db.VarChar(255)
  date      DateTime  @db.Date
  comments  String?   @db.VarChar(255)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  company   Company   @relation(fields: [companyId], references: [id])
  area      Area      @relation(fields: [areaId], references: [id])
  retentionLines RetentionLine[]
}

model RetentionLine {
  id                 Int       @id @default(autoincrement())
  retentionId        Int
  series             String    @db.VarChar(255)
  subseries          String    @db.VarChar(255)
  documents          String?   @db.Text
  code               String    @db.VarChar(255)
  localRetention     Int       // Años en archivo local
  centralRetention   Int       // Años en archivo central
  dispositionCt      Boolean   // Conservación Total
  dispositionE       Boolean   // Eliminación
  dispositionM       Boolean   // Microfilmación
  dispositionD       Boolean   // Digitalización
  dispositionS       Boolean   // Selección
  comments           String?   @db.Text
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
  deletedAt          DateTime?

  retention          Retention @relation(fields: [retentionId], references: [id])
}
```

---

## 🚀 Cómo Usar

### 1. Acceder al Módulo
- URL: http://localhost:5173/retentions
- Requiere estar autenticado

### 2. Crear Tabla de Retención
1. Click en "Nueva Tabla de Retención"
2. Seleccionar empresa
3. Seleccionar área (se filtran por empresa)
4. Ingresar nombre, código, fecha y comentarios
5. Guardar

### 3. Filtrar Tablas
- Usar búsqueda por nombre o código
- Filtrar por empresa
- Filtrar por área (requiere seleccionar empresa primero)

### 4. Gestionar Líneas de Retención
- Las líneas se gestionan a través de la API
- Cada línea define: series, subseries, tiempos de retención y disposición final

---

## 🧪 Testing

### Probar Backend (cURL)

```bash
# Obtener todas las tablas
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/retentions

# Filtrar por empresa y área
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/retentions?companyId=1&areaId=1"

# Crear tabla de retención
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TRD Recursos Humanos 2025",
    "code": "TRD-RRHH-2025",
    "date": "2025-01-01",
    "companyId": 1,
    "areaId": 1,
    "comments": "Tabla de retención documental del área de RRHH"
  }' \
  http://localhost:3000/api/retentions

# Crear línea de retención
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "series": "Gestión Administrativa",
    "subseries": "Contratos Laborales",
    "code": "GA-CL-001",
    "documents": "Contratos de trabajo, anexos, modificaciones",
    "localRetention": 5,
    "centralRetention": 10,
    "dispositionCt": false,
    "dispositionE": false,
    "dispositionM": true,
    "dispositionD": true,
    "dispositionS": false,
    "comments": "Conservar en archivo central por 10 años, luego microfilmar y digitalizar"
  }' \
  http://localhost:3000/api/retentions/1/lines
```

---

## 📝 Conceptos Clave

### Tabla de Retención Documental (TRD)
Instrumento archivístico que establece los tiempos de permanencia de los documentos en cada fase del ciclo vital.

### Líneas de Retención
Cada línea define:
- **Series y Subseries**: Clasificación documental
- **Retención Local**: Años en el archivo de gestión
- **Retención Central**: Años en el archivo central
- **Disposición Final**: Qué hacer después (CT, E, M, D, S)

### Disposiciones Finales
- **CT (Conservación Total)**: Conservar permanentemente
- **E (Eliminación)**: Destruir el documento
- **M (Microfilmación)**: Convertir a microfilm
- **D (Digitalización)**: Convertir a digital
- **S (Selección)**: Seleccionar muestras representativas

---

## 🔗 Relaciones

### Con Empresas
- Cada tabla pertenece a **una empresa**

### Con Áreas
- Cada tabla pertenece a **un área**
- Filtro en cascada: primero empresa, luego área

### Con Líneas de Retención
- Una tabla puede tener **múltiples líneas**
- Cada línea define reglas específicas de retención

---

## 📋 Próximos Pasos

### Mejoras Sugeridas:
1. ⬜ Vista detallada de tabla con gestión de líneas
2. ⬜ Componente para crear/editar líneas desde la interfaz
3. ⬜ Exportar TRD a Excel/PDF
4. ⬜ Importar líneas desde Excel
5. ⬜ Validación de duplicados de código
6. ⬜ Historial de cambios
7. ⬜ Aprobación de TRD
8. ⬜ Tests unitarios e integración

### Siguiente Módulo:
- **Correspondences** (Gestión de Correspondencia)

---

## 🎉 Estado: COMPLETADO (Versión Base)

El módulo de Retentions está **funcional** con:
- ✅ CRUD de tablas de retención
- ✅ API completa para líneas de retención
- ⚠️ Frontend de líneas pendiente (se puede agregar después)

**Última actualización:** 2025-10-11
