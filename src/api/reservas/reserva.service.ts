"use server";
import { fetchApiWithAuth, buildApiUrl } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { ReservasParams, ReservasResponse, Reserva } from "./reserva.type";

/**
 * Obtiene la lista de reservas con filtros y paginación
 */
export const getReservas = async (
  params?: ReservasParams,
): Promise<ReservasResponse> => {
  try {
    // Configuración de mapeo específica para reservas
    const reservasMapping = {
      search: "recorrido.user", // mapea "search" a "recorrido.user" para buscar por nombre de cliente
    };

    const url = buildApiUrl(
      "/reserva/mi-bodega",
      params as Record<string, unknown>,
      reservasMapping,
    );

    const response = await fetchApiWithAuth<ReservasResponse>(url);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener reservas";
    errorLogger(error, "getReservas");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene una reserva específica por ID
 */
export const getReservaPorId = async (id: string): Promise<Reserva> => {
  try {
    const response = await fetchApiWithAuth<Reserva>(`/reserva/${id}`);
    return response;
  } catch (error) {
    errorLogger(error, "getReservaPorId");
    throw new Error("Error al obtener la reserva");
  }
};

/**
 * Cancela una reserva específica por ID
 */
export const cancelarReserva = async (id: string): Promise<Reserva> => {
  try {
    const response = await fetchApiWithAuth<Reserva>(
      `/reserva/${id}/cancelar-forzado`,
      {
        method: "PUT",
      },
    );
    return response;
  } catch (error) {
    errorLogger(error, "cancelarReserva");
    throw new Error("Error al cancelar la reserva");
  }
};
