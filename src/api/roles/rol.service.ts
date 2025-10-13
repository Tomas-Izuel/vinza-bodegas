"use server";

import { revalidatePath } from "next/cache";
import { fetchApiWithAuth, getAuthCookie } from "@/lib/utils.server";
import {
  RolesResponse,
  PermisosResponse,
  CrearRolRequest,
  CrearRolResponse,
  EditarRolRequest,
  EditarRolResponse,
} from "./rol.type";

export async function obtenerRoles(): Promise<RolesResponse> {
  try {
    const response = await fetchApiWithAuth<RolesResponse>(`/rbac/roles`);

    return response;
  } catch (error) {
    console.error("[ROLES]: Error al obtener roles:", error);
    throw error;
  }
}

/**
 * Obtiene roles de la bodega del usuario autenticado + roles globales
 */
export async function obtenerRolesMiBodega(): Promise<RolesResponse> {
  try {
    const response = await fetchApiWithAuth<RolesResponse>(
      `/rbac/roles/mi-bodega`,
    );
    return response;
  } catch (error) {
    console.error("[ROLES]: Error al obtener roles de mi bodega:", error);
    throw error;
  }
}

export async function obtenerPermisos(): Promise<PermisosResponse> {
  try {
    const response =
      await fetchApiWithAuth<PermisosResponse>(`/rbac/permissions`);

    return response;
  } catch (error) {
    console.error("[ROLES]: Error al obtener permisos:", error);
    throw error;
  }
}

export async function crearRol(
  data: CrearRolRequest,
): Promise<CrearRolResponse> {
  try {
    // Obtener el bodegaId del usuario autenticado
    const authCookie = await getAuthCookie();
    const bodegaId = authCookie.bodegaId;

    // Preparar los datos con el bodegaId
    const dataWithBodega = {
      ...data,
      bodegaId: bodegaId,
    };

    const response = await fetchApiWithAuth<CrearRolResponse>(`/rbac/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataWithBodega),
    });

    revalidatePath("/usuarios");
    return response;
  } catch (error) {
    console.error("[ROLES]: Error al crear rol:", error);
    throw error;
  }
}

export async function editarRol(
  id: number,
  data: EditarRolRequest,
): Promise<EditarRolResponse> {
  try {
    // Obtener el bodegaId del usuario autenticado
    const authCookie = await getAuthCookie();
    const bodegaId = authCookie.bodegaId;

    // Preparar los datos con el bodegaId
    const dataWithBodega = {
      ...data,
      bodegaId: bodegaId,
    };

    const response = await fetchApiWithAuth<EditarRolResponse>(
      `/rbac/roles/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithBodega),
      },
    );

    revalidatePath("/usuarios");
    return response;
  } catch (error) {
    console.error("[ROLES]: Error al editar rol:", error);
    throw error;
  }
}

export async function eliminarRol(id: number): Promise<void> {
  try {
    await fetchApiWithAuth(`/rbac/roles/${id}`, {
      method: "DELETE",
    });

    revalidatePath("/usuarios");
  } catch (error) {
    console.error("[ROLES]: Error al eliminar rol:", error);
    throw error;
  }
}

export async function obtenerRolPorId(id: number): Promise<CrearRolResponse> {
  try {
    const response = await fetchApiWithAuth<CrearRolResponse>(
      `/rbac/roles/${id}`,
    );
    return response;
  } catch (error) {
    console.error("[ROLES]: Error al obtener rol por ID:", error);
    throw error;
  }
}
