import { fetchApiWithAuth, buildApiUrl } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { EventosParams, EventosResponse } from "./evento.type";

export type Evento = {
  id: string;
  nombre: string;
  sucursal: string;
  estado: "Activo" | "Finalizado" | "Suspendido";
  ultimaModificacion: string; // ISO date
};

export const getEventos = async (
  params?: EventosParams,
): Promise<EventosResponse> => {
  try {
    // Configuración de mapeo específica para eventos
    const eventosMapping = {
      search: "nombre", // mapea "search" a "nombre"
    };

    const url = buildApiUrl("/eventos", params, eventosMapping);
    const response = await fetchApiWithAuth<EventosResponse>(url);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener eventos";
    errorLogger(error, "getEventos");
    throw new Error(errorMessage);
  }
};
