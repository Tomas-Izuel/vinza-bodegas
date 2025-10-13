"use server";

import { revalidatePath } from "next/cache";
import { errorLogger } from "@/lib/utils";
import { fetchApiWithAuth } from "@/lib/utils.server";
import {
  UsuariosResponse,
  CrearUsuarioResponse,
  CrearUsuarioDto,
  EditarUsuarioRequest,
  EditarUsuarioResponse,
  PerfilUsuario,
  ActualizarPerfilDto,
  ActualizarPerfilResponse,
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
    const response = await fetchApiWithAuth<CrearUsuarioResponse>("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    revalidatePath("/usuarios");
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

/**
 * Obtiene el perfil del usuario autenticado
 */
export const obtenerPerfilUsuario = async (): Promise<PerfilUsuario> => {
  try {
    const response = await fetchApiWithAuth<PerfilUsuario>("/users/me");
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener el perfil del usuario";
    errorLogger(error, "obtenerPerfilUsuario");
    throw new Error(errorMessage);
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 */
export const actualizarPerfilUsuario = async (
  data: ActualizarPerfilDto,
): Promise<ActualizarPerfilResponse> => {
  try {
    // Preparar datos para enviar (remover campos vacíos)
    const dataToSend: Partial<ActualizarPerfilDto> = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
    };

    // Solo incluir fecha_nacimiento si tiene valor
    if (data.fecha_nacimiento && data.fecha_nacimiento !== "") {
      dataToSend.fecha_nacimiento = data.fecha_nacimiento;
    }

    // Solo incluir contraseña si tiene valor
    if (data.contrasena && data.contrasena !== "") {
      dataToSend.contrasena = data.contrasena;
    }

    const response = await fetchApiWithAuth<ActualizarPerfilResponse>(
      "/users/me",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      },
    );

    revalidatePath("/perfil");
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al actualizar el perfil del usuario";
    errorLogger(error, "actualizarPerfilUsuario");
    throw new Error(errorMessage);
  }
};
