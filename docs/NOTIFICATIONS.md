# Sistema de Notificaciones

## Descripción General

El sistema de notificaciones de GDI permite enviar y gestionar notificaciones internas entre usuarios del sistema. Está diseñado para ser **escalable** y compatible con el schema de Laravel Nova Notifications, permitiendo reutilizar las tablas existentes de la aplicación anterior.

## Arquitectura

### Base de Datos

El sistema utiliza la tabla `notifications` con el siguiente schema (compatible con Laravel Nova):

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(191) NOT NULL,           -- Tipo de notificación (namespace estilo Laravel)
  notifiable_type VARCHAR(191) NOT NULL, -- Tipo de modelo notificable
  notifiable_id BIGINT NOT NULL,         -- ID del usuario/entidad que recibe la notificación
  data TEXT NOT NULL,                    -- JSON con datos de la notificación
  read_at TIMESTAMP NULL,               -- Fecha de lectura (NULL = no leída)
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Estructura de Datos (JSON)

El campo `data` almacena un JSON con la siguiente estructura:

```json
{
  "title": "Título de la notificación",
  "message": "Mensaje descriptivo de la notificación",
  "icon": "mail",
  "url": "/correspondences/123",
  "module": "correspondences",
  "entityId": "123",
  "entityType": "Correspondence",
  // Campos adicionales específicos del módulo
  "radicado": "IN-2024-000001",
  "correspondenceId": "123"
}
```

---

## Tipos de Notificación

### Correspondencias

| Tipo | Descripción | Cuándo se dispara |
|------|-------------|-------------------|
| `App\Notifications\CorrespondenceCreated` | Nueva correspondencia creada | Al crear una correspondencia |
| `App\Notifications\CorrespondenceAssigned` | Correspondencia asignada | Al asignar a un usuario |
| `App\Notifications\CorrespondenceUpdated` | Correspondencia actualizada | Al modificar una correspondencia |
| `App\Notifications\CorrespondenceResponded` | Respuesta recibida | Al responder una correspondencia |
| `App\Notifications\CorrespondenceClosed` | Correspondencia cerrada | Al cerrar una correspondencia |
| `App\Notifications\CorrespondenceThreadCreated` | Nuevo mensaje | Al crear un thread |

### Expedientes (Pendiente de implementar)

| Tipo | Descripción |
|------|-------------|
| `App\Notifications\ProceedingCreated` | Nuevo expediente creado |
| `App\Notifications\ProceedingAssigned` | Expediente asignado |
| `App\Notifications\ProceedingUpdated` | Expediente actualizado |

### Documentos (Pendiente de implementar)

| Tipo | Descripción |
|------|-------------|
| `App\Notifications\DocumentUploaded` | Documento subido |
| `App\Notifications\DocumentShared` | Documento compartido |

### Sistema

| Tipo | Descripción |
|------|-------------|
| `App\Notifications\SystemNotification` | Notificación general del sistema |

---

## API REST

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/notifications` | Obtener notificaciones del usuario |
| `GET` | `/api/notifications/unread-count` | Obtener conteo de no leídas |
| `POST` | `/api/notifications/:id/read` | Marcar como leída |
| `POST` | `/api/notifications/mark-all-read` | Marcar todas como leídas |
| `DELETE` | `/api/notifications/:id` | Eliminar notificación |
| `DELETE` | `/api/notifications` | Eliminar todas las notificaciones |

### GET /api/notifications

Obtiene las notificaciones del usuario autenticado.

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Número de página |
| `limit` | integer | 20 | Notificaciones por página |
| `unreadOnly` | boolean | false | Solo notificaciones no leídas |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "App\\Notifications\\CorrespondenceAssigned",
      "notifiableType": "App\\Models\\User",
      "notifiableId": "1",
      "data": {
        "title": "Correspondencia asignada",
        "message": "Se te ha asignado la correspondencia: Solicitud de información",
        "icon": "assignment_ind",
        "url": "/correspondences/123",
        "module": "correspondences",
        "entityId": "123",
        "entityType": "Correspondence",
        "radicado": "IN-2024-000001"
      },
      "readAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "isRead": false
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  },
  "unreadCount": 5
}
```

