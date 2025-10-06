"use server";

import { revalidatePath } from "next/cache";
import { fetchApiWithAuth } from "@/lib/utils.server";
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
    const response = await fetchApiWithAuth<EditarRolResponse>(
      `/rbac/roles/${id}`,
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
