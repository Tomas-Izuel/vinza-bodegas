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
  roles: z.array(z.number()).length(1, "Debe seleccionar exactamente un rol"),
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
  roles: z.array(z.number()).length(1, "Debe seleccionar exactamente un rol"),
});

export type EditarUsuarioDto = z.infer<typeof EditarUsuarioSchema>;

// Tipos para el perfil del usuario autenticado (GET /users/me)
export type PermisoConRelacion = {
  id: number;
  nombre: string;
  descripcion: string;
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

export type RolConPermisos = {
  id: number;
  nombre: string;
  bodegaId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  HRolUsuario: {
    userId: number;
    rolId: number;
    created_at: string;
    updatedAt: string;
    deleted_at: string | null;
  };
  permisos: PermisoConRelacion[];
};

export type BodegaSimple = {
  id: number;
  nombre: string;
  descripcion: string;
  telefono: string;
  validada: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type PerfilUsuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  validado: string | null;
  fecha_nacimiento: string | null;
  bodegaId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  roles: RolConPermisos[];
  bodega: BodegaSimple;
};

// Tipos para actualizar el perfil
export type ActualizarPerfilRequest = {
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento?: string;
  contrasena?: string;
};

export type ActualizarPerfilResponse = PerfilUsuario;

export const ActualizarPerfilSchema = z.object({
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
  fecha_nacimiento: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date || date === "") return true;
        const fecha = new Date(date);
        return !isNaN(fecha.getTime());
      },
      {
        message: "Formato de fecha inválido",
      },
    ),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña no puede tener más de 100 caracteres")
    .optional()
    .or(z.literal("")),
  roles: z.array(z.number()).optional(),
});

export type ActualizarPerfilDto = z.infer<typeof ActualizarPerfilSchema>;
