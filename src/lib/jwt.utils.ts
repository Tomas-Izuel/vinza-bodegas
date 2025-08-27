/**
 * Utilidades para manejo de JWT tokens
 */

export interface JWTPayload {
  user: number;
  role: number;
  iat: number;
  exp: number;
}

/**
 * Decodifica un JWT token sin verificar la firma
 * @param token - El token JWT a decodificar
 * @returns El payload decodificado o null si es inválido
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens tienen 3 partes separadas por puntos
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decodificar la segunda parte (payload) que está en base64url
    const payload = parts[1];
    // Reemplazar caracteres especiales de base64url
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // Agregar padding si es necesario
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);

    return parsed as JWTPayload;
  } catch (error) {
    console.error("[JWT]: Error decodificando token:", error);
    return null;
  }
}

/**
 * Verifica si un JWT token ha expirado
 * @param token - El token JWT a verificar
 * @returns true si el token ha expirado, false si es válido
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) {
    return true; // Si no se puede decodificar, considerarlo expirado
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Obtiene el tiempo de expiración de un JWT token
 * @param token - El token JWT
 * @returns Timestamp de expiración en segundos o null si es inválido
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  return payload?.exp || null;
}

/**
 * Obtiene el tiempo restante hasta la expiración del token
 * @param token - El token JWT
 * @returns Tiempo restante en segundos o null si es inválido
 */
export function getTimeUntilExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
}
