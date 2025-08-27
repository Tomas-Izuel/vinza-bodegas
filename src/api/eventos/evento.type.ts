import z from "zod";
import { CommonSearchParams, Meta } from "../common.type";
import { Sucursal, SucursalCompleta } from "../sucursales/sucursal.type";
import { CategoriaEvento } from "../categoria-evento/categoria-evento.type";
import { RecurrenciaEvento } from "../recurrencias/recurrencia.type";

export enum EstadosEvento {
  ACTIVO = "activo",
  FINALIZADO = "finalizado",
  SUSPENDIDO = "suspendido",
  INACTIVO = "inactivo",
}

export type EventosResponse = {
  items: Evento[];
  meta: Meta;
};

export type EstadoEvento = {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type EventoDetalle = {
  id: number;
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: string;
  sucursalId: number;
  estadoId: number;
  categoriaId: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  promedioValoracion: string;
  categoria: CategoriaEvento;
  estado: EstadoEvento;
  sucursal: SucursalCompleta;
  recurrencias: RecurrenciaEvento[];
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
  categoria: CategoriaEvento; // <- sustituir con un type específico si lo tenés
  estado: EstadoEvento; // idem
  sucursal: Sucursal; // idem
  recurrencias: unknown[]; // idem
};

// Schema para los filtros de eventos basado en EventosParams
export const EventoFiltersSchema = z
  .object({
    sucursalId: z.coerce.number().optional(),
    categoriaId: z.coerce.number().optional(),
    estadoId: z.coerce.number().optional(),
    bodegaId: z.coerce.number().optional(),
    fechaDesde: z.string().optional(),
    fechaHasta: z.string().optional(),
    precioMaximo: z.coerce
      .number()
      .positive({
        message: "El precio máximo debe ser un valor positivo",
      })
      .optional(),
    puntuacionMinima: z.coerce
      .number()
      .positive({
        message: "La puntuación mínima debe ser un valor positivo",
      })
      .max(5, {
        message: "La puntuación mínima no puede ser mayor a 5",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.fechaDesde && data.fechaHasta) {
        const fechaDesde = new Date(data.fechaDesde);
        const fechaHasta = new Date(data.fechaHasta);
        return fechaDesde <= fechaHasta;
      }
      return true;
    },
    {
      message: "La fecha desde no puede ser mayor a la fecha hasta",
      path: ["fechaDesde"],
    },
  );

export type EventoFiltersType = z.infer<typeof EventoFiltersSchema>;

export type EventosParams = CommonSearchParams & EventoFiltersType;

// Tipos para el step form de creación de eventos
export type EventoStepFormData = {
  // Paso 1: Detalles del evento
  nombre: string;
  duracion: number;
  cupos: number;
  categoriaId: number;
  precio: number;
  sucursalId: number;
  descripcion?: string;

  // Paso 2: Fecha y hora
  tipoEvento: "unica" | "recurrente";
  fechas: string[];
  hora: string;

  // Paso 3: Multimedia
  imagenes: File[];
};

// Tipo para enviar al backend
export type CrearEventoDto = {
  nombre: string;
  descripcion: string;
  cupo: string;
  sucursalId: number;
  estadoId: number;
  categoriaId: number;
  precio: number;
  recurrencias: Array<{
    dia: string;
    hora: string;
    fecha_desde?: string;
    fecha_hasta?: string;
  }>;
};

// Schema de validación para el paso 1 (Detalles del evento)
export const EventoDetallesSchema = z.object({
  nombre: z.string().min(1, "El nombre del evento es requerido"),
  duracion: z.coerce
    .number()
    .min(1, "La duración es requerida")
    .max(24, "La duración no puede ser mayor a 24 horas"),
  cupos: z.coerce
    .number()
    .min(1, "Los cupos son requeridos")
    .positive("Los cupos deben ser un número positivo"),
  categoriaId: z.number().min(1, "Debe seleccionar una categoría"),
  precio: z.coerce
    .number()
    .min(1, "El precio es requerido")
    .positive("El precio debe ser un número positivo"),
  sucursalId: z.number().min(1, "Debe seleccionar una sucursal"),
  descripcion: z.string().optional(),
});

// Schema de validación para el paso 2 (Fecha y hora)
export const EventoFechaSchema = z.object({
  tipoEvento: z.enum(["unica", "recurrente"]),
  fechas: z.array(z.string()).min(1, "Debe seleccionar al menos una fecha"),
  hora: z.string().min(1, "Debe seleccionar una hora"),
});

// Schema de validación para el paso 3 (Multimedia)
export const EventoMultimediaSchema = z.object({
  imagenes: z.array(z.instanceof(File)).optional(),
});

// Schema completo para el step form
export const EventoStepFormSchema = EventoDetallesSchema.merge(
  EventoFechaSchema,
).merge(EventoMultimediaSchema);

export type EventoStepFormType = z.infer<typeof EventoStepFormSchema>;

// Schema para editar evento (solo campos básicos)
export const EditarEventoSchema = z.object({
  nombre: z.string().min(1, "El nombre del evento es requerido"),
  descripcion: z.string().optional(),
  cupo: z.coerce
    .number()
    .min(1, "Los cupos son requeridos")
    .positive("Los cupos deben ser un número positivo"),
  precio: z.coerce
    .number()
    .min(1, "El precio es requerido")
    .positive("El precio debe ser un número positivo"),
  categoriaId: z.number().min(1, "Debe seleccionar una categoría"),
  sucursalId: z.number().min(1, "Debe seleccionar una sucursal"),
});

export type EditarEventoType = z.infer<typeof EditarEventoSchema>;

// DTO para actualizar evento
export type ActualizarEventoDto = {
  nombre: string;
  descripcion: string;
  cupo: string;
  precio: number;
  categoriaId: number;
  sucursalId: number;
};
