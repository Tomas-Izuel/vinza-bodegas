"use server";

import { fetchApiWithAuth } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import { EstadoEvento } from "../eventos/evento.type";
import { EstadoReserva } from "../reservas/reserva.type";

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

export const getEstadosReservas = async (): Promise<EstadoReserva[]> => {
  try {
    const response = await fetchApiWithAuth<{ items: EstadoReserva[] }>(
      "/estado-reservas",
    );
    return response.items;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener estados de reservas";
    errorLogger(error, "getEstadosReservas");
    throw new Error(errorMessage);
  }
};
