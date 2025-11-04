import { z } from "zod";
import { Sucursal } from "../sucursales/sucursal.type";

export interface Multimedia {
  id: number;
  url: string;
  es_portada: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bodegaId: number;
  tipoId: number | null;
}

export type Bodega = {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  validada: string | null;
  telefono: string;
};

export interface BodegaDetalle extends Bodega {
  sucursales: Sucursal[];
  multimedia: Multimedia[];
}

export interface SucursalesSearchParams {
  search?: string;
}

export const BodegaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
  validada: z.string().nullable().optional(),
});

export const EditarBodegaSchema = z.object({
  nombre: z
    .string({
      message: "El nombre de la bodega es requerido",
    })
    .min(1, "El nombre de la bodega es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string({
      message: "La descripción es requerida",
    })
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  telefono: z
    .string({
      message: "El teléfono es requerido",
    })
    .min(1, "El teléfono es requerido")
    .max(11, "El teléfono no puede exceder 11 caracteres")
    .optional(),
});

export type EditarBodegaType = z.infer<typeof EditarBodegaSchema>;

export const CrearBodegaSchema = z.object({
  nombre: z
    .string({
      message: "El nombre de la bodega es requerido",
    })
    .min(1, "El nombre de la bodega es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string({
      message: "La descripción es requerida",
    })
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  direccion: z
    .string({
      message: "La dirección es requerida",
    })
    .min(1, "La dirección es requerida")
    .max(100, "La dirección no puede exceder 100 caracteres"),
  aclaraciones: z
    .string({
      message: "Las aclaraciones son requeridas",
    })
    .nullable()
    .optional(),
  telefono: z
    .string({
      message: "El teléfono es requerido",
    })
    .min(1, "El teléfono es requerido")
    .max(11, "El teléfono no puede exceder 11 caracteres"),
  multimediaPortada: z.string().optional(),
  multimedia: z.array(z.string()).optional(),
});

export interface CrearBodegaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export type CrearBodegaDto = z.infer<typeof CrearBodegaSchema>;
