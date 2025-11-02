export type Permiso = {
  id: number;
  nombre: string;
  clave: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  HRolPermiso: {
    rolId: number;
    permisoId: number;
    created_at: string;
    updatedAt: string;
    deleted_at: string | null;
  };
};

export type Rol = {
  id: number;
  nombre: string;
  bodegaId: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permisos: Permiso[];
};

export type RolesResponse = Rol[];

export type PermisoSimple = {
  id: number;
  nombre: string;
  clave: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PermisosResponse = PermisoSimple[];

export type CrearRolRequest = {
  nombre: string;
  permisos: number[];
  bodegaId?: number;
};

export type CrearRolResponse = {
  id: number;
  nombre: string;
  bodegaId: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

import { z } from "zod";

export const CrearRolSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  permisos: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un permiso")
    .max(20, "No puede seleccionar más de 20 permisos"),
});

export type CrearRolDto = z.infer<typeof CrearRolSchema>;

export type EditarRolRequest = {
  nombre: string;
  permisos: number[];
  bodegaId?: number;
};

export type EditarRolResponse = CrearRolResponse;

export const EditarRolSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  permisos: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un permiso")
    .max(20, "No puede seleccionar más de 20 permisos"),
});

export type EditarRolDto = z.infer<typeof EditarRolSchema>;

export interface CanDeleteRolResponse {
  canDelete: boolean;
}
