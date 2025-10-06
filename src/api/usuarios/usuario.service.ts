"use server";

import { revalidatePath } from "next/cache";
import { errorLogger } from "@/lib/utils";
import { fetchApiWithAuth } from "@/lib/utils.server";
import {
  UsuariosResponse,
  CrearUsuarioRequest,
  CrearUsuarioResponse,
  EditarUsuarioRequest,
  EditarUsuarioResponse,
} from "./usuario.type";

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

export const crearUsuario = async (
  data: CrearUsuarioRequest,
): Promise<CrearUsuarioResponse> => {
  try {
    const response = await fetchApiWithAuth<CrearUsuarioResponse>(`/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    revalidatePath("/usuarios");
    return response;
  } catch (error) {
    console.error("[USUARIOS]: Error al crear usuario:", error);
    throw error;
  }
};

export const editarUsuario = async (
  id: number,
  data: EditarUsuarioRequest,
): Promise<EditarUsuarioResponse> => {
  try {
    const response = await fetchApiWithAuth<EditarUsuarioResponse>(
      `/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    revalidatePath("/usuarios");
    return response;
  } catch (error) {
    console.error("[USUARIOS]: Error al editar usuario:", error);
    throw error;
  }
};

export const eliminarUsuario = async (id: number): Promise<void> => {
  try {
    await fetchApiWithAuth(`/users/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/usuarios");
  } catch (error) {
    console.error("[USUARIOS]: Error al eliminar usuario:", error);
    throw error;
  }
};
