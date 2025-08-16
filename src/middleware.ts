import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/constants";
import { hasRouteAccess, type Role } from "./lib/permissions";
import { middlewareLogger } from "./lib/middleware-logger";
import { AuthCookieSchema } from "./api/auth/auth.type";

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  "/iniciar-sesion",
  "/registro",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso a rutas públicas
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Obtener la cookie de autenticación
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Si no hay cookie, redirigir al login
  if (!authCookie) {
    middlewareLogger.authFailure(pathname, "Cookie no encontrada");

    const loginUrl = new URL("/iniciar-sesion", request.url);
    middlewareLogger.redirect(pathname, loginUrl.pathname, "Sin autenticación");

    return NextResponse.redirect(loginUrl);
  }

  // Validar el contenido de la cookie
  try {
    const cookieData = JSON.parse(authCookie.value);
    const validatedData = AuthCookieSchema.parse(cookieData);

    // Verificar permisos para la ruta
    /*if (!hasRouteAccess(validatedData.role as Role, pathname)) {
      middlewareLogger.permissionDenied(
        validatedData.id,
        validatedData.role,
        pathname,
      );

      const homeUrl = new URL("/", request.url);
      middlewareLogger.redirect(pathname, homeUrl.pathname, "Sin permisos");

      return NextResponse.redirect(homeUrl);
    }*/

    // Log de autenticación exitosa solo en desarrollo
    middlewareLogger.authSuccess(
      validatedData.id.toString(),
      validatedData.roles[0].nombre,
      pathname,
    );

    // Añadir headers con información del usuario
    const response = NextResponse.next();
    response.headers.set("x-user-id", validatedData.id.toString());
    response.headers.set("x-user-role", validatedData.roles[0].nombre);
    response.headers.set("x-user-email", validatedData.email);
    response.headers.set("x-user-name", validatedData.nombre);

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    middlewareLogger.cookieError(pathname, errorMessage);

    const loginUrl = new URL("/iniciar-sesion", request.url);
    const response = NextResponse.redirect(loginUrl);

    // Limpiar la cookie inválida
    response.cookies.delete(AUTH_COOKIE_NAME);
    middlewareLogger.redirect(pathname, loginUrl.pathname, "Cookie inválida");

    return response;
  }
}

// Configurar matcher para aplicar middleware solo a rutas específicas
export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas excepto:
     * - api routes que empiecen con /api/
     * - archivos estáticos (_next/static)
     * - archivos de imagen (favicon, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
