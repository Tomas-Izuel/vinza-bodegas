"use server";

import { errorLogger } from "@/lib/utils";
import { LoginDto, LoginResponse } from "./auth.type";
import { API_URL, AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export const login = async (data: LoginDto) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Error HTTP ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const authData = (await res.json()) as LoginResponse;
    // Verificar que el token esté presente en la respuesta
    if (!authData.token) {
      throw new Error("Token de autenticación no recibido del servidor");
    }

    cookieStore.set(
      AUTH_COOKIE_NAME,
      JSON.stringify({
        id: authData.id,
        nombre: authData.nombre,
        apellido: authData.apellido,
        email: authData.email,
        validado: authData.validado,
        bodegaId: authData.bodegaId,
        roles: authData.roles,
        token: authData.token,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      },
    );

    return authData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al iniciar sesión";
    errorLogger(error, "login");
    throw new Error(errorMessage);
  }
};
