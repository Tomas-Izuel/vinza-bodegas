import { Role } from "../auth/auth.type";
import { z } from "zod";

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

// Tipos para crear usuario
export type CrearUsuarioRequest = {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  fecha_nacimiento?: string;
  roles?: number[];
};

export type CrearUsuarioResponse = Usuario;

// Esquema de validación para crear usuario
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
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato del email no es válido"),
  contrasena: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
  fecha_nacimiento: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date || date === "") return true;
        // Validar que sea una fecha válida en formato ISO
        const fecha = new Date(date);
        return !isNaN(fecha.getTime());
      },
      {
        message: "Formato de fecha inválido",
      },
    ),
  roles: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un rol")
    .max(10, "No puede seleccionar más de 10 roles"),
});

export type CrearUsuarioDto = z.infer<typeof CrearUsuarioSchema>;

export type EditarUsuarioRequest = {
  nombre: string;
  apellido: string;
  email: string;
  contrasena?: string;
  roles: number[];
};

export type EditarUsuarioResponse = Usuario;

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
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El formato del email no es válido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres")
    .optional(),
  roles: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un rol")
    .max(10, "No puede seleccionar más de 10 roles"),
});

export type EditarUsuarioDto = z.infer<typeof EditarUsuarioSchema>;
