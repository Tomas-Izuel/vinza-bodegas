import { API_URL, AUTH_COOKIE_NAME } from "./constants";
import { cookies, headers } from "next/headers";
import z from "zod";
import { errorLogger } from "./utils";
import { type Role } from "./permissions";
import { AuthCookieSchema } from "@/api/auth/auth.type";

export const validateAuthCookie = async (): Promise<z.infer<
  typeof AuthCookieSchema
> | null> => {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    const authCookieParsed = JSON.parse(authCookie?.value || "{}");
    const decodedCookie = AuthCookieSchema.safeParse(authCookieParsed);
    if (!decodedCookie.success) {
      errorLogger("Invalid auth cookie", "validateAuthCookie");
      return null;
    }

    return decodedCookie.data;
  } catch (error) {
    errorLogger("Error validating auth cookie", "validateAuthCookie");
    return null;
  }
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

export async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchApiWithAuth<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const authCookie = await validateAuthCookie();
  if (!authCookie) {
    throw new Error("No auth cookie found");
  }

  return fetchApi(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${authCookie.token}`,
    },
  });
}
