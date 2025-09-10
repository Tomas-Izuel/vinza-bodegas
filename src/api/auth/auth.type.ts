import { z } from "zod";
import { BodegaSchema } from "../bodegas/bodega.type";

export const LoginSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(1, "La contraseña es requerida"),
});
/*
{
  id: 1,
  nombre: 'Admin',
  apellido: 'User',
  email: 'admin@example.com',
  validado: null,
  fecha_nacimiento: null,
  bodegaId: 1,
  created_at: '2025-08-16T23:08:55.082Z',
  updated_at: '2025-08-16T23:08:55.082Z',
  deleted_at: null,
  roles: [
    {
      id: 1,
      nombre: 'ADMIN',
      bodegaId: 1,
      created_at: '2025-08-16T23:08:54.965Z',
      updated_at: '2025-08-16T23:08:54.965Z',
      deleted_at: null,
      HRolUsuario: [Object]
    }
  ],
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJyb2xlIjoxLCJpYXQiOjE3NTUzODYxNzcsImV4cCI6MTc1NTQ3MjU3N30.U1o6ojnnePOmAEgcm7QETZOjfXj9_ErBgYvO06bVZhI'
} */
export interface Role {
  id: number;
  nombre: string;
  bodegaId: number;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
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
  roles: Role[];
  token: string;
}

export const RoleSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  bodegaId: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthCookieSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  validado: z.string().nullable().optional(),
  bodegaId: z.number().nullable(),
  roles: z.array(RoleSchema),
  token: z.string(),
  bodega: BodegaSchema.nullable(),
});

export const RegisterSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z
    .string({
      message: "El nombre es requerido",
    })
    .min(1, "El nombre es requerido"),
});

export const ValidateAccountSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
  code: z
    .string({
      message: "El código es requerido",
    })
    .min(1, "El código es requerido"),
});

export const RequestValidationSchema = z.object({
  email: z
    .string({
      message: "El email es requerido",
    })
    .min(1, "El email es requerido")
    .email("Debe ser un email válido"),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ValidateAccountDto = z.infer<typeof ValidateAccountSchema>;
export type RequestValidationDto = z.infer<typeof RequestValidationSchema>;
export type AuthCookie = z.infer<typeof AuthCookieSchema>;
