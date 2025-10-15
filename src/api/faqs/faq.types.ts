import { z } from "zod";

export interface Recipient {
  id: number;
  name: string;
  label: string;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  recipient_id: number;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
  recipient: Recipient;
}

export interface FaqMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface FaqResponse {
  items: FaqItem[];
  meta: FaqMeta;
}

// Esquemas de validación Zod
export const RecipientSchema = z.object({
  id: z.number(),
  name: z.string(),
  label: z.string(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
  updated_at: z.string(),
});

export const FaqItemSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  recipient_id: z.number(),
  created_at: z.string(),
  deleted_at: z.string().nullable(),
  updated_at: z.string(),
  recipient: RecipientSchema,
});

export const FaqMetaSchema = z.object({
  totalItems: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  itemsPerPage: z.number(),
});

export const FaqResponseSchema = z.object({
  items: z.array(FaqItemSchema),
  meta: FaqMetaSchema,
});

// Tipos inferidos de los esquemas
export type FaqItemType = z.infer<typeof FaqItemSchema>;
export type FaqResponseType = z.infer<typeof FaqResponseSchema>;
export type FaqMetaType = z.infer<typeof FaqMetaSchema>;
export type RecipientType = z.infer<typeof RecipientSchema>;
