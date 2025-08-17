export type EventosResponse = {
  items: Evento[];
  meta: Meta;
};

export type Evento = {
  id: number;
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: string;
  sucursalId: number;
  estadoId: number;
  categoriaId: number;
  created_at: string; // ISO date
  updated_at: string; // ISO date
  deleted_at: string | null;
  categoria: unknown; // <- sustituir con un type específico si lo tenés
  estado: unknown; // idem
  sucursal: unknown; // idem
  recurrencias: unknown[]; // idem
};

export type Meta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};
