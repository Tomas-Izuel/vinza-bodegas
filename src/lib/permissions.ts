import { Routes } from "./routes";

export type Permission =
  | "sudo" // Acceso a todo
  | "bodegas_read" // Ver bodegas
  | "bodegas_manage" // Gestionar bodegas
  | "users_read" // Ver usuarios
  | "users_manage" // Gestionar usuarios
  | "roles_read" // Ver roles
  | "roles_manage" // Gestionar roles
  | "eventos_read" // Ver eventos
  | "eventos_manage" // Gestionar eventos
  | "reservas_read" // Ver reservas
  | "reservas_manage" // Gestionar reservas
  | "valoraciones_read" // Ver valoraciones
  | "valoraciones_manage" // Gestionar valoraciones
  | "instancia_eventos_read" // Ver instancia de eventos
  | "instancia_eventos_manage"; // Gestionar instancia de eventos

// Mapeo de rutas a permisos requeridos
export const routePermissionMap: Record<string, Permission[]> = {
  // Página principal - acceso básico para usuarios autenticados
  [Routes.HOME]: [],

  // Eventos
  [Routes.EVENTOS]: ["eventos_read"],
  [Routes.CREAR_EVENTO]: ["eventos_manage"],
  // Para rutas dinámicas como /eventos/[id], usaremos un patrón de matching

  // Usuarios
  [Routes.USUARIOS]: ["users_read"],

  // Bodegas
  [Routes.BODEGA]: ["bodegas_read"],
  [Routes.BODEGA_INFORMACION]: ["bodegas_read"],
  [Routes.CREAR_BODEGA]: ["bodegas_manage"],

  // Reservas
  [Routes.RESERVAS]: ["reservas_read"],

  // Perfil - acceso básico para usuarios autenticados
  [Routes.PERFIL]: [],

  // Página de no autorizado - acceso básico para usuarios autenticados
  [Routes.UNAUTHORIZED]: [],
};

// Función para verificar si un usuario tiene acceso a una ruta específica
export function hasRouteAccess(
  userPermissions: Permission[],
  pathname: string,
): boolean {
  return true;
  // Si el usuario tiene permiso sudo, tiene acceso a todo
  if (userPermissions.includes("sudo")) {
    return true;
  }

  // Obtener permisos requeridos para la ruta
  const requiredPermissions = getRequiredPermissionsForRoute(pathname);

  // Si no se requieren permisos específicos (como HOME o PERFIL), permitir acceso
  if (requiredPermissions.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene al menos uno de los permisos requeridos
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}

// Función para obtener permisos requeridos para una ruta
function getRequiredPermissionsForRoute(pathname: string): Permission[] {
  // Verificar rutas exactas primero
  if (routePermissionMap[pathname]) {
    return routePermissionMap[pathname];
  }

  // Verificar rutas dinámicas
  if (pathname.startsWith(Routes.VER_EVENTO)) {
    return routePermissionMap[Routes.EVENTOS] || [];
  }

  // Si no se encuentra la ruta, asumir que requiere autenticación básica
  return [];
}
