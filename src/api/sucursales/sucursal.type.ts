import { z } from "zod";
import { Bodega } from "../bodegas/bodega.type";

export interface Sucursal {
  id: number;
  nombre: string;
  es_principal: boolean;
  direccion: string;
  aclaraciones: string;
  bodegaId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SucursalCompleta extends Sucursal {
  bodega: Bodega;
}

export interface CrearSucursalDto {
  nombre: string;
  es_principal: boolean;
  direccion: string;
  aclaraciones?: string;
  bodegaId: number;
}

export const CrearSucursalSchema = z.object({
  nombre: z
    .string({
      message: "El nombre de la sucursal es requerido",
    })
    .min(1, "El nombre de la sucursal es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  direccion: z
    .string({
      message: "La dirección es requerida",
    })
    .min(1, "La dirección es requerida")
    .max(255, "La dirección no puede exceder 255 caracteres"),
  aclaraciones: z
    .string()
    .max(500, "Las aclaraciones no pueden exceder 500 caracteres")
    .optional(),
  es_principal: z.boolean({
    message: "Debe especificar si es sucursal principal",
  }),
  bodegaId: z.number({
    message: "El ID de la bodega es requerido",
  }),
});

export type CrearSucursalType = z.infer<typeof CrearSucursalSchema>;

export const EditarSucursalSchema = z.object({
  nombre: z
    .string({
      message: "El nombre de la sucursal es requerido",
    })
    .min(1, "El nombre de la sucursal es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  direccion: z
    .string({
      message: "La dirección es requerida",
    })
    .min(1, "La dirección es requerida")
    .max(255, "La dirección no puede exceder 255 caracteres"),
  aclaraciones: z
    .string()
    .max(500, "Las aclaraciones no pueden exceder 500 caracteres")
    .optional(),
  es_principal: z.boolean({
    message: "Debe especificar si es sucursal principal",
  }),
});

export type EditarSucursalType = z.infer<typeof EditarSucursalSchema>;
