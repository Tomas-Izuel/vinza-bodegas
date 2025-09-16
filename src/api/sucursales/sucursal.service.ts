"use server";

import { fetchApiWithAuth } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { Sucursal, EditarSucursalType } from "./sucursal.type";

export const getSucursales = async (): Promise<Sucursal[]> => {
  try {
    const response = await fetchApiWithAuth<Sucursal[]>("/sucursales");
    console.log(response);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener sucursales";
    errorLogger(error, "getSucursales");
    throw new Error(errorMessage);
  }
};

export const getSucursalById = async (id: string): Promise<Sucursal> => {
  try {
    const response = await fetchApiWithAuth<Sucursal>(`/sucursales/${id}`);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener la sucursal";
    errorLogger(error, "[SUCURSAL]: getSucursalById");
    throw new Error(errorMessage);
  }
};

export const crearSucursal = async (
  data: Omit<Sucursal, "id" | "created_at">,
): Promise<Sucursal> => {
  try {
    const response = await fetchApiWithAuth<Sucursal>("/sucursales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la sucursal";
    errorLogger(error, "crearSucursal");
    throw new Error(errorMessage);
  }
};

export const actualizarSucursal = async (
  id: string,
  data: EditarSucursalType,
): Promise<Sucursal> => {
  try {
    const response = await fetchApiWithAuth<Sucursal>(`/sucursales/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al actualizar la sucursal";
    errorLogger(error, "[SUCURSAL]: actualizarSucursal");
    throw new Error(errorMessage);
  }
};

export const eliminarSucursal = async (id: number): Promise<void> => {
  try {
    await fetchApiWithAuth(`/sucursales/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al eliminar la sucursal";
    errorLogger(error, "eliminarSucursal");
    throw new Error(errorMessage);
  }
};
