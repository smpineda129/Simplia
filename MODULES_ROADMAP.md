# Roadmap de Módulos - Sistema de Gestión Documental

## 📊 Análisis del Sistema

Basado en el schema de la base de datos, el sistema es una **plataforma de gestión documental y correspondencia** con los siguientes módulos principales:

---

## 🎯 Módulos Identificados (Prioridad)

### **Nivel 1: Core (Esenciales)**

#### 1. **Autenticación y Usuarios** 👥
- Login/Logout
- Gestión de usuarios
- Roles y permisos (Spatie)
- Sesiones
- OTP/2FA
- Password reset

**Tablas:**
- `users`
- `roles`
- `permissions`
- `model_has_roles`
- `model_has_permissions`
- `role_has_permissions`
- `sessions`
- `password_resets`
- `otp_verifications`

---

#### 2. **Empresas y Áreas** 🏢
- Gestión de empresas (multi-tenant)
- Gestión de áreas/departamentos
- Asignación de usuarios a áreas

**Tablas:**
- `companies`
- `areas`
- `area_user`

---

#### 3. **Documentos** 📄
- Subir documentos
- Gestión de documentos
- Metadatos
- Extracción de texto (OCR/Textract)
- Búsqueda de documentos

**Tablas:**
- `documents`
- `document_textracts`

---

### **Nivel 2: Gestión Documental**

#### 4. **Retención y Expedientes** 📁
- Tablas de retención documental
- Líneas de retención
- Expedientes (proceedings)
- Hilos de expedientes
- Asociación de documentos a expedientes

**Tablas:**
- `retentions`
- `retention_lines`
- `proceedings`
- `proceeding_threads`
- `document_proceeding`

---

#### 5. **Correspondencia** ✉️
- Tipos de correspondencia
- Crear correspondencia
- Hilos de conversación
- Asociar documentos
- Seguimiento de emails
- Estados y radicación

**Tablas:**
- `correspondence_types`
- `correspondences`
- `correspondence_threads`
- `correspondence_document`
- `sent_emails`
- `sent_emails_url_clicked`

---

#### 6. **Almacenamiento Físico** 📦
- Bodegas/Almacenes
- Cajas
- Ubicación física (isla, estantería, estante)
- Asociación cajas-expedientes

**Tablas:**
- `warehouses`
- `boxes`
- `box_warehouse`
- `box_proceeding`

---

### **Nivel 3: Complementarios**

#### 7. **Entidades** 🏛️
- Categorías de entidades
- Gestión de entidades (terceros)
- Asociación con expedientes

**Tablas:**
- `entity_categories`
- `entities`
- `entity_proceeding`

---

#### 8. **Usuarios Externos** 👤
- Registro de usuarios externos
- Portal de consulta
- Asociación con expedientes

**Tablas:**
- `external_users`
- `external_user_proceeding`

---

#### 9. **Formularios Dinámicos** 📋
- Crear formularios personalizados
- Campos dinámicos (JSON)
- Respuestas/Submissions
- Notificaciones por email

**Tablas:**
- `forms`
- `submissions`

---

#### 10. **Plantillas** 📝
- Plantillas de documentos
- Editor de plantillas
- Variables dinámicas

**Tablas:**
- `templates`

---

### **Nivel 4: Sistema**

#### 11. **Auditoría y Tracking** 🔍
- Registro de acciones
- Auditoría de cambios
- Historial de estados
- Transiciones pendientes
- Métricas y visitas

**Tablas:**
- `action_events`
- `audits`
- `state_histories`
- `pending_transitions`
- `metrics`
- `visits`

---

#### 12. **Notificaciones** 🔔
- Sistema de notificaciones
- Notificaciones en tiempo real
- Historial

**Tablas:**
- `notifications`

---

#### 13. **Suscripciones** 💳
- Planes de suscripción (Stripe)
- Gestión de pagos
- Límites por plan

**Tablas:**
- `subscriptions`
- `subscription_items`

---

#### 14. **Tags y Etiquetas** 🏷️
- Sistema de etiquetado
- Categorización

**Tablas:**
- `tags`

---

## 🚀 Plan de Implementación Sugerido

### **Fase 1: Fundación (Semana 1-2)**
1. ✅ Autenticación básica (ya existe)
2. 🔲 Migrar schema completo a Prisma
3. 🔲 Módulo de Empresas
4. 🔲 Módulo de Áreas
5. 🔲 Roles y Permisos básicos

### **Fase 2: Core Documental (Semana 3-4)**
6. 🔲 Módulo de Documentos
7. 🔲 Módulo de Retención
8. 🔲 Módulo de Expedientes básico

### **Fase 3: Correspondencia (Semana 5-6)**
9. 🔲 Tipos de Correspondencia
10. 🔲 Gestión de Correspondencia
11. 🔲 Hilos de conversación
12. 🔲 Tracking de emails

### **Fase 4: Almacenamiento (Semana 7)**
13. 🔲 Bodegas
14. 🔲 Cajas
15. 🔲 Ubicaciones físicas

### **Fase 5: Complementos (Semana 8-9)**
16. 🔲 Entidades
17. 🔲 Usuarios externos
18. 🔲 Formularios dinámicos
19. 🔲 Plantillas

### **Fase 6: Sistema (Semana 10)**
20. 🔲 Auditoría completa
21. 🔲 Notificaciones
22. 🔲 Métricas y reportes

---

## 📋 Próximos Pasos Inmediatos

1. **Combinar los archivos schema** en uno solo
2. **Conectar a la base de datos AWS** (cuando estés listo)
3. **Ejecutar `prisma db pull`** para validar el schema
4. **Decidir qué módulo implementar primero**

---

## 🤔 Preguntas para ti:

1. **¿Qué módulo quieres implementar primero?** (Recomiendo: Empresas → Documentos → Correspondencia)
2. **¿Tienes las credenciales de AWS RDS?** (para conectar la BD)
3. **¿Hay algún módulo más prioritario que no esté en la lista?**

---

**Última actualización:** 2025-10-11
