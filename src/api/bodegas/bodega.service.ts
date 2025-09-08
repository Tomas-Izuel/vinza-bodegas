"use server";

import { errorLogger } from "@/lib/utils";
import { CrearBodegaDto, CrearBodegaResponse } from "./bodega.type";
import { fetchApi } from "@/lib/utils.server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { AuthCookieSchema } from "@/api/auth/auth.type";
import { redirect } from "next/navigation";
import { Routes } from "@/lib/routes";

export const crearBodega = async (data: CrearBodegaDto) => {
  try {
    const cookieStore = await cookies();

    // Crear la bodega
    const bodegaData = await fetchApi<CrearBodegaResponse>(`/bodegas`, {
      method: "POST",
      body: JSON.stringify(data),
      cache: "no-store",
    });

    // Obtener los datos actuales del usuario de la cookie
    const authCookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!authCookieValue) {
      throw new Error("No se encontraron datos de autenticación");
    }

    const currentAuthData = JSON.parse(authCookieValue);
    const parsedCurrentAuth = AuthCookieSchema.safeParse(currentAuthData);

    if (!parsedCurrentAuth.success) {
      throw new Error("Error al procesar los datos de autenticación actuales");
    }

    // Actualizar la cookie con el bodegaId
    const updatedAuthData = {
      ...parsedCurrentAuth.data,
      bodegaId: bodegaData.id,
    };

    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(updatedAuthData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    });

    // Redirigir al home después de crear la bodega exitosamente
    redirect(Routes.HOME);
  } catch (error) {
    // Permitir que las redirecciones de Next.js pasen sin ser capturadas
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return;
    }

    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la bodega";
    errorLogger(error, "crearBodega");
    throw new Error(errorMessage);
  }
};
