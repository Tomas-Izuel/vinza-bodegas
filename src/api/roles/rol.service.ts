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
