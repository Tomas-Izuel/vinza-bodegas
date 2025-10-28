import { z } from "zod";

export interface IngresoMensual {
  month: string;
  ingresos: number;
}

export interface EventoPorCategoria {
  categoria: string;
  cantidad: number;
}

export interface OcupacionSemanal {
  dia: string;
  fecha: string;
  reservasConfirmadas: number;
}

export interface EventoInstancia {
  id: number;
  eventoId: number;
  nombre: string;
  fecha: string;
  hora: string;
  estado: string;
  cupoDisponible: number;
  sucursal: string;
  categoria: string;
  precio: number;
}

export interface InstanciaEventoRelated {
  id: number;
  fecha: string;
  eventoId: number;
  recurrenciaEventoId: number;
  estadoId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  evento: {
    id: number;
    nombre: string;
    descripcion: string;
    cupo: number;
    precio: string;
    sucursalId: number;
    estadoId: number;
    categoriaId: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    sucursal: {
      id: number;
      nombre: string;
      es_principal: boolean;
      latitude: string;
      longitude: string;
      direccion: string;
      aclaraciones: string;
      bodegaId: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  };
  recurrenciaEvento: {
    id: number;
    dia: string;
    hora: string;
    fecha_desde: string;
    fecha_hasta: string;
  };
  estado: {
    id: number;
    nombre: string;
  };
  reservas: unknown[];
}

/**
 * Response from backend API /:bodegaId/metrics
 */
export interface BackendMetricsResponse {
  eventosActivos: number;
  personalActivo: number;
  puntuacionPromedio: number;
  bodegasActivas: number;
  tasaOcupacion: number;
  ingresosMensuales: number;
  historialIngresosMensuales: IngresoMensual[];
  eventosPorCategoria: EventoPorCategoria[];
  ocupacionSemanal: OcupacionSemanal[];
}

export const IngresoMensualSchema = z.object({
  month: z.string(),
  ingresos: z.number(),
});

export const EventoPorCategoriaSchema = z.object({
  categoria: z.string(),
  cantidad: z.number(),
});

export const OcupacionSemanalSchema = z.object({
  dia: z.string(),
  fecha: z.string(),
  reservasConfirmadas: z.number(),
});

export const EventoInstanciaSchema = z.object({
  id: z.number(),
  eventoId: z.number(),
  nombre: z.string(),
  fecha: z.string(),
  hora: z.string(),
  estado: z.string(),
  cupoDisponible: z.number(),
  sucursal: z.string(),
  categoria: z.string(),
  precio: z.number(),
});

export const InstanciaEventoRelatedSchema = z.object({
  id: z.number(),
  fecha: z.string(),
  eventoId: z.number(),
  recurrenciaEventoId: z.number(),
  estadoId: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  evento: z.object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    cupo: z.number(),
    precio: z.string(),
    sucursalId: z.number(),
    estadoId: z.number(),
    categoriaId: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    deleted_at: z.string().nullable(),
    sucursal: z.object({
      id: z.number(),
      nombre: z.string(),
      es_principal: z.boolean(),
      latitude: z.string(),
      longitude: z.string(),
      direccion: z.string(),
      aclaraciones: z.string(),
      bodegaId: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
      deleted_at: z.string().nullable(),
    }),
  }),
  recurrenciaEvento: z.object({
    id: z.number(),
    dia: z.string(),
    hora: z.string(),
    fecha_desde: z.string(),
    fecha_hasta: z.string(),
  }),
  estado: z.object({
    id: z.number(),
    nombre: z.string(),
  }),
  reservas: z.array(z.unknown()),
});

export const BackendMetricsResponseSchema = z.object({
  eventosActivos: z.number(),
  personalActivo: z.number(),
  puntuacionPromedio: z.number(),
  bodegasActivas: z.number(),
  tasaOcupacion: z.number(),
  ingresosMensuales: z.number(),
  historialIngresosMensuales: z.array(IngresoMensualSchema),
  eventosPorCategoria: z.array(EventoPorCategoriaSchema),
  ocupacionSemanal: z.array(OcupacionSemanalSchema),
});

export type BackendMetricsResponseType = z.infer<
  typeof BackendMetricsResponseSchema
>;