### GET /api/notifications/unread-count

Obtiene el conteo de notificaciones no leídas.

**Response:**

```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### POST /api/notifications/:id/read

Marca una notificación como leída.

**Response:**

```json
{
  "success": true,
  "message": "Notificación marcada como leída",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "readAt": "2024-01-15T11:00:00.000Z",
    "isRead": true
  }
}
```

### POST /api/notifications/mark-all-read

Marca todas las notificaciones del usuario como leídas.

**Response:**

```json
{
  "success": true,
  "message": "Todas las notificaciones han sido marcadas como leídas"
}
```

---

## Uso en el Backend

### Importar el servicio

```javascript
import notificationService, { NOTIFICATION_TYPES } from '../notifications/notification.service.js';
```

### Crear una notificación simple

```javascript
await notificationService.create({
  type: NOTIFICATION_TYPES.SYSTEM_NOTIFICATION,
  notifiableId: userId,
  data: {
    title: 'Título personalizado',
    message: 'Mensaje de la notificación',
    icon: 'info',
    url: '/ruta/opcional',
  },
});
```

### Notificar a múltiples usuarios

```javascript
await notificationService.createForMultipleUsers({
  type: NOTIFICATION_TYPES.CORRESPONDENCE_CREATED,
  userIds: [1, 2, 3, 4],
  data: {
    title: correspondence.title,
    correspondenceId: correspondence.id.toString(),
    radicado: correspondence.in_settled,
    url: `/correspondences/${correspondence.id}`,
  },
});
```

### Métodos específicos para Correspondencias

```javascript
// Notificar asignación
await notificationService.notifyCorrespondenceAssigned(
  correspondence,  // Objeto de correspondencia
  assignedUserId,  // ID del usuario asignado
  assignerName     // Nombre de quien asigna
);

// Notificar nuevo thread
await notificationService.notifyCorrespondenceThread(
  correspondence,
  thread,
  senderName,
  recipientIds     // Array de IDs de destinatarios
);

// Notificar respuesta
await notificationService.notifyCorrespondenceResponded(
  correspondence,
  responderName,
  recipientIds
);

// Notificar cierre
await notificationService.notifyCorrespondenceClosed(
  correspondence,
  recipientIds
);
```

---

## Uso en el Frontend

### Hook useNotifications

```jsx
import { useNotifications } from '../modules/notifications';

const MyComponent = () => {
  const {
    notifications,      // Lista de notificaciones
    unreadCount,        // Contador de no leídas
    loading,            // Estado de carga
    error,              // Error si existe
    pagination,         // Info de paginación
    fetchNotifications, // Obtener notificaciones
    fetchUnreadCount,   // Actualizar contador
    markAsRead,         // Marcar como leída
    markAllAsRead,      // Marcar todas como leídas
    deleteNotification, // Eliminar una
    deleteAllNotifications, // Eliminar todas
  } = useNotifications();

  // El hook hace polling automático cada 30 segundos
  // para actualizar el contador de no leídas

  return (
    <div>
      <span>Tienes {unreadCount} notificaciones sin leer</span>
    </div>
  );
};
```

### Componente NotificationPanel

El componente `NotificationPanel` se incluye automáticamente en el `MainLayout` y muestra:
- Icono de campana con badge del contador
- Dropdown con las últimas 10 notificaciones
- Acciones rápidas (marcar como leída, eliminar)
- Link a la página completa de notificaciones

```jsx
import { NotificationPanel } from '../modules/notifications';

