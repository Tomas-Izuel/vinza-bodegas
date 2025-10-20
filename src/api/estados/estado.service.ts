"use server";

import { fetchApiWithAuth } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { EstadoEvento } from "../eventos/evento.type";

export const getEstadosEventos = async (): Promise<EstadoEvento[]> => {
  try {
    const response = await fetchApiWithAuth<{ items: EstadoEvento[] }>(
      "/estado-eventos",
    );
    return response.items;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener estados de eventos";
    errorLogger(error, "getEstadosEventos");
    throw new Error(errorMessage);
  }
};
