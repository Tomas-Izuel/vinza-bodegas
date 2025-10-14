import { Routes } from "./routes";

// This must be kept in sync with the permissions in the database
export enum Permissions {
  SUDO = "SUDO",
  BODEGAS_READ = "BODEGAS:READ",
  BODEGAS_MANAGE = "BODEGAS:MANAGE",
  BODEGAS_VALIDATE = "BODEGAS:VALIDATE",
  USERS_READ = "USERS:READ",
  USERS_MANAGE = "USERS:MANAGE",
  ROLES_READ = "ROLES:READ",
  ROLES_MANAGE = "ROLES:MANAGE",
  EVENTOS_READ = "EVENTOS:READ",
  EVENTOS_MANAGE = "EVENTOS:MANAGE",
  RESERVAS_READ = "RESERVAS:READ",
  RESERVAS_MANAGE = "RESERVAS:MANAGE",
  RECORRIDO_READ = "RECORRIDO:READ",
  RECORRIDO_MANAGE = "RECORRIDO:MANAGE",
  VALORACIONES_READ = "VALORACIONES:READ",
  VALORACIONES_MANAGE = "VALORACIONES:MANAGE",
  INSTANCIA_EVENTOS_READ = "INSTANCIA_EVENTOS:READ",
  INSTANCIA_EVENTOS_MANAGE = "INSTANCIA_EVENTOS:MANAGE",
  FAQ_MANAGE = "FAQ:MANAGE",
}

export type Permission = `${Permissions}`;

// Función para extraer todos los permisos de los roles de un usuario
export function extractPermissionsFromRoles(
  roles: Array<{ permisos: Array<{ clave: string }> }>,
): Permission[] {
  const permissions: Permission[] = [];

  roles.forEach((role) => {
    role.permisos.forEach((permiso) => {
      // La clave del permiso ya viene en el formato correcto (ej: "BODEGAS:READ")
      // Solo necesitamos verificar que existe en nuestro enum
      const permissionValue = permiso.clave as Permission;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (Object.values(Permissions).includes(permissionValue as any)) {
        permissions.push(permissionValue);
      }
    });
  });

  return permissions;
}

// Mapeo de rutas a permisos requeridos
export const routePermissionMap: Record<string, Permission[]> = {
  // Página principal - acceso básico para usuarios autenticados
  [Routes.HOME]: [],

  // Eventos
  [Routes.EVENTOS]: [Permissions.EVENTOS_READ],
  [Routes.CREAR_EVENTO]: [Permissions.EVENTOS_MANAGE],
  // Para rutas dinámicas como /eventos/[id], usaremos un patrón de matching

  // Usuarios
  [Routes.USUARIOS]: [Permissions.USERS_READ],

  // Bodegas
  [Routes.BODEGA]: [Permissions.BODEGAS_READ],
  [Routes.BODEGA_INFORMACION]: [Permissions.BODEGAS_READ],
  [Routes.CREAR_BODEGA]: [Permissions.BODEGAS_MANAGE],

  // Reservas
  [Routes.RESERVAS]: [Permissions.RESERVAS_READ],

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
  // Si el usuario tiene permiso SUDO, tiene acceso a todo
  if (userPermissions.includes(Permissions.SUDO)) {
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
