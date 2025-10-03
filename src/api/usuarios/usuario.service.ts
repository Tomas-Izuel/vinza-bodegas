"use server";

import { errorLogger } from "@/lib/utils";
import { fetchApiWithAuth } from "@/lib/utils.server";
import { UsuariosResponse } from "./usuario.type";

export const getUsuarios = async () => {
  try {
    const response = await fetchApiWithAuth<UsuariosResponse>(`/users`);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener usuarios";
    errorLogger(error, "getUsuarios");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene los usuarios de la bodega del usuario autenticado
 */
export const getUsuariosMiBodega = async (): Promise<UsuariosResponse> => {
  try {
    const response =
      await fetchApiWithAuth<UsuariosResponse>("/users/mi-bodega");
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener usuarios de mi bodega";
    errorLogger(error, "getUsuariosMiBodega");
    throw new Error(errorMessage);
  }
};
