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
