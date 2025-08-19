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
