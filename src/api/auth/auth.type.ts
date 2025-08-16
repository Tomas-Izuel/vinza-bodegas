import { z } from "zod";

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

export enum RoleEnum {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const RoleSchema = z.object({
  id: z.number(),
  nombre: z.nativeEnum(RoleEnum),
  bodegaId: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthCookieSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string(),
  validado: z.string().nullable(),
  bodegaId: z.number(),
  roles: z.array(RoleSchema),
  token: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
