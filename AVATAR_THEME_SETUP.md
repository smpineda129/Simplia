# Avatar y Personalización de Tema - Guía de Configuración

## Cambios Implementados

### 1. Backend (Servidor)

#### Base de Datos
- **Campo agregado**: `avatar` (VARCHAR 50) a la tabla `users` en el schema de Prisma
- **Ubicación**: `/server/prisma/schema.prisma`

#### Servicios Actualizados
- `user.service.js`: Agregado campo `avatar` a las consultas de usuarios
- `auth.service.js`: Ya incluye automáticamente el campo `avatar` mediante `include`

### 2. Frontend (Cliente)

#### Nuevos Componentes Creados

1. **AvatarSelector** (`/client/src/components/AvatarSelector.jsx`)
   - Diálogo modal para seleccionar avatares predefinidos
   - 12 opciones de avatares con iconos de Material-UI
   - Cada avatar tiene un color único

2. **ThemeCustomizer** (`/client/src/components/ThemeCustomizer.jsx`)
   - Diálogo modal para personalizar el tema
   - 8 esquemas de color predefinidos
   - Toggle para modo oscuro/claro
   - Vista previa en tiempo real

3. **ThemeContext** (`/client/src/context/ThemeContext.jsx`)
   - Context Provider para gestión de tema global
   - Almacenamiento en localStorage
   - Integración con Material-UI Theme

4. **avatarUtils** (`/client/src/utils/avatarUtils.js`)
   - Utilidad para mapear IDs de avatar a iconos y colores
   - Función `getAvatarConfig()` para obtener configuración de avatar

#### Componentes Actualizados

1. **UserProfile** (`/client/src/modules/users/pages/UserProfile.jsx`)
   - Botón "Personalizar Tema" en el header
   - Avatar con botón de cámara para cambiar
   - Integración con AvatarSelector y ThemeCustomizer

2. **UserProfileView** (`/client/src/modules/users/pages/UserProfileView.jsx`)
   - Muestra avatares de usuarios usando iconos

3. **App.jsx** (`/client/src/App.jsx`)
   - Envuelto con ThemeCustomizationProvider

## Instrucciones de Instalación

### Paso 1: Ejecutar Migración de Base de Datos

```bash
cd server
npx prisma migrate dev --name add_avatar_to_users
```

Este comando:
- Creará la migración SQL para agregar el campo `avatar`
- Aplicará la migración a la base de datos
- Regenerará el cliente de Prisma

### Paso 2: Verificar Instalación

No se requieren dependencias adicionales. Todos los iconos y componentes usan Material-UI que ya está instalado.

### Paso 3: Reiniciar Servicios

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Características

### Selección de Avatar
- Los usuarios pueden seleccionar entre 12 avatares predefinidos
- Los avatares se guardan en la base de datos
- Los cambios se reflejan inmediatamente en toda la aplicación
- No se requiere subir archivos

### Personalización de Tema
- **Almacenamiento**: localStorage (no en base de datos)
- **Persistencia**: Se mantiene entre sesiones del navegador
- **Opciones**:
  - 8 esquemas de color predefinidos
  - Modo oscuro/claro
  - Vista previa en tiempo real
  - Botón de restablecer a valores predeterminados

### Avatares Disponibles
1. Persona (Azul)
2. Persona Outline (Azul claro)
3. Cara (Cian claro)
4. Cuenta (Cian)
5. Supervisado (Teal)
6. Emociones (Verde)
7. Satisfecho (Verde lima)
8. Etiqueta (Amarillo lima)
9. Estado de ánimo (Amarillo)
10. Emoticón (Ámbar)
11. Muy satisfecho (Naranja)
12. Psicología (Rojo)

### Esquemas de Color
1. Azul (predeterminado)
2. Verde
3. Púrpura
4. Naranja
5. Teal
6. Índigo
7. Rosa
8. Cian

## Uso

### Para Cambiar Avatar
1. Ir a "Mi Perfil"
2. Hacer clic en el botón de cámara sobre el avatar
3. Seleccionar un nuevo avatar
4. Hacer clic en "Confirmar"

### Para Personalizar Tema
1. Ir a "Mi Perfil"
2. Hacer clic en "Personalizar Tema" (botón superior derecho)
3. Activar/desactivar modo oscuro
4. Seleccionar un esquema de color
5. Hacer clic en "Guardar"

## Notas Técnicas

- **Avatar**: Se guarda en BD como string (ID del avatar)
- **Tema**: Se guarda en localStorage del navegador
- **Compatibilidad**: Funciona con todos los navegadores modernos
- **Performance**: Sin impacto significativo en rendimiento
- **Seguridad**: No hay subida de archivos, solo selección de iconos predefinidos

## Troubleshooting

### El avatar no se muestra
- Verificar que la migración se ejecutó correctamente
- Verificar que el campo `avatar` existe en la tabla `users`
- Revisar la consola del navegador para errores

### El tema no persiste
- Verificar que localStorage esté habilitado en el navegador
- Limpiar caché del navegador
- Verificar que ThemeCustomizationProvider envuelve la aplicación

### Error al guardar avatar
- Verificar que el backend esté corriendo
- Verificar permisos de actualización de usuario
- Revisar logs del servidor
