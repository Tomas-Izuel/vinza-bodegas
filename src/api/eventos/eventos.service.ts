import { fetchApiWithAuth } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { EventosResponse } from "./evento.type";

export type Evento = {
  id: string;
  nombre: string;
  sucursal: string;
  estado: "Activo" | "Finalizado" | "Suspendido";
  ultimaModificacion: string; // ISO date
};

export const getEventos = async (): Promise<EventosResponse> => {
  try {
    const response = await fetchApiWithAuth<EventosResponse>("/eventos");
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener eventos";
    errorLogger(error, "getEventos");
    throw new Error(errorMessage);
  }
};
