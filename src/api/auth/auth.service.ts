"use server";

import { errorLogger } from "@/lib/utils";
import {
  AuthCookieSchema,
  LoginDto,
  LoginResponse,
  RegisterDto,
  ValidateAccountDto,
} from "./auth.type";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/utils.server";
import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export const login = async (data: LoginDto) => {
  try {
    const cookieStore = await cookies();

    const authData = await fetchApi<LoginResponse>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        origin: "BODEGAS",
      }),
      cache: "no-store",
    });

    if (!authData.validado) {
      redirect(Routes.VALIDATE_ACCOUNT);
    }

    // Verificar que el token esté presente en la respuesta
    if (!authData.token) {
      throw new Error("Token de autenticación no recibido del servidor");
    }

    const authCookie = AuthCookieSchema.parse(authData);

    // Caso 2: El parseo fue exitoso pero falta bodegaId (usuario sin bodega)
    if (!authCookie.bodegaId) {
      // Guardamos los datos parciales del usuario en la cookie para crear la bodega
      cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authCookie), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      });

      redirect(Routes.CREAR_BODEGA);
    }

    // Caso 3: El parseo fue exitoso y tiene bodegaId (flujo normal)
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authCookie), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    return authData;
  } catch (error) {
    // Permitir que las redirecciones de Next.js pasen sin ser capturadas
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Error al iniciar sesión";
    errorLogger(error, "login");
    throw new Error(errorMessage);
  }
};

export const register = async (data: RegisterDto) => {
  try {
    const registerData = await fetchApi<LoginResponse>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return registerData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al registrar usuario";
    errorLogger(error, "register");
    throw new Error(errorMessage);
  }
};

export const validateAccount = async (data: ValidateAccountDto) => {
  try {
    const validateData = await fetchApi<{ message: string }>(`/auth/validate`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    return validateData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al validar la cuenta";
    errorLogger(error, "validateAccount");
    throw new Error(errorMessage);
  }
};
