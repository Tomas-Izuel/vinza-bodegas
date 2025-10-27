import {
  API_URL,
  AUTH_COOKIE_NAME,
  PERMISSIONS_COOKIE_NAME,
} from "./constants";
import { cookies } from "next/headers";
import z from "zod";
import { errorLogger } from "./utils";
import {
  AuthCookie,
  AuthCookieSchema,
  PermissionsCookie,
} from "@/api/auth/auth.type";

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
    errorLogger(error, "validateAuthCookie");
    return null;
  }
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
    const error = await response.json();
    throw new Error(error.message);
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

export async function fetchApiFormData<T>(
  url: string,
  formData: FormData,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    method: "POST",
    body: formData,
    headers: {
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function fetchApiWithAuthFormData<T>(
  url: string,
  formData: FormData,
  options: RequestInit = {},
): Promise<T> {
  const authCookie = await validateAuthCookie();
  if (!authCookie) {
    throw new Error("No auth cookie found");
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${authCookie.token}`,
      // No establecer Content-Type para FormData, el navegador lo hará automáticamente
    },
  });

  if (!response.ok) {
    // Intentar parsear como JSON, si falla, usar el texto de la respuesta
    let errorMessage = "Error desconocido";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(errorMessage);
  }

  // Intentar parsear como JSON, si falla, devolver texto
  try {
    return await response.json();
  } catch {
    return response.text() as T;
  }
}

//BUILD SEARCH PARAMS GENERICO
/**
 * Configuración para mapeo de parámetros de búsqueda
 */
export type SearchParamMappingConfig = {
  [key: string]: string;
};

/**
 * Construye URLSearchParams de forma genérica con soporte para mapeos personalizados
 * @param params - Objeto con los parámetros de búsqueda
 * @param mappings - Configuración de mapeo opcional (ej: { search: "nombre" })
 * @returns URLSearchParams configurado
 */
export const buildSearchParams = <T extends Record<string, unknown>>(
  params?: T,
  mappings: SearchParamMappingConfig = {},
): URLSearchParams => {
  const searchParams = new URLSearchParams();

  if (!params) {
    return searchParams;
  }

  Object.entries(params).forEach(([key, value]) => {
    // Si existe un mapeo para esta key, usar el valor mapeado
    const mappedKey = mappings[key] || key;

    // Solo agregar valores que no sean null, undefined o string vacío
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(mappedKey, value.toString());
    }
  });

  return searchParams;
};

/**
 * Construye una URL completa con parámetros de búsqueda
 * @param baseUrl - URL base (ej: "/eventos")
 * @param params - Objeto con los parámetros de búsqueda
 * @param mappings - Configuración de mapeo opcional
 * @returns URL completa con query string si hay parámetros
 */
export const buildApiUrl = <T extends Record<string, unknown>>(
  baseUrl: string,
  params?: T,
  mappings: SearchParamMappingConfig = {},
): string => {
  const searchParams = buildSearchParams(params, mappings);
  const queryString = searchParams.toString();

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const getAuthCookie = async () => {
  const cookieStore = await cookies();
  const authCookieValue = JSON.parse(
    cookieStore.get(AUTH_COOKIE_NAME)?.value || "{}",
  ) as AuthCookie;

  return authCookieValue;
};

export const getPermissionsCookie = async () => {
  const cookieStore = await cookies();
  const permissionsCookieValue = JSON.parse(
    cookieStore.get(PERMISSIONS_COOKIE_NAME)?.value || "{}",
  ) as PermissionsCookie;

  return permissionsCookieValue;
};
