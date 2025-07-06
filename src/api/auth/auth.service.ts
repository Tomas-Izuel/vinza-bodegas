"use server";

import { errorLogger } from "@/lib/utils";
import { LoginDto } from "./auth.type";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export const login = async (data: LoginDto) => {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || "Error al iniciar sesión";
    errorLogger(new Error(errorMessage), "login");
    throw new Error(errorMessage);
  }

  const authData = await res.json();

  // Configurar la cookie con opciones de seguridad
  cookieStore.set(AUTH_COOKIE_NAME, authData.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 días
    path: "/",
  });

  return authData;
};
