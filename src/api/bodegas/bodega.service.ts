"use server";

import { errorLogger } from "@/lib/utils";
import {
  CrearBodegaDto,
  CrearBodegaResponse,
  BodegaDetalle,
  EditarBodegaType,
  SucursalesSearchParams,
} from "./bodega.type";
import { fetchApi, fetchApiWithAuth, buildApiUrl } from "@/lib/utils.server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { AuthCookie, AuthCookieSchema } from "@/api/auth/auth.type";

export const crearBodega = async (data: CrearBodegaDto) => {
  try {
    const cookieStore = await cookies();

    // Crear la bodega
    const bodegaData = await fetchApiWithAuth<CrearBodegaResponse>(`/bodegas`, {
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

    return bodegaData;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la bodega";
    errorLogger(error, "crearBodega");
    throw new Error(errorMessage);
  }
};

export const getBodegaDetalle = async (
  params?: SucursalesSearchParams,
): Promise<BodegaDetalle> => {
  try {
    const cookieStore = await cookies();
    const authCookieValue = JSON.parse(
      cookieStore.get(AUTH_COOKIE_NAME)?.value || "{}",
    ) as AuthCookie;

    const url = buildApiUrl(
      `/bodegas/${authCookieValue.bodegaId}`,
      params as Record<string, unknown>,
    );
    const response = await fetchApiWithAuth<BodegaDetalle>(url);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener la información de la bodega";
    errorLogger(error, "[BODEGA]: getBodegaDetalle");
    throw new Error(errorMessage);
  }
};

export const actualizarBodega = async (
  data: EditarBodegaType,
): Promise<BodegaDetalle> => {
  try {
    const cookieStore = await cookies();
    const authCookieValue = JSON.parse(
      cookieStore.get(AUTH_COOKIE_NAME)?.value || "{}",
    ) as AuthCookie;
    const response = await fetchApiWithAuth<BodegaDetalle>(
      `/bodegas/${authCookieValue.bodegaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al actualizar la bodega";
    errorLogger(error, "[BODEGA]: actualizarBodega");
    throw new Error(errorMessage);
  }
};
