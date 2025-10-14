# ✅ Módulo de Templates (Plantillas con Helpers) - Completado

## 📦 Archivos Creados

### Backend (Server)
- ✅ `/server/src/modules/templates/template.service.js`
- ✅ `/server/src/modules/templates/template.controller.js`
- ✅ `/server/src/modules/templates/template.validation.js`
- ✅ `/server/src/modules/templates/template.routes.js`

### Frontend (Client)
- ✅ `/client/src/modules/templates/services/templateService.js`
- ✅ `/client/src/modules/templates/schemas/templateSchema.js`
- ✅ `/client/src/modules/templates/pages/TemplateList.jsx`
- ✅ `/client/src/modules/templates/components/TemplateTable.jsx`
- ✅ `/client/src/modules/templates/components/TemplateModalForm.jsx`
- ✅ `/client/src/modules/templates/index.jsx`

---

## 🎯 Características Implementadas

### Backend
- ✅ CRUD completo
- ✅ Sistema de helpers dinámicos
- ✅ Endpoint para obtener helpers disponibles
- ✅ Endpoint para procesar plantilla con datos reales
- ✅ Reemplazo automático de variables
- ✅ Soft delete

### Frontend
- ✅ Lista con tabla Material UI
- ✅ Editor de plantillas con helpers
- ✅ **Accordion con helpers disponibles** (click para insertar)
- ✅ Vista previa del contenido
- ✅ Búsqueda y filtros
- ✅ Validaciones con Yup
- ✅ Integrado en sidebar

---

## 📊 Modelo de Datos

```prisma
model Template {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  description String?   @db.VarChar(255)
  content     String    @db.Text
  companyId   Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  company     Company   @relation(fields: [companyId], references: [id])
}
```

---

## 🔧 Helpers Disponibles

### **Generales de Fecha**
- `{dia}` - Día actual
- `{mes}` - Mes actual
- `{ano}` - Año actual
- `{fecha}` - Fecha completa

### **Del Destinatario**
- `{nombre}` - Nombre del destinatario
- `{apellido}` - Apellido del destinatario
- `{dni}` - DNI/CC del destinatario
- `{correo}` - Correo del destinatario

### **De la Correspondencia**
- `{radicado_entrada}` - Radicado de entrada
- `{radicado_salida}` - Radicado de salida

### **Del Usuario Activo**
- `{firma}` - Firma del usuario
- `{mi_nombre}` - Nombre del usuario activo
- `{mi_correo}` - Correo del usuario activo
- `{mi_cargo}` - Cargo del usuario activo

---

## 🚀 Cómo Usar

### 1. Crear Plantilla
1. Click en "Nueva Plantilla"
2. Seleccionar empresa
3. Ingresar título y descripción
4. Expandir "Helpers Disponibles"
5. Click en los helpers para insertarlos en el contenido
6. Escribir el contenido de la plantilla
7. Guardar

### 2. Ejemplo de Plantilla

```
Estimado/a {nombre} {apellido}:

Por medio de la presente, damos respuesta a su comunicación con radicado {radicado_entrada}, recibida el {fecha}.

[Contenido de la respuesta]

Atentamente,

{mi_nombre}
{mi_cargo}
{mi_correo}

{firma}
```

### 3. Procesar Plantilla (API)

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destinatario": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "dni": "12345678",
      "correo": "juan@example.com"
    },
    "correspondencia": {
      "radicadoEntrada": "2025-001",
      "radicadoSalida": "2025-002"
    },
    "usuario": {
      "nombre": "María García",
      "cargo": "Jefe de Área",
      "correo": "maria@empresa.com",
      "firma": "[Firma Digital]"
    }
  }' \
  http://localhost:3000/api/templates/1/process
```

---

## 💡 Casos de Uso

### 1. Respuestas de Correspondencia
- Acuse de recibo
- Respuesta a solicitudes
- Respuesta a quejas
- Respuesta a reclamos

### 2. Notificaciones
- Notificación de vencimiento
- Recordatorios
- Alertas

### 3. Documentos Formales
- Oficios
- Circulares
- Comunicados internos

---

## 🧪 Testing

```bash
# Crear plantilla
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Acuse de Recibo",
    "description": "Plantilla para acusar recibo de correspondencia",
    "companyId": 1,
    "content": "Estimado/a {nombre}:\n\nAcusamos recibo de su comunicación radicada con el número {radicado_entrada} del {fecha}.\n\nAtentamente,\n{mi_nombre}"
  }' \
  http://localhost:3000/api/templates

# Obtener helpers disponibles
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/templates/helpers
```

---

## 📋 Progreso del Sistema

### ✅ **5 Módulos Completados:**
1. ✅ **Companies** - Multi-tenant
2. ✅ **Areas** - Departamentos
3. ✅ **Retentions** - Tablas de retención
4. ✅ **Correspondence Types** - Tipos de correspondencia
5. ✅ **Templates** - Plantillas con helpers dinámicos

### 🔲 **Siguientes Módulos:**
6. **Correspondences** - Gestión de correspondencia (usa templates)
7. **Proceedings** - Expedientes
8. **Documents** - Documentos con OCR

---

## 🎨 Características Destacadas

### Editor de Plantillas
- ✅ Accordion con helpers organizados por categoría
- ✅ Click en helper para insertar en el contenido
- ✅ Tooltip con descripción de cada helper
- ✅ Editor de texto multilínea (12 filas)

### Procesamiento Dinámico
- ✅ Reemplazo automático de variables
- ✅ Soporte para datos opcionales
- ✅ Formato de fechas en español
- ✅ API endpoint para procesamiento

---

## 📝 Próximos Pasos

### Mejoras Sugeridas:
1. ⬜ Editor WYSIWYG (rich text)
2. ⬜ Vista previa en tiempo real
3. ⬜ Más helpers (empresa, área, etc.)
4. ⬜ Versionado de plantillas
5. ⬜ Plantillas compartidas entre empresas
6. ⬜ Exportar a PDF
7. ⬜ Tests unitarios

### Siguiente Módulo:
- **Correspondences** - Usará estas plantillas para respuestas

---

## 🎉 Estado: COMPLETADO

El módulo de Templates está **100% funcional** con sistema de helpers dinámicos.

**Última actualización:** 2025-10-11
