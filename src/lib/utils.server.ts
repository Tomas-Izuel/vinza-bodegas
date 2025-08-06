import { AUTH_COOKIE_NAME } from "./constants";
import { cookies, headers } from "next/headers";
import z from "zod";
import { errorLogger } from "./utils";
import { type Role } from "./permissions";

export const authCookieSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "user"]),
});

export const validateAuthCookie = async (): Promise<
  boolean | z.infer<typeof authCookieSchema>
> => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!authCookie) {
    errorLogger("No auth cookie found", "validateAuthCookie");
    return false;
  }

  const decodedCookie = authCookieSchema.safeParse(authCookie.value);
  if (!decodedCookie.success) {
    errorLogger("Invalid auth cookie", "validateAuthCookie");
    return false;
  }

  return decodedCookie.data;
};

/**
 * Obtiene la información del usuario desde los headers añadidos por el middleware
 * Útil para usar en server components sin tener que parsear la cookie
 */
export const getCurrentUser = async (): Promise<{
  id: string;
  email: string;
  name: string;
  role: Role;
} | null> => {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");
    const userEmail = headersList.get("x-user-email");
    const userName = headersList.get("x-user-name");
    const userRole = headersList.get("x-user-role");

    if (!userId || !userEmail || !userName || !userRole) {
      return null;
    }

    return {
      id: userId,
      email: userEmail,
      name: userName,
      role: userRole as Role,
    };
  } catch {
    errorLogger("Error getting current user from headers", "getCurrentUser");
    return null;
  }
};

/**
 * Verifica si el usuario actual está autenticado
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export const hasRole = async (role: Role): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === role;
};

/**
 * Verifica si el usuario actual es administrador
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole("admin");
};
