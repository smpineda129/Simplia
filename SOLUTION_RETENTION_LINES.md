# 🔍 SOLUCIÓN: FOREIGN KEY CONSTRAINT VIOLATED

**Fecha:** 2025-10-12 13:09  
**Estado:** ⚠️ PROBLEMA IDENTIFICADO

---

## 🐛 PROBLEMA

```
Foreign key constraint violated: `proceedings_retention_line_id_fkey`
```

**Causa:** Estás intentando crear un Proceeding con `retentionLineId: 1`, pero **ese RetentionLine no existe** en la base de datos.

---

## 🔍 DIAGNÓSTICO

### **El Error Significa:**
El valor `retentionLineId` que envías en el request **NO existe** en la tabla `retention_lines`.

### **Ejemplo del Problema:**
```javascript
// Request
POST /api/proceedings
{
  "retentionLineId": 1  // ❌ Este ID no existe en retention_lines
}

// Error
Foreign key constraint violated
```

---

## ✅ SOLUCIONES

### **Opción 1: Crear RetentionLines Primero (Recomendado)**

Necesitas crear RetentionLines antes de crear Proceedings.

#### **Flujo Correcto:**
1. **Crear Retention** (Tabla de Retención)
2. **Crear RetentionLines** (Líneas de esa tabla)
3. **Crear Proceeding** (Asociado a una RetentionLine)

---

### **Opción 2: Usar un RetentionLine Existente**

Si ya tienes RetentionLines en la base de datos, usa uno de esos IDs.

#### **Verificar RetentionLines Existentes:**

**Desde el frontend:**
1. Ir a la página de Retentions
2. Seleccionar una Retention
3. Ver las RetentionLines de esa Retention
4. Usar el ID de una RetentionLine existente

**Desde la API:**
```bash
GET /api/retentions/:retentionId/lines
```

---

### **Opción 3: Crear Endpoint para RetentionLines**

Necesitas crear un CRUD completo para RetentionLines.

---

## 🚀 IMPLEMENTACIÓN RÁPIDA

### **1. Crear Servicio de RetentionLines:**

```javascript
// /server/src/modules/retentions/retentionLine.service.js
import { prisma } from '../../db/prisma.js';

class RetentionLineService {
  async getByRetentionId(retentionId) {
    const lines = await prisma.retentionLine.findMany({
      where: {
        retentionId: parseInt(retentionId),
        deletedAt: null,
      },
      orderBy: { id: 'asc' },
    });
    return lines;
  }

  async create(data) {
    const line = await prisma.retentionLine.create({
      data: {
        retentionId: parseInt(data.retentionId),
        series: data.series,
        subseries: data.subseries,
        code: data.code,
        documents: data.documents,
        localRetention: parseInt(data.localRetention),
        centralRetention: parseInt(data.centralRetention),
        dispositionCt: data.dispositionCt || false,
        dispositionE: data.dispositionE || false,
        dispositionM: data.dispositionM || false,
        dispositionD: data.dispositionD || false,
        dispositionS: data.dispositionS || false,
        comments: data.comments,
      },
    });
    return line;
  }
}

export default new RetentionLineService();
```

### **2. Agregar Endpoint en Retention Routes:**

```javascript
// /server/src/modules/retentions/retention.routes.js
import retentionLineService from './retentionLine.service.js';

// Obtener líneas de una retention
router.get('/:id/lines', authenticate, async (req, res) => {
  try {
    const lines = await retentionLineService.getByRetentionId(req.params.id);
    res.json(lines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear línea de retention
router.post('/:id/lines', authenticate, async (req, res) => {
  try {
    const data = { ...req.body, retentionId: req.params.id };
    const line = await retentionLineService.create(data);
    res.status(201).json(line);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 💡 SOLUCIÓN TEMPORAL (Para Probar)

### **Crear RetentionLine Manualmente en la BD:**

```sql
-- Primero, verifica que tengas una Retention
SELECT id, name FROM retentions LIMIT 1;

-- Luego, crea una RetentionLine
INSERT INTO retention_lines (
  retention_id,
  series,
  subseries,
  code,
  documents,
  local_retention,
  central_retention,
  disposition_ct,
  disposition_e,
  disposition_m,
  disposition_d,
  disposition_s,
  created_at,
  updated_at
) VALUES (
  1,                    -- retention_id (usa el ID de una retention existente)
  'Serie A',
  'Subserie 1',
  'A-1',
  'Documentos varios',
  5,                    -- local_retention (años)
  10,                   -- central_retention (años)
  true,                 -- disposition_ct
  false,                -- disposition_e
  false,                -- disposition_m
  false,                -- disposition_d
  false,                -- disposition_s
  NOW(),
  NOW()
);

-- Verifica que se creó
SELECT id, series, subseries, code FROM retention_lines;
```

---

## 🎯 FLUJO CORRECTO EN EL FRONTEND

### **Actualizar el Formulario de Proceedings:**

```jsx
// 1. Cargar Retentions al seleccionar Company
const loadRetentions = async (companyId) => {
  const response = await axios.get(`/api/retentions?companyId=${companyId}`);
  setRetentions(response.data);
};

// 2. Cargar RetentionLines al seleccionar Retention
const loadRetentionLines = async (retentionId) => {
  const response = await axios.get(`/api/retentions/${retentionId}/lines`);
  setRetentionLines(response.data);
};

// 3. Formulario con dos selectores
<FormControl>
  <InputLabel>Tabla de Retención</InputLabel>
  <Select
    value={selectedRetention}
    onChange={(e) => {
      setSelectedRetention(e.target.value);
      loadRetentionLines(e.target.value);
    }}
  >
    {retentions.map(r => (
      <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl disabled={!selectedRetention}>
  <InputLabel>Línea de Retención</InputLabel>
  <Select
    name="retentionLineId"
    value={values.retentionLineId}
    onChange={(e) => setFieldValue('retentionLineId', e.target.value)}
  >
    {retentionLines.map(line => (
      <MenuItem key={line.id} value={line.id}>
        {line.series} - {line.subseries} ({line.code})
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

---

## ⚠️ IMPORTANTE

**NO puedes crear un Proceeding sin una RetentionLine válida.**

### **Opciones:**
1. ✅ Crear RetentionLines primero
2. ✅ Usar un RetentionLine existente
3. ❌ NO puedes saltarte este paso

---

## 📋 PRÓXIMOS PASOS

1. ⏳ Crear endpoint `/api/retentions/:id/lines`
2. ⏳ Actualizar frontend con selector en cascada
3. ⏳ Crear RetentionLines para tus Retentions
4. ⏳ Probar creación de Proceedings

---

## 🔧 SOLUCIÓN RÁPIDA PARA PROBAR AHORA

### **Opción A: Crear RetentionLine desde SQL**
Ejecuta el SQL de arriba para crear una RetentionLine.

### **Opción B: Modificar temporalmente el formulario**
Cambia el selector para que muestre Retentions y usa el mismo ID como retentionLineId (solo si coinciden).

### **Opción C: Implementar el endpoint completo**
Crea el servicio y endpoint de RetentionLines.

---

**¿Qué opción prefieres?** 🤔

1. **Crear RetentionLine manualmente** (SQL - Rápido)
2. **Implementar endpoint completo** (Recomendado)
3. **Solución temporal** (Para probar ahora)

---

**Última actualización:** 2025-10-12 13:09  
**Estado:** ⚠️ ESPERANDO DECISIÓN
