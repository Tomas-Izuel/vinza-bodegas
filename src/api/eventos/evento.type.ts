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
export const EventoFiltersSchema = z
  .object({
    sucursalId: z.coerce.number().optional(),
    categoriaId: z.coerce.number().optional(),
    estadoId: z.coerce.number().optional(),
    bodegaId: z.coerce.number().optional(),
    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional(),
    precioMaximo: z.coerce
      .number()
      .positive({
        message: "El precio máximo debe ser un valor positivo",
      })
      .optional(),
    puntuacionMinima: z.coerce
      .number()
      .positive({
        message: "La puntuación mínima debe ser un valor positivo",
      })
      .max(5, {
        message: "La puntuación mínima no puede ser mayor a 5",
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
  );

export type EventoFiltersType = z.infer<typeof EventoFiltersSchema>;

export type EventosParams = CommonSearchParams & EventoFiltersType;
