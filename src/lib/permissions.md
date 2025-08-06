# Sistema de Permisos y Autenticación

Este documento explica cómo funciona el sistema de autenticación y permisos implementado en la aplicación.

## Middleware de Autenticación

El middleware (`src/middleware.ts`) se ejecuta en cada request y:

1. **Verifica rutas públicas**: Permite acceso sin autenticación a:
   - `/iniciar-sesion`
   - `/registro`
   - `/forgot-password`
   - `/reset-password`

2. **Valida la cookie de autenticación**: Verifica que la cookie `vinza_auth_cookie` exista y sea válida

3. **Verifica permisos de acceso**: Usa el sistema de permisos para determinar si el usuario puede acceder a la ruta

4. **Añade headers**: Inyecta información del usuario en los headers para uso en server components

## Sistema de Permisos

### Roles Disponibles

- `admin`: Acceso completo a todas las funcionalidades
- `user`: Acceso limitado según permisos definidos

### Permisos Definidos

- `manage_users`: Gestionar usuarios
- `view_users`: Ver listado de usuarios
- `manage_reservations`: Gestionar reservas
- `view_reservations`: Ver reservas
- `manage_events`: Gestionar eventos
- `view_events`: Ver eventos
- `manage_bodega`: Gestionar información de bodega
- `view_bodega`: Ver información de bodega
- `admin_panel`: Acceder al panel de administración

### Mapeo de Rutas a Permisos

Las rutas están mapeadas a permisos específicos en `ROUTE_PERMISSIONS`:

```typescript
'/bodega/usuarios': ['view_users']
'/bodega/usuarios/crear': ['manage_users']
'/reservas': ['view_reservations']
'/eventos/crear': ['manage_events']
// etc...
```

## Funciones Utilitarias

### En Server Components

```typescript
import { getCurrentUser, isAdmin, hasRole } from "@/lib/utils.server";

// Obtener información del usuario actual
const user = await getCurrentUser();

// Verificar si es administrador
const isUserAdmin = await isAdmin();

// Verificar rol específico
const isUserRole = await hasRole("user");
```

### En el Sistema de Permisos

```typescript
import {
  hasPermission,
  hasRouteAccess,
  getRolePermissions,
} from "@/lib/permissions";

// Verificar si un rol tiene un permiso específico
const canManageUsers = hasPermission("admin", "manage_users");

// Verificar acceso a una ruta
const canAccessRoute = hasRouteAccess("user", "/bodega/usuarios");

// Obtener todos los permisos de un rol
const adminPermissions = getRolePermissions("admin");
```

## Añadir Nuevos Permisos

Para añadir nuevos permisos:

1. **Definir el permiso** en el tipo `Permission` en `src/lib/permissions.ts`
2. **Asignar a roles** en `ROLE_PERMISSIONS`
3. **Mapear rutas** en `ROUTE_PERMISSIONS` si es necesario

## Flujo de Autenticación

1. Usuario hace request a una ruta protegida
2. Middleware verifica si la ruta está en `PUBLIC_ROUTES`
3. Si no es pública, verifica la existencia y validez de la cookie
4. Verifica permisos usando `hasRouteAccess()`
5. Si tiene permisos, añade headers del usuario y continúa
6. Si no tiene permisos o cookie inválida, redirige al login

## Headers Disponibles en Server Components

Después de pasar por el middleware, los server components tienen acceso a:

- `x-user-id`: ID del usuario
- `x-user-role`: Rol del usuario
- `x-user-email`: Email del usuario
- `x-user-name`: Nombre del usuario

Estos headers se pueden usar directamente con `getCurrentUser()` para obtener la información del usuario sin parsear cookies.

## Sistema de Logging

El middleware incluye un sistema de logging minimalista para trazabilidad:

### Configuración

- **Desarrollo**: Logs activos por defecto
- **Producción**: Solo errores, a menos que se establezca `MIDDLEWARE_LOGGING=true`

### Eventos Loggeados

- `AUTH_SUCCESS`: Autenticación exitosa (solo desarrollo)
- `AUTH_FAILURE`: Fallos de autenticación
- `PERMISSION_DENIED`: Acceso denegado por permisos
- `REDIRECT`: Redirecciones del middleware
- `COOKIE_ERROR`: Errores de validación de cookies

### Formato de Logs

```
[Middleware]: <timestamp> <evento> - <mensaje> | <contexto>
```

Ejemplo:

```
[Middleware]: 2024-01-15T10:30:45.123Z AUTH_FAILURE - Falló autenticación | pathname=/dashboard reason=Cookie no encontrada
```
