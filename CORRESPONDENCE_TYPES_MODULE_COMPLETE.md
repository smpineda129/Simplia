# ✅ Módulo de Correspondence Types (Tipos de Correspondencia) - Completado

## 📦 Archivos Creados

### Backend (Server)
- ✅ `/server/src/modules/correspondence-types/correspondenceType.service.js`
- ✅ `/server/src/modules/correspondence-types/correspondenceType.controller.js`
- ✅ `/server/src/modules/correspondence-types/correspondenceType.validation.js`
- ✅ `/server/src/modules/correspondence-types/correspondenceType.routes.js`

### Frontend (Client)
- ✅ `/client/src/modules/correspondence-types/services/correspondenceTypeService.js`
- ✅ `/client/src/modules/correspondence-types/schemas/correspondenceTypeSchema.js`
- ✅ `/client/src/modules/correspondence-types/pages/CorrespondenceTypeList.jsx`
- ✅ `/client/src/modules/correspondence-types/components/CorrespondenceTypeTable.jsx`
- ✅ `/client/src/modules/correspondence-types/components/CorrespondenceTypeModalForm.jsx`
- ✅ `/client/src/modules/correspondence-types/index.jsx`

---

## 🎯 Características Implementadas

### Backend
- ✅ CRUD completo
- ✅ Soft delete
- ✅ Paginación y búsqueda
- ✅ Filtro por empresa
- ✅ Filtro por área (opcional)
- ✅ Filtro por visibilidad (público/privado)
- ✅ Relación con empresas y áreas
- ✅ Campo de expiración en días
- ✅ Campo público (para portal externo)

### Frontend
- ✅ Lista con tabla Material UI
- ✅ Búsqueda en tiempo real
- ✅ Filtro por empresa
- ✅ Modal para crear/editar
- ✅ Selector de área (opcional, cascada)
- ✅ Checkbox para marcar como público
- ✅ Campo de expiración
- ✅ Indicadores visuales (público/privado)
- ✅ Integrado en sidebar

---

## 📊 Modelo de Datos

```prisma
model CorrespondenceType {
  id          Int       @id @default(autoincrement())
  name        String    @db.VarChar(255)
  companyId   Int
  description String?   @db.VarChar(255)
  expiration  Int?      // Días hasta expiración
  areaId      Int?      // Opcional: área específica
  public      Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  company     Company   @relation(fields: [companyId], references: [id])
  area        Area?     @relation(fields: [areaId], references: [id])
}
```

---

## 🚀 Cómo Usar

### 1. Acceder al Módulo
- URL: http://localhost:5173/correspondence-types

### 2. Crear Tipo de Correspondencia
1. Click en "Nuevo Tipo"
2. Seleccionar empresa
3. (Opcional) Seleccionar área específica
4. Ingresar nombre y descripción
5. (Opcional) Definir días de expiración
6. Marcar como público si debe aparecer en portal externo
7. Guardar

---

## 📝 Conceptos Clave

### Tipos de Correspondencia
Define las categorías de correspondencia que maneja la empresa:
- Solicitudes
- Quejas
- Reclamos
- Peticiones
- Consultas
- Etc.

### Expiración
Días hasta que el documento expire y requiera acción.

### Público vs Privado
- **Público**: Visible en el portal de correspondencias externo
- **Privado**: Solo para uso interno

### Área Específica
- Si se asigna un área, el tipo solo aplica a esa área
- Si no se asigna, aplica a todas las áreas de la empresa

---

## 🧪 Testing

```bash
# Crear tipo de correspondencia
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Solicitud de Información",
    "description": "Solicitudes de información pública",
    "companyId": 1,
    "expiration": 15,
    "public": true
  }' \
  http://localhost:3000/api/correspondence-types
```

---

## 📋 Progreso del Sistema

### ✅ Completados:
1. **Companies** - Gestión de empresas
2. **Areas** - Áreas/Departamentos
3. **Retentions** - Tablas de retención
4. **Correspondence Types** - Tipos de correspondencia

### 🔲 Siguientes Módulos:
5. **Correspondences** - Gestión de correspondencia
6. **Templates** - Plantillas con helpers
7. **Proceedings** - Expedientes
8. **Documents** - Documentos con OCR

---

## 🎉 Estado: COMPLETADO

**Última actualización:** 2025-10-11
