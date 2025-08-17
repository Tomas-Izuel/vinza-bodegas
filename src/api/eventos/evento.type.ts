import z from "zod";
import { CommonSearchParams, Meta } from "../common.type";
import { Sucursal } from "../sucursales/sucursal.type";

export enum EstadosEvento {
  ACTIVO = "activo",
  FINALIZADO = "finalizado",
  SUSPENDIDO = "suspendido",
  INACTIVO = "inactivo",
}

export type EventosResponse = {
  items: Evento[];
  meta: Meta;
};

export type CategoriaEvento = {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type EstadoEvento = {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: string;
  sucursalId: number;
  estadoId: number;
  categoriaId: number;
  created_at: string; // ISO date
  updated_at: string; // ISO date
  deleted_at: string | null;
  categoria: CategoriaEvento; // <- sustituir con un type específico si lo tenés
  estado: EstadoEvento; // idem
  sucursal: Sucursal; // idem
  recurrencias: unknown[]; // idem
};

// Schema para los filtros de eventos basado en EventosParams
export const EventoFiltersSchema = z.object({
  sucursalId: z.coerce.number().optional(),
  categoriaId: z.coerce.number().optional(),
  estadoId: z.coerce.number().optional(),
  bodegaId: z.coerce.number().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  precioMaximo: z.coerce.number().optional(),
  puntuacionMinima: z.coerce.number().optional(),
});

export type EventoFiltersType = z.infer<typeof EventoFiltersSchema>;

export type EventosParams = CommonSearchParams & EventoFiltersType;
