import z from "zod";
import { CommonSearchParams, Meta } from "../common.type";

export type EventosResponse = {
  items: Evento[];
  meta: Meta;
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
  categoria: unknown; // <- sustituir con un type específico si lo tenés
  estado: unknown; // idem
  sucursal: unknown; // idem
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
