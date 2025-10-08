"use server";

import { errorLogger } from "@/lib/utils";
import {
  AuthCookieSchema,
  LoginDto,
  LoginResponse,
  RegisterDto,
  ValidateAccountDto,
  RequestValidationDto,
} from "./auth.type";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { fetchApi } from "@/lib/utils.server";

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

    // Verificar que el token esté presente en la respuesta
    if (!authData.token) {
      throw new Error("Token de autenticación no recibido del servidor");
    }

    const authCookie = AuthCookieSchema.parse(authData);

    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authCookie), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    return authData;
  } catch (error) {
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

export const requestValidation = async (data: RequestValidationDto) => {
  try {
    const requestData = await fetchApi<{ message: string }>(
      `/auth/request-validation`,
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    return requestData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al reenviar el código";
    errorLogger(error, "requestValidation");
    throw new Error(errorMessage);
  }
};
