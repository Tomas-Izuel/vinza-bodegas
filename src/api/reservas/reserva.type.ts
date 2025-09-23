import { z } from "zod";
import { Meta, CommonSearchParams } from "../common.type";

// Tipos base para reserva
export interface Reserva {
  id: number;
  precio: string;
  cantidadGente: number;
  instanciaEventoId: number;
  recorridoId: number;
  created_at: string;
  updated_at: string;
  instanciaEvento: {
    id: number;
    fecha: string;
    evento: {
      id: number;
      nombre: string;
    };
  };
  estados: EstadoReserva[];
}

export interface EstadoReserva {
  id: number;
  nombre: string;
  created_at: string;
}

// Estados de reserva disponibles
export enum EstadosReserva {
  CONFIRMADO = "confirmado",
  PENDIENTE = "pendiente",
  CANCELADA = "cancelada",
}

// Parámetros para filtros de reservas
export interface ReservasParams extends CommonSearchParams {
  search?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  estadoId?: number;
  eventoId?: number;
  precioMinimo?: number;
  precioMaximo?: number;
  cantidadGente?: number;
}

// Respuesta paginada del backend
export interface ReservasResponse {
  items: Reserva[];
  meta: Meta;
}

// Schema para validación de filtros
export const ReservaFiltersSchema = z
  .object({
    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional(),
    estadoId: z.coerce.number().optional(),
    eventoId: z.coerce.number().optional(),
    precioMinimo: z.coerce
      .number()
      .positive({
        message: "El precio mínimo debe ser un valor positivo",
      })
      .optional(),
    precioMaximo: z.coerce
      .number()
      .positive({
        message: "El precio máximo debe ser un valor positivo",
      })
      .optional(),
    cantidadGente: z.coerce
      .number()
      .positive({
        message: "La cantidad de gente debe ser un valor positivo",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.fechaDesde && data.fechaHasta) {
        const fechaDesde = new Date(data.fechaDesde);
        const fechaHasta = new Date(data.fechaHasta);
        return fechaDesde <= fechaHasta;
      }
      return true;
    },
    {
      message: "La fecha desde no puede ser mayor a la fecha hasta",
      path: ["fechaDesde"],
    },
  )
  .refine(
    (data) => {
      if (data.precioMinimo && data.precioMaximo) {
        return data.precioMinimo <= data.precioMaximo;
      }
      return true;
    },
    {
      message: "El precio mínimo no puede ser mayor al precio máximo",
      path: ["precioMinimo"],
    },
  );

export type ReservaFiltersType = z.infer<typeof ReservaFiltersSchema>;