// Ya incluido en MainLayout
<NotificationPanel />
```

### Página de Notificaciones

Accesible en `/notifications`, muestra:
- Lista completa de notificaciones paginadas
- Filtro por leídas/no leídas
- Acciones masivas (marcar todas, eliminar todas)

---

## Extender para Nuevos Módulos

### 1. Agregar nuevo tipo de notificación

En `notification.service.js`:

```javascript
export const NOTIFICATION_TYPES = {
  // ... tipos existentes
  
  // Nuevos tipos para tu módulo
  MY_MODULE_EVENT: 'App\\Notifications\\MyModuleEvent',
};

const NOTIFICATION_TEMPLATES = {
  // ... templates existentes
  
  [NOTIFICATION_TYPES.MY_MODULE_EVENT]: {
    title: 'Evento en mi módulo',
    getMessage: (data) => `Descripción del evento: ${data.detail}`,
    icon: 'star',
  },
};
```

### 2. Crear método helper (opcional)

```javascript
async notifyMyModuleEvent(entity, recipientIds) {
  const data = {
    title: entity.name,
    entityId: entity.id.toString(),
    module: 'my-module',
    entityType: 'MyEntity',
    url: `/my-module/${entity.id}`,
  };

  return this.createForMultipleUsers({
    type: NOTIFICATION_TYPES.MY_MODULE_EVENT,
    userIds: recipientIds,
    data,
  });
}
```

### 3. Integrar en tu módulo

```javascript
// En tu servicio
import notificationService from '../notifications/notification.service.js';

async create(data, userId) {
  const entity = await prisma.myEntity.create({ data });
  
  // Crear notificación
  try {
    await notificationService.notifyMyModuleEvent(entity, [userId]);
  } catch (error) {
    console.error('Error al crear notificación:', error);
  }
  
  return entity;
}
```

---

## Iconos Disponibles

El sistema usa iconos de Material UI. Los siguientes están mapeados:

| Nombre | Uso sugerido |
|--------|--------------|
| `mail` | Correspondencia nueva |
| `assignment_ind` | Asignación |
| `edit` | Actualización |
| `reply` | Respuesta |
| `check_circle` | Completado/Cerrado |
| `chat` | Mensaje/Thread |
| `info` | Información general |

Para agregar más iconos, edita `ICON_MAP` en `NotificationPanel.jsx` y `NotificationList.jsx`.

---

## Configuración

### Polling Interval

El intervalo de polling para actualizar el contador se configura en `useNotifications.js`:

```javascript
const POLLING_INTERVAL = 30000; // 30 segundos
```

### Desactivar Polling

```jsx
const { unreadCount } = useNotifications({ 
  pollingEnabled: false 
});
```

---

## Archivos del Sistema

### Backend

```
server/src/modules/notifications/
├── notification.service.js    # Lógica de negocio y tipos
├── notification.controller.js # Controladores REST
└── notification.routes.js     # Definición de rutas
```

### Frontend

```
client/src/modules/notifications/
├── components/
│   ├── NotificationPanel.jsx  # Panel dropdown en AppBar
│   └── NotificationList.jsx   # Lista completa paginada
├── hooks/
│   └── useNotifications.js    # Hook con estado y acciones
├── pages/
│   └── NotificationsPage.jsx  # Página /notifications
├── services/
│   └── notificationService.js # Llamadas API
└── index.js                   # Exports del módulo
```

---

## Notas de Migración desde Laravel Nova

El sistema está diseñado para ser compatible con la tabla `notifications` de Laravel Nova:

- Los campos `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at` mantienen el mismo formato
- El campo `type` usa el namespace de Laravel (`App\Notifications\...`)
- El campo `data` almacena JSON en formato string
- No se requiere migración de datos si ya existen notificaciones en la tabla

---

## Futuras Mejoras

- [ ] WebSockets para notificaciones en tiempo real
- [ ] Notificaciones por email
- [ ] Notificaciones push (móvil)
- [ ] Preferencias de notificación por usuario
- [ ] Agrupación de notificaciones similares
- [ ] Notificaciones programadas
