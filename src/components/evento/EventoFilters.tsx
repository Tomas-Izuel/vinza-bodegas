"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

// Schema para los filtros de eventos
const EventoFiltersSchema = z.object({
  estado: z.string().optional(),
  sucursal: z.string().optional(),
  categoria: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
});

type EventoFiltersType = z.infer<typeof EventoFiltersSchema>;

interface EventoFiltersProps {
  onFilter?: (filters: EventoFiltersType) => void;
  onClear?: () => void;
}

export function EventoFilters({ onFilter, onClear }: EventoFiltersProps) {
  const form = useForm<EventoFiltersType>({
    resolver: zodResolver(EventoFiltersSchema),
    defaultValues: {
      estado: "",
      sucursal: "",
      categoria: "",
      fechaDesde: "",
      fechaHasta: "",
    },
  });

  const handleSubmit = (data: EventoFiltersType) => {
    onFilter?.(data);
  };

  const handleClear = () => {
    form.reset();
    onClear?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="suspendido">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sucursal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Sucursal Central</SelectItem>
                    <SelectItem value="2">Sucursal Norte</SelectItem>
                    <SelectItem value="3">Sucursal Sur</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Degustación</SelectItem>
                    <SelectItem value="2">Cata</SelectItem>
                    <SelectItem value="3">Tour</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaDesde"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha desde</FormLabel>
                <FormControl>
                  <Input type="date" {...field} placeholder="Fecha de inicio" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaHasta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha hasta</FormLabel>
                <FormControl>
                  <Input type="date" {...field} placeholder="Fecha de fin" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            Aplicar filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Limpiar filtros
          </Button>
        </div>
      </form>
    </Form>
  );
}
