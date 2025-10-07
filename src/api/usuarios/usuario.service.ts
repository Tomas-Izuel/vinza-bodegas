"use server";

import { revalidatePath } from "next/cache";
import { errorLogger } from "@/lib/utils";
import { fetchApiWithAuth } from "@/lib/utils.server";
import {
  UsuariosResponse,
  CrearUsuarioRequest,
  CrearUsuarioResponse,
  CrearUsuarioDto,
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

/**
 * Crea un nuevo usuario en la bodega del administrador autenticado
 */
export const crearUsuario = async (
  data: CrearUsuarioDto,
): Promise<CrearUsuarioResponse> => {
  try {
    console.log("Datos a enviar:", data);
    const response = await fetchApiWithAuth<CrearUsuarioResponse>("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    revalidatePath("/usuarios");
    console.log("Respuesta exitosa:", response);
    return response;
  } catch (error) {
    console.error("Error detallado:", error);
    errorLogger(error, "crearUsuario");

    // Mejorar el manejo de errores para obtener más información
    if (error instanceof Error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    } else {
      throw new Error("Error desconocido al crear usuario");
    }
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
