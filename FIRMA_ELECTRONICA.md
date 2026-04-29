# Firma Electrónica — Cumplimiento Legal (Decreto 2364 de 2012)

## Resumen

Este sistema implementa **firma electrónica simple** conforme al **Decreto 2364 de 2012** expedido por el Ministerio de Comercio, Industria y Turismo de Colombia, reglamentario de la **Ley 527 de 1999** (Ley de Comercio Electrónico). La firma se aplica opcionalmente al responder una correspondencia formal.

---

## Marco normativo aplicable

| Norma | Descripción |
|---|---|
| **Ley 527 de 1999** | Define y reglamenta el acceso y uso de los mensajes de datos, el comercio electrónico y las firmas digitales en Colombia |
| **Decreto 2364 de 2012** | Reglamenta el artículo 7 de la Ley 527/1999 sobre la firma electrónica y establece sus requisitos de validez |
| **Ley 1437 de 2011** | Código de Procedimiento Administrativo — reconoce los medios electrónicos para actuaciones administrativas |

---

## Requisitos del Decreto 2364/2012 y cómo se cumplen

### Artículo 3 — Requisitos de la firma electrónica

> *"La firma electrónica es válida cuando: (i) identifica al firmante, (ii) indica la aprobación del contenido del mensaje, (iii) el método utilizado es confiable y apropiado para el propósito para el cual fue generado."*

| Requisito legal | Mecanismo técnico implementado | Dónde |
|---|---|---|
| **Identificación única del firmante** | JWT activo con `userId`, `name`, `email`, `companyId` — el token sólo existe si el usuario ha autenticado su contraseña | `middleware/auth.js` + `ElectronicSignature.userId/signerName/signerEmail` |
| **Integridad del documento** | Hash SHA-256 del contenido del mensaje al momento de la firma | `ElectronicSignature.documentHash` |
| **Vinculación lógica al documento** | `signatureToken` UUID único vinculado a `threadId` (1-a-1) y `correspondenceId` | `ElectronicSignature.threadId @unique` |
| **Control exclusivo del firmante** | La firma sólo puede generarse con JWT válido del usuario autenticado + confirmación explícita en UI (modal secundario) | `correspondence.controller.js` + `ThreadForm.jsx` |
| **Evidencias electrónicas** | IP de la solicitud, User-Agent del navegador, timestamp inmutable, hash SHA-256, UUID del token | `ElectronicSignature.ipAddress/userAgent/createdAt/documentHash/signatureToken` |
| **Consentimiento explícito** | Checkbox de opt-in + modal de confirmación con texto legal antes de enviar | `ThreadForm.jsx` — `showConfirmDialog` |

---

## Modelo de datos — `ElectronicSignature`

```prisma
model ElectronicSignature {
  id               BigInt               // PK autoincremental
  correspondenceId BigInt               // FK → Correspondence
  threadId         BigInt  @unique      // FK → CorrespondenceThread (1-a-1)
  userId           BigInt               // FK → User (firmante)
  signerName       String               // Nombre del firmante en el momento de la firma
  signerEmail      String               // Email del firmante en el momento de la firma
  documentHash     String               // SHA-256 hex del contenido del mensaje
  signatureToken   String  @unique @default(uuid())  // Token irrepetible de la firma
  ipAddress        String?              // IP de la solicitud HTTP
  userAgent        String?              // User-Agent del cliente
  metadata         Json?                // { correspondenceTitle, companyId }
  createdAt        DateTime @default(now())  // Timestamp inmutable de creación
}
```

### Por qué cada campo es relevante legalmente

| Campo | Relevancia legal |
|---|---|
| `signerName` + `signerEmail` | Identifica al firmante por nombre y correo corporativo verificado |
| `documentHash` (SHA-256) | Cualquier modificación posterior al mensaje cambia el hash — prueba de integridad |
| `signatureToken` (UUID v4) | Identificador único e irrepetible que vincula la firma a este documento específico |
| `ipAddress` | Evidencia electrónica del origen de la firma (geolocalización posible) |
| `userAgent` | Identifica el dispositivo/navegador usado — elemento de trazabilidad |
| `createdAt` | Timestamp del servidor — imposible de falsificar por el cliente |
| `threadId @unique` | Un thread sólo puede tener **una** firma — evita firmas duplicadas o retroactivas |

---

## Flujo completo de firma

