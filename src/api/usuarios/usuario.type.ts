import { Role } from "../auth/auth.type";

export type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  validado: boolean | null;
  fecha_nacimiento: string | null;
  bodegaId: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: Role[];
};

export type UsuariosResponse = Usuario[];

export type CrearUsuarioRequest = {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  contrasena: string;
  roles: number[];
};

export type CrearUsuarioResponse = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  validado: boolean | null;
  fecha_nacimiento: string | null;
  bodegaId: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: Role[];
};

import { z } from "zod";

export const CrearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  apellido: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),
  edad: z
    .number()
    .min(18, "La edad mínima es 18 años")
    .max(100, "La edad máxima es 100 años"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato del email no es válido"),
  contrasena: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
  roles: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un rol")
    .max(10, "No puede seleccionar más de 10 roles"),
});

export type CrearUsuarioDto = z.infer<typeof CrearUsuarioSchema>;

export type EditarUsuarioRequest = {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  contrasena?: string;
  roles: number[];
};

export type EditarUsuarioResponse = CrearUsuarioResponse;

export const EditarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  apellido: z
    .string()
    .min(1, "El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),
  edad: z
    .number()
    .min(18, "La edad mínima es 18 años")
    .max(100, "La edad máxima es 100 años"),
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato del email no es válido"),
  roles: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un rol")
    .max(10, "No puede seleccionar más de 10 roles"),
});

export type EditarUsuarioDto = z.infer<typeof EditarUsuarioSchema>;
