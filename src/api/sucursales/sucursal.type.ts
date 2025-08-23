export interface Sucursal {
  id: number;
  nombre: string;
  es_principal: boolean;
  direccion: string;
  aclaraciones: string;
  bodegaId: number;
  created_at: string;
}

export interface CrearSucursalDto {
  nombre: string;
  es_principal: boolean;
  direccion: string;
  aclaraciones?: string;
  bodegaId: number;
}
