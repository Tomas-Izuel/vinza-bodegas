"use server";
import {
  fetchApiWithAuth,
  buildApiUrl,
  getAuthCookie,
} from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { ReservasParams, ReservasResponse, Reserva } from "./reserva.type";

/**
 * Obtiene la lista de reservas con filtros y paginación
 */
export const getReservas = async (
  params?: ReservasParams,
): Promise<ReservasResponse> => {
  try {
    const authCookieValue = await getAuthCookie();
    const bodegaId = authCookieValue.bodegaId;

    // Configuración de mapeo específica para reservas
    const reservasMapping = {
      search: "cliente", // mapea "search" a "cliente" para buscar por nombre de cliente
    };

    const url = buildApiUrl(
      "/reserva",
      {
        ...params,
        bodegaId,
      },
      reservasMapping,
    );

    const response = await fetchApiWithAuth<ReservasResponse>(url);
    console.log(response);
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
