"use server";

import { errorLogger } from "@/lib/utils";
import { CrearBodegaDto, CrearBodegaResponse } from "./bodega.type";
import { fetchApi } from "@/lib/utils.server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { AuthCookieSchema } from "@/api/auth/auth.type";

export const crearBodega = async (data: CrearBodegaDto) => {
  try {
    const cookieStore = await cookies();

    // Crear la bodega
    const bodegaData = await fetchApi<CrearBodegaResponse>(`/bodegas`, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        roles: [],
        users: [],
      }),
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

    return bodegaData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la bodega";
    errorLogger(error, "crearBodega");
    throw new Error(errorMessage);
  }
};
