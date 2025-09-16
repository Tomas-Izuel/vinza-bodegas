"use server";
import { fetchApiWithAuth, buildApiUrl } from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import {
  EventosParams,
  EventosResponse,
  EventoStepFormType,
  CrearEventoDto,
  EventoDetalle,
  EditarEventoType,
  ActualizarEventoDto,
} from "./evento.type";

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

export async function crearEvento(data: EventoStepFormType): Promise<void> {
  try {
    // Transformar los datos del step form al formato del backend
    const backendData: CrearEventoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion || "",
      cupo: data.cupos,
      sucursalId: data.sucursalId,
      estadoId: 1, // Estado activo por defecto
      categoriaId: data.categoriaId,
      precio: data.precio,
      recurrencias: data.fechas.map((fecha) => {
        const date = new Date(fecha);
        const diasSemana = [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ];
        const dia = diasSemana[date.getDay()];

        return {
          dia,
          hora: data.hora,
        };
      }),
    };

    // Hacer POST al backend
    await fetchApiWithAuth<Evento>("/eventos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    return;
  } catch (error) {
    console.error("[EVENTOS]:", error);
    throw new Error("Error al crear el evento");
  }
}

export async function obtenerSucursales(): Promise<
  Array<{ id: number; nombre: string }>
> {
  try {
    // Simular datos de sucursales
    return [
      { id: 1, nombre: "Sucursal Centro" },
      { id: 2, nombre: "Sucursal Norte" },
      { id: 3, nombre: "Sucursal Sur" },
      { id: 4, nombre: "Sucursal Este" },
    ];
  } catch (error) {
    console.error("[EVENTOS]:", error);
    throw new Error("Error al obtener sucursales");
  }
}

export const getEvento = async (id: string): Promise<EventoDetalle> => {
  try {
    const response = await fetchApiWithAuth<EventoDetalle>(`/eventos/${id}`);
    return response;
  } catch (error) {
    console.error("[EVENTOS]:", error);
    throw new Error("Error al obtener el evento");
  }
};

export const actualizarEvento = async (
  id: string,
  data: EditarEventoType,
): Promise<EventoDetalle> => {
  try {
    // Transformar los datos al formato del backend
    const backendData: ActualizarEventoDto = {
      nombre: data.nombre,
      descripcion: data.descripcion || "",
      cupo: data.cupo.toString(),
      precio: data.precio,
      categoriaId: data.categoriaId,
      sucursalId: data.sucursalId,
    };

    const response = await fetchApiWithAuth<EventoDetalle>(`/eventos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    });

    return response;
  } catch (error) {
    console.error("[EVENTOS]:", error);
    throw new Error("Error al actualizar el evento");
  }
};

export const eliminarEvento = async (id: string): Promise<void> => {
  try {
    await fetchApiWithAuth(`/eventos/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    errorLogger(error, "eliminarEvento");
    const errorMessage =
      error instanceof Error ? error.message : "Error al eliminar el evento";
    throw new Error(errorMessage);
  }
};
