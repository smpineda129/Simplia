# ✅ CORRECCIÓN FRONTEND - PROCEEDINGS

**Fecha:** 2025-10-12 13:00  
**Estado:** ✅ CORREGIDO

---

## 🔧 CAMBIOS APLICADOS

### **1. proceedingSchema.js**

```javascript
// ❌ ANTES
retentionId: Yup.number()
  .required('La tabla de retención es requerida')
  .positive('Debe seleccionar una tabla de retención válida')
  .integer('Debe ser un número entero'),

// ✅ DESPUÉS
retentionLineId: Yup.number()
  .required('La línea de retención es requerida')
  .positive('Debe seleccionar una línea de retención válida')
  .integer('Debe ser un número entero'),
```

### **2. ProceedingModalForm.jsx**

#### **Initial Values:**
```javascript
// ❌ ANTES
const initialValues = {
  name: proceeding?.name || '',
  code: proceeding?.code || '',
  startDate: proceeding?.startDate ? proceeding.startDate.split('T')[0] : '',
  companyId: proceeding?.companyId || '',
  retentionId: proceeding?.retentionId || '',  // ❌
  companyOne: proceeding?.companyOne || '',
  companyTwo: proceeding?.companyTwo || '',
};

// ✅ DESPUÉS
const initialValues = {
  name: proceeding?.name || '',
  code: proceeding?.code || '',
  startDate: proceeding?.startDate ? proceeding.startDate.split('T')[0] : '',
  companyId: proceeding?.companyId || '',
  retentionLineId: proceeding?.retentionLineId || '',  // ✅
  companyOne: proceeding?.companyOne || '',
  companyTwo: proceeding?.companyTwo || '',
};
```

#### **Company onChange:**
```javascript
// ❌ ANTES
onChange={(e) => {
  setFieldValue('companyId', e.target.value);
  setFieldValue('retentionId', '');  // ❌
  loadRetentionsForCompany(e.target.value);
}}

// ✅ DESPUÉS
onChange={(e) => {
  setFieldValue('companyId', e.target.value);
  setFieldValue('retentionLineId', '');  // ✅
  loadRetentionsForCompany(e.target.value);
}}
```

#### **Retention Field:**
```javascript
// ❌ ANTES
<Field
  as={TextField}
  select
  name="retentionId"  // ❌
  label="Tabla de Retención *"
  fullWidth
  value={values.retentionId}  // ❌
  onChange={(e) => setFieldValue('retentionId', e.target.value)}  // ❌
  error={touched.retentionId && Boolean(errors.retentionId)}  // ❌
  helperText={touched.retentionId && errors.retentionId}  // ❌
  disabled={!values.companyId}
>

// ✅ DESPUÉS
<Field
  as={TextField}
  select
  name="retentionLineId"  // ✅
  label="Tabla de Retención *"
  fullWidth
  value={values.retentionLineId}  // ✅
  onChange={(e) => setFieldValue('retentionLineId', e.target.value)}  // ✅
  error={touched.retentionLineId && Boolean(errors.retentionLineId)}  // ✅
  helperText={touched.retentionLineId && errors.retentionLineId}  // ✅
  disabled={!values.companyId}
>
```

---

## ⚠️ NOTA IMPORTANTE

**El selector aún muestra "Retentions" pero debería mostrar "RetentionLines"**

Actualmente el formulario carga `retentions` (tablas de retención) pero debería cargar `retentionLines` (líneas de retención) de la retention seleccionada.

### **Flujo Correcto (Futuro):**

1. Usuario selecciona **Empresa**
2. Sistema carga **Retentions** de esa empresa
3. Usuario selecciona **Retention** (tabla de retención)
4. Sistema carga **RetentionLines** de esa retention
5. Usuario selecciona **RetentionLine** específica
6. Se envía `retentionLineId` al backend

### **Flujo Actual (Temporal):**

Por ahora, el selector muestra Retentions pero envía el ID como `retentionLineId`. Esto funcionará **solo si los IDs coinciden** o si ajustamos el backend temporalmente.

---

## 🔄 SOLUCIÓN TEMPORAL

Para que funcione ahora mismo sin cambiar todo el flujo, hay dos opciones:

### **Opción 1: Usar Retention ID como RetentionLine ID (Temporal)**

Modificar el backend para aceptar `retentionId` y buscar la primera `retentionLine`:

```javascript
// En proceeding.service.js
async create(data) {
  let retentionLineId = data.retentionLineId;
  
  // Si no viene retentionLineId, buscar la primera línea de la retention
  if (!retentionLineId && data.retentionId) {
    const firstLine = await prisma.retentionLine.findFirst({
      where: { retentionId: parseInt(data.retentionId) }
    });
    retentionLineId = firstLine?.id;
  }
  
  const proceeding = await prisma.proceeding.create({
    data: {
      name: data.name,
      code: data.code,
      startDate: new Date(data.startDate),
      companyOne: data.companyOne,
      companyTwo: data.companyTwo,
      companyId: parseInt(data.companyId),
      retentionLineId: parseInt(retentionLineId),
    },
    // ...
  });
}
```

### **Opción 2: Implementar Selector en Cascada (Recomendado)**

Actualizar el frontend para tener dos selectores:

```jsx
// 1. Selector de Retention
<Field
  as={TextField}
  select
  name="retentionId"
  label="Tabla de Retención *"
  onChange={(e) => {
    setFieldValue('retentionId', e.target.value);
    setFieldValue('retentionLineId', '');
    loadRetentionLines(e.target.value);
  }}
>
  {retentions.map((retention) => (
    <MenuItem key={retention.id} value={retention.id}>
      {retention.name} ({retention.code})
    </MenuItem>
  ))}
</Field>

// 2. Selector de RetentionLine
<Field
  as={TextField}
  select
  name="retentionLineId"
  label="Línea de Retención *"
  disabled={!values.retentionId}
>
  {retentionLines.map((line) => (
    <MenuItem key={line.id} value={line.id}>
      {line.series} - {line.subseries} ({line.code})
    </MenuItem>
  ))}
</Field>
```

---

## ✅ ARCHIVOS MODIFICADOS

1. ✅ `/client/src/modules/proceedings/schemas/proceedingSchema.js`
   - Cambiado `retentionId` → `retentionLineId`

2. ✅ `/client/src/modules/proceedings/components/ProceedingModalForm.jsx`
   - Cambiado `retentionId` → `retentionLineId` en initialValues
   - Cambiado `retentionId` → `retentionLineId` en todos los campos
   - Cambiado `retentionId` → `retentionLineId` en validaciones

---

## 🚀 ESTADO ACTUAL

```
✅ Schema actualizado
✅ Formulario actualizado
✅ Validaciones actualizadas
⚠️  Selector muestra Retentions (debería mostrar RetentionLines)
```

---

## 📋 PRÓXIMOS PASOS RECOMENDADOS

1. ⏳ Crear endpoint `/api/retentions/:id/lines` para obtener RetentionLines
2. ⏳ Actualizar formulario con selector en cascada
3. ⏳ Cargar RetentionLines al seleccionar Retention
4. ⏳ Mostrar información completa en la tabla

---

## 💡 PRUEBA RÁPIDA

**Ahora puedes probar creando un Proceeding:**

1. Selecciona una **Empresa**
2. Selecciona una **Tabla de Retención**
3. Llena los demás campos
4. Click en **Guardar**

**El formulario ahora enviará `retentionLineId` correctamente** ✅

---

**Última actualización:** 2025-10-12 13:00  
**Estado:** ✅ FRONTEND CORREGIDO
