import { z } from "zod";

export type Bodega = {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

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
});

export interface CrearBodegaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

export type CrearBodegaDto = z.infer<typeof CrearBodegaSchema>;
