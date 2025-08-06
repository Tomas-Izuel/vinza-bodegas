// Sistema de permisos para control de acceso basado en roles

export type Role = "admin" | "user";

export type Permission =
  | "manage_users" // Gestionar usuarios
  | "view_users" // Ver listado de usuarios
  | "manage_reservations" // Gestionar reservas
  | "view_reservations" // Ver reservas
  | "manage_events" // Gestionar eventos
  | "view_events" // Ver eventos
  | "manage_bodega" // Gestionar información de bodega
  | "view_bodega" // Ver información de bodega
  | "admin_panel"; // Acceder al panel de administración

// Definición de permisos por rol
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "manage_users",
    "view_users",
    "manage_reservations",
    "view_reservations",
    "manage_events",
    "view_events",
    "manage_bodega",
    "view_bodega",
    "admin_panel",
  ],
  user: ["view_reservations", "view_events", "view_bodega"],
};

// Mapeo de rutas a permisos requeridos
export const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  "/bodega/usuarios": ["view_users"],
  "/bodega/usuarios/crear": ["manage_users"],
  "/bodega/usuarios/editar": ["manage_users"],
  "/reservas": ["view_reservations"],
  "/reservas/crear": ["manage_reservations"],
  "/reservas/editar": ["manage_reservations"],
  "/eventos": ["view_events"],
  "/eventos/crear": ["manage_events"],
  "/eventos/editar": ["manage_events"],
  "/bodega": ["view_bodega"],
  "/bodega/informacion": ["view_bodega"],
  "/bodega/informacion/editar": ["manage_bodega"],
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Verifica si un rol tiene acceso a una ruta específica
 */
export function hasRouteAccess(role: Role, pathname: string): boolean {
  // Buscar coincidencia exacta primero
  const requiredPermissions = ROUTE_PERMISSIONS[pathname];

  if (requiredPermissions) {
    return requiredPermissions.every((permission) =>
      hasPermission(role, permission),
    );
  }

  // Buscar coincidencias por prefijo para rutas dinámicas
  for (const [routePattern, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(routePattern)) {
      return permissions.every((permission) => hasPermission(role, permission));
    }
  }

  // Si no se encuentra un mapeo específico, permitir acceso por defecto
  // (esto se puede cambiar a false para un enfoque más restrictivo)
  return true;
}

/**
 * Obtiene los permisos de un rol
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Verifica si un usuario puede acceder a múltiples rutas
 */
export function canAccessRoutes(role: Role, pathnames: string[]): boolean {
  return pathnames.every((pathname) => hasRouteAccess(role, pathname));
}
