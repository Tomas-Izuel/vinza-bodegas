"use server";
import {
  fetchApiWithAuth,
  fetchApiWithAuthFormData,
  buildApiUrl,
} from "@/lib/utils.server";
import { errorLogger } from "@/lib/utils";
import {
  EventosParams,
  EventosResponse,
  EventoStepFormType,
  EventoDetalle,
  EditarEventoType,
  ActualizarEventoDto,
  ReservasInstanciaResponse,
} from "./evento.type";
import { Reserva } from "../reservas/reserva.type";

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
    console.log("data", data);
    // Crear FormData para enviar archivos multimedia
    const formData = new FormData();

    // Agregar campos básicos del evento
    formData.append("nombre", data.nombre);
    formData.append("descripcion", data.descripcion || "");
    formData.append("cupo", data.cupos.toString());
    formData.append("sucursalId", data.sucursalId.toString());
    formData.append("estadoId", "2"); // Estado activo por defecto (ID 2 = ACTIVO en la BD)
    formData.append("categoriaId", data.categoriaId.toString());
    formData.append("precio", data.precio.toString());
    formData.append("duracion", data.duracion.toString());

    // Agregar recurrencias como JSON string
    let recurrencias: Array<{
      dia: string;
      hora: string;
    }> = [];

    if (data.tipoEvento === "unica") {
      // Para eventos únicos, usar las fechas seleccionadas
      recurrencias =
        data.fechas && data.fechas.length > 0
          ? data.fechas.map((fecha) => {
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
                fecha_unica: date.toISOString(),
                dia,
                hora: data.hora,
              };
            })
          : [];
    } else if (data.tipoEvento === "recurrente") {
      // Para eventos recurrentes, usar los días de la semana seleccionados
      recurrencias =
        data.diasSemana && data.diasSemana.length > 0
          ? data.diasSemana.map((dia) => ({
              dia,
              hora: data.hora,
              fecha_desde: data.fechaDesde || null,
              fecha_hasta: data.fechaHasta || null,
            }))
          : [];
    }

    formData.append("recurrencias", JSON.stringify(recurrencias));

    // Agregar campos específicos para eventos recurrentes
    if (data.tipoEvento === "recurrente") {
      formData.append("recurrente", "true");
      if (data.fechaDesde) {
        formData.append("fechaDesde", data.fechaDesde);
      }
      if (data.fechaHasta) {
        formData.append("fechaHasta", data.fechaHasta);
      }
    } else {
      formData.append("recurrente", "false");
    }

    // Agregar archivos multimedia
    if (data.imagenes && data.imagenes.length > 0) {
      // Agregar todas las imágenes
      data.imagenes.forEach((imagen) => {
        formData.append("multimedia", imagen);
      });

      // Agregar imagen de portada (por defecto la primera, o la seleccionada)
      const imagenPortada = data.imagenPortada || data.imagenes[0]?.name || "";
      formData.append("multimediaPortada", imagenPortada);
    }

    // Convertir tipoEvento a eventoUnico: "unica" = true, "recurrente" = false
    const eventoUnico = data.tipoEvento === "unica";
    formData.set("eventoUnico", eventoUnico ? "true" : "false");

    // Hacer POST al backend con FormData
    await fetchApiWithAuthFormData("/eventos", formData);

    return;
  } catch (error) {
    console.error("[EVENTOS]:", error);
    throw error;
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
  data: FormData,
): Promise<{ success: boolean; data?: EventoDetalle; error?: string }> => {
  try {
    const response = await fetchApiWithAuthFormData<EventoDetalle>(
      `/eventos/${id}`,
      data,
      {
        method: "PUT",
        cache: "no-store",
      },
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("[EVENTOS]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al actualizar el evento";
    return { success: false, error: errorMessage };
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

/**
 * Obtiene los eventos de la bodega del usuario autenticado
 */
export const getEventosMiBodega = async (
  params?: EventosParams,
): Promise<EventosResponse> => {
  try {
    const eventosMapping = {
      search: "nombre", // mapea "search" a "nombre"
    };

    const url = buildApiUrl("/eventos/mi-bodega", params, eventosMapping);
    const response = await fetchApiWithAuth<EventosResponse>(url);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener eventos de mi bodega";
    errorLogger(error, "getEventosMiBodega");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene las instancias de un evento específico
 */
export const getInstanciasEvento = async (
  eventoId: string,
  params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    estadoId?: number;
    recurrenciaEventoId?: number;
    page?: number;
    limit?: number;
    orderBy?: string;
  },
): Promise<
  Array<{
    id: number;
    fecha: string;
    reservas: Reserva[];
    estado: string;
  }>
> => {
  try {
    const url = buildApiUrl(`/eventos/${eventoId}/instancias`, params);
    const response = await fetchApiWithAuth<{
      items: Array<{
        id: number;
        eventoId: number;
        fecha: string;
        hora: string;
        estado: string | { nombre: string; id: number };
        cupoDisponible: number;
        reservas: Reserva[];
        recurrenciaEvento: {
          id: number;
          dia: string;
          hora: string;
          fecha_desde: string;
          fecha_hasta: string;
        };
      }>;
      meta: {
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
      };
    }>(url);

    // Transformar la respuesta del backend al formato esperado por el componente
    const transformedData = response.items.map((instancia) => {
      const estadoTransformado =
        typeof instancia.estado === "string"
          ? instancia.estado.toLowerCase()
          : instancia.estado?.nombre?.toLowerCase() || "activo";

      return {
        id: instancia.id,
        fecha: instancia.fecha,
        reservas: instancia.reservas, // Usar cantidadReservas si está disponible, sino 0
        estado: estadoTransformado,
      };
    });

    return transformedData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener instancias del evento";
    errorLogger(error, "getInstanciasEvento");
    throw new Error(errorMessage);
  }
};

/**
 * Suspende una instancia de evento
 */
export const suspenderInstancia = async (
  instanciaId: number,
): Promise<{
  message: string;
  instanciaId: number;
  estado: string;
}> => {
  try {
    const response = await fetchApiWithAuth<{
      message: string;
      instanciaId: number;
      estado: string;
    }>(`/eventos/instancias/${instanciaId}/suspender`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al suspender la instancia";
    errorLogger(error, "suspenderInstancia");
    throw new Error(errorMessage);
  }
};

/**
 * Reactiva una instancia de evento
 */
export const reactivarInstancia = async (
  instanciaId: number,
): Promise<{
  message: string;
  instanciaId: number;
  estado: string;
}> => {
  try {
    const response = await fetchApiWithAuth<{
      message: string;
      instanciaId: number;
      estado: string;
    }>(`/eventos/instancias/${instanciaId}/reactivar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al reactivar la instancia";
    errorLogger(error, "reactivarInstancia");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene las reservas de una instancia de evento
 */
export const getReservasInstancia = async (
  instanciaId: string,
): Promise<ReservasInstanciaResponse> => {
  try {
    const url = buildApiUrl(`/eventos/instancias/${instanciaId}/reservas`);
    const response = await fetchApiWithAuth<ReservasInstanciaResponse>(url, {
      method: "GET",
    });
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener las reservas";
    errorLogger(error, "getReservasInstancia");
    throw new Error(errorMessage);
  }
};