```
1. Usuario autenticado (JWT válido) abre modal "Responder"
2. Activa checkbox "Aplicar firma electrónica"
   → Se muestra: nombre JWT, email JWT, fecha/hora actual, aviso legal Decreto 2364/2012
3. Escribe el mensaje y hace clic en "Firmar y enviar"
4. Aparece modal de confirmación con datos del firmante y base legal
5. Usuario confirma → POST /api/correspondences/:id/respond { response, sign: true }
6. Backend (correspondence.controller.js):
   a. Extrae IP = req.ip | X-Forwarded-For
   b. Extrae userAgent = req.headers['user-agent']
   c. Llama correspondenceService.respond(id, data, userId, { ip, userAgent })
7. Backend (correspondence.service.js):
   a. Crea CorrespondenceThread con el mensaje
   b. Calcula documentHash = SHA-256(message)
   c. Inserta ElectronicSignature con todos los campos de evidencia
   d. Envía email al remitente original con bloque de firma electrónica adjunto
8. Respuesta al cliente incluye signatureToken
9. Frontend muestra: "Respuesta enviada y firmada electrónicamente (Token: abc-123…)"
10. ThreadTable muestra chip "Firmado" con tooltip del token completo
```

---

## Verificación de integridad post-firma

Para verificar que un mensaje no fue alterado después de firmarse:

```bash
# Tomar el contenido del campo `message` del CorrespondenceThread
# (en texto plano, sin HTML si aplica) y calcular su SHA-256:
echo -n "contenido del mensaje" | sha256sum

# Comparar con ElectronicSignature.documentHash en la base de datos
```

Si los hashes coinciden, el documento **no fue alterado** desde la firma.

---

## Evidencias incluidas en el correo electrónico

Cuando la respuesta lleva firma electrónica, el correo enviado al destinatario incluye un bloque con:

- ✅ Nombre y correo del firmante
- ✅ Fecha y hora exacta de la firma
- ✅ Token UUID único de la firma
- ✅ Hash SHA-256 del documento
- ✅ Referencia al Decreto 2364 de 2012

Esto le permite al receptor conservar el correo como **evidencia legal independiente**.

---

## ¿Es suficiente para cumplir la ley?

### ✅ Lo que SÍ cumple esta implementación

- **Firma electrónica simple** — válida para la mayoría de actos jurídicos privados y comunicaciones administrativas
- Identifica al firmante mediante credenciales verificadas (JWT)
- Garantiza la integridad del documento (SHA-256)
- Registra evidencias electrónicas completas (IP, UA, timestamp)
- Requiere consentimiento explícito del firmante (doble confirmación en UI)
- Conserva trazabilidad en base de datos auditada

### ⚠️ Consideraciones adicionales

| Escenario | Recomendación |
|---|---|
| **Contratos con valor > 20 SMMLV o actos notariales** | Requieren **firma digital certificada** por entidad acreditada (Certicámara, GSE, etc.) |
| **Procesos judiciales como prueba documental** | La firma simple es válida como indicio; una firma digital certificada tiene mayor peso probatorio |
| **Entidades públicas (MIPG)** | Verificar si la política interna requiere firma digital certificada para actos administrativos |
| **Contratos laborales** | La firma electrónica simple es válida para envío de comunicaciones; los contratos mismos pueden requerir firma digital |

### Conclusión

Para el caso de uso principal del sistema — **respuesta formal a correspondencias administrativas entre empresa y clientes/usuarios** — la implementación cumple íntegramente con los requisitos del **Decreto 2364 de 2012**. La autenticación JWT actúa como mecanismo de identificación confiable (el usuario debe conocer su contraseña para generar el token), el SHA-256 garantiza la integridad, y las evidencias electrónicas almacenadas permiten la trazabilidad y el no repudio.

---

## Archivos del sistema relacionados

| Archivo | Rol |
|---|---|
| `server/prisma/schema.prisma` | Modelo `ElectronicSignature` |
| `server/src/modules/correspondences/correspondence.service.js` | `createElectronicSignature()`, lógica en `respond()` |
| `server/src/modules/correspondences/correspondence.controller.js` | Extracción de IP/UserAgent, respuesta con `signatureToken` |
| `server/src/modules/correspondences/correspondence.validation.js` | Validación del campo `sign` |
| `server/src/templates/correspondenceResponseEmail.js` | Bloque HTML de firma en correo (texto plano) |
| `server/src/templates/correspondenceTemplateResponseEmail.js` | Bloque HTML de firma en correo (con plantilla PDF) |
| `client/src/modules/correspondences/components/ThreadForm.jsx` | UI: checkbox, panel de identidad, modal de confirmación |
| `client/src/modules/correspondences/pages/CorrespondenceDetail.jsx` | Paso del flag `sign`, mensaje de confirmación |
| `client/src/modules/correspondences/components/ThreadTable.jsx` | Badge "Firmado" con tooltip del token |

---

*Documento generado el 28 de abril de 2026. Revisión legal recomendada ante cambios normativos.*
