# 🔧 Problemas de Migración - Base de Datos Importada

## 📋 Resumen

La base de datos importada (`docu_silva.dump`) tiene una estructura diferente a la que esperaba el código original. Los principales problemas son:

### 1. **BigInt vs Int**
- La BD usa `BigInt` para IDs
- El código esperaba `Int`
- **Solución aplicada:** Serializer global en `server.js` y conversión en `tokenService.js`

### 2. **Nombres de Relaciones**
- Las relaciones en Prisma tienen nombres largos generados automáticamente
- El código espera nombres simples

### 3. **Campos Faltantes**
- Algunos campos que el código espera no existen en la BD importada

---

## 🚨 Módulos con Errores

### ✅ **ARREGLADOS:**
1. **auth** - Login funciona correctamente
2. **correspondences** - Parcialmente arreglado (relaciones actualizadas)

### ❌ **PENDIENTES:**

#### 1. **inventory** (InventoryItem)
- **Error:** Tabla `inventory_items` no existe en la BD importada
- **Solución:** Crear tabla o deshabilitar módulo

#### 2. **reports** 
- **Error:** `/api/reports/summary` falla
- **Causa:** Probablemente depende de módulos no configurados
- **Solución:** Revisar dependencias

#### 3. **entities** 
- **Error:** `/api/entities/categories` falla
- **Causa:** Tabla `entity_categories` puede no existir o tener estructura diferente
- **Solución:** Verificar schema

#### 4. **roles**
- **Error:** `/api/roles` falla
- **Causa:** Tabla `roles` tiene estructura diferente (Laravel Spatie)
- **Solución:** Adaptar servicio a estructura de Spatie

#### 5. **warehouses**
- **Error:** `/api/warehouses` falla
- **Causa:** Relaciones o campos faltantes
- **Solución:** Revisar schema y actualizar servicio

#### 6. **correspondence-types**
- **Error:** `/api/correspondence-types` falla
- **Causa:** Relaciones faltantes
- **Solución:** Actualizar servicio

---

## 🔧 Soluciones Aplicadas

### 1. **BigInt Serialization**
```javascript
// server/src/server.js
BigInt.prototype.toJSON = function() {
  return this.toString();
};
```

### 2. **Auth Service - findFirst**
```javascript
// Cambio de findUnique a findFirst (email no es único)
const user = await prisma.user.findFirst({
  where: { 
    email,
    deletedAt: null
  },
  // ...
});
```

### 3. **Token Service - BigInt to String**
```javascript
const userIdStr = typeof userId === 'bigint' ? userId.toString() : userId;
```

### 4. **Correspondence Service - Relaciones**
```javascript
// Usar nombres de relaciones del schema
users_correspondences_sender_idTousers: { ... }
users_correspondences_recipient_idTousers: { ... }
```

---

## 📝 Tareas Pendientes

### Prioridad Alta:
1. [ ] Revisar y actualizar módulo `warehouses`
2. [ ] Revisar y actualizar módulo `correspondence-types`
3. [ ] Revisar y actualizar módulo `entities`
4. [ ] Revisar y actualizar módulo `roles` (adaptar a Spatie)

### Prioridad Media:
5. [ ] Revisar y actualizar módulo `reports`
6. [ ] Crear o deshabilitar módulo `inventory`

### Prioridad Baja:
7. [ ] Optimizar queries (agregar índices)
8. [ ] Limpiar emails duplicados
9. [ ] Actualizar Prisma a v6

---

## 🎯 Estrategia Recomendada

### Opción 1: Arreglar Módulos (Tiempo: 4-6 horas)
1. Revisar schema de cada tabla
2. Actualizar servicios para usar relaciones correctas
3. Probar cada módulo individualmente

### Opción 2: Deshabilitar Módulos No Críticos (Tiempo: 1 hora)
1. Comentar rutas de módulos problemáticos
2. Enfocarse solo en módulos críticos:
   - auth ✅
   - companies ✅
   - users
   - correspondences (parcial)
3. Habilitar módulos gradualmente

### Opción 3: Regenerar Schema desde Cero (Tiempo: 2-3 horas)
1. Hacer backup del schema actual
2. Ejecutar `prisma db pull` limpio
3. Revisar y ajustar relaciones manualmente
4. Actualizar todos los servicios

---

## 📊 Estado Actual

| Módulo | Estado | Prioridad |
|--------|--------|-----------|
| auth | ✅ Funcional | Alta |
| companies | ✅ Funcional | Alta |
| users | ⚠️ Parcial | Alta |
| correspondences | ⚠️ Parcial | Alta |
| warehouses | ❌ Error 500 | Media |
| correspondence-types | ❌ Error 500 | Media |
| entities | ❌ Error 500 | Media |
| roles | ❌ Error 500 | Media |
| reports | ❌ Error 500 | Baja |
| inventory | ❌ No existe | Baja |

---

## 🚀 Siguiente Paso Recomendado

**Opción 2** es la más práctica para continuar desarrollando:
1. Deshabilitar módulos problemáticos temporalmente
2. Trabajar con los módulos funcionales
3. Arreglar módulos adicionales según se necesiten

¿Quieres que implemente esta estrategia?
