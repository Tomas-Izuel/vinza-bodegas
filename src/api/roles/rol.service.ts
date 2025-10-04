"use server";

import { fetchApiWithAuth } from "@/lib/utils.server";
import {
  RolesResponse,
  PermisosResponse,
  CrearRolRequest,
  CrearRolResponse,
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
    const response = await fetchApiWithAuth<CrearRolResponse>(`/rbac/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    console.error("[ROLES]: Error al crear rol:", error);
    throw error;
  }
}

export async function editarRol(
  id: number,
  data: CrearRolRequest,
): Promise<CrearRolResponse> {
  try {
    const response = await fetchApiWithAuth<CrearRolResponse>(
      `/rbac/roles/${id}`,
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
    console.error("[ROLES]: Error al editar rol:", error);
    throw error;
  }
}

export async function eliminarRol(id: number): Promise<void> {
  try {
    await fetchApiWithAuth(`/rbac/roles/${id}`, {
      method: "DELETE",
    });
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
