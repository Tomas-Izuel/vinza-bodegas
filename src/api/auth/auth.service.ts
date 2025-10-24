"use server";

import { errorLogger } from "@/lib/utils";
import {
  AuthCookieSchema,
  LoginDto,
  LoginResponse,
  RegisterResponse,
  RegisterDto,
  ValidateAccountDto,
  RequestValidationDto,
  RecoveryPasswordDto,
  ResetPasswordDto,
} from "./auth.type";
import { AUTH_COOKIE_NAME, PERMISSIONS_COOKIE_NAME } from "@/lib/constants";
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

    // Cookie principal con información básica del usuario (sin roles)
    const mainCookie = {
      id: authCookie.id,
      nombre: authCookie.nombre,
      apellido: authCookie.apellido,
      email: authCookie.email,
      validado: authCookie.validado,
      bodegaId: authCookie.bodegaId,
      token: authCookie.token,
      bodega: authCookie.bodega,
      // Array vacío para roles para mantener compatibilidad con AuthCookieSchema
      roles: [],
    };

    // Cookie separada para roles y permisos
    const permissionsCookie = {
      roles: authCookie.roles?.map((role) => ({
        id: role.id,
        nombre: role.nombre,
        permisos: role.permisos?.map((permiso) => ({
          clave: permiso.clave,
        })),
      })),
    };

    console.log("Setting main cookie:", AUTH_COOKIE_NAME);
    console.log("Setting permissions cookie:", PERMISSIONS_COOKIE_NAME);

    // Guardar cookie principal
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(mainCookie), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    // Guardar cookie de permisos
    cookieStore.set(
      PERMISSIONS_COOKIE_NAME,
      JSON.stringify(permissionsCookie),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      },
    );

    console.log("Both cookies set successfully");

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
    const cookieStore = await cookies();

    const registerData = await fetchApi<RegisterResponse>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const registerCookie = AuthCookieSchema.parse(registerData);

    const mainCookie = {
      id: registerCookie.id,
      nombre: registerCookie.nombre,
      apellido: registerCookie.apellido,
      email: registerCookie.email,
      validado: registerCookie.validado,
      bodegaId: registerCookie.bodegaId,
      token: registerCookie.token,
      bodega: null,
      roles: [],
    };

    const permissionsCookie = {
      roles: registerCookie.roles?.map((role) => ({
        id: role.id,
        nombre: role.nombre,
        permisos: role.permisos?.map((permiso) => ({
          clave: permiso.clave,
        })),
      })),
    };

    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(mainCookie), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    cookieStore.set(
      PERMISSIONS_COOKIE_NAME,
      JSON.stringify(permissionsCookie),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      },
    );

    return true;
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

    // Actualizar la cookie para marcar el usuario como validado
    const cookieStore = await cookies();
    const authCookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (authCookieValue) {
      const currentAuthData = JSON.parse(authCookieValue);
      const parsedCurrentAuth = AuthCookieSchema.safeParse(currentAuthData);

      if (parsedCurrentAuth.success) {
        // Actualizar la cookie con validado: true
        const updatedAuthData = {
          ...parsedCurrentAuth.data,
          validado: "true", // Marcar como validado
        };

        cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(updatedAuthData), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 días
          path: "/",
        });
      }
    }

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

export const recoveryPassword = async (data: RecoveryPasswordDto) => {
  try {
    const recoveryData = await fetchApi<{ message: string }>(
      `/auth/recovery-password`,
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    return recoveryData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al solicitar recuperación";
    errorLogger(error, "recoveryPassword");
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (data: ResetPasswordDto) => {
  try {
    const resetData = await fetchApi<{ message: string }>(
      `/auth/reset-password`,
      {
        method: "POST",
        body: JSON.stringify(data),
        cache: "no-store",
      },
    );

    return resetData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al resetear la contraseña";
    errorLogger(error, "resetPassword");
    throw new Error(errorMessage);
  }
};
