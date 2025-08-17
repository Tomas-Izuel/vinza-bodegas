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
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  EventoFiltersSchema,
  EventoFiltersType,
  EventosParams,
} from "@/api/eventos/evento.type";

interface EventoFiltersProps {
  onFilter?: (filters: EventosParams) => void;
  onClear?: () => void;
}

export function EventoFilters({ onFilter, onClear }: EventoFiltersProps) {
  const form = useForm<EventoFiltersType>({
    resolver: zodResolver(EventoFiltersSchema),
    defaultValues: {
      sucursalId: undefined,
      categoriaId: undefined,
      estadoId: undefined,
      bodegaId: undefined,
      fechaDesde: "",
      fechaHasta: "",
      precioMaximo: undefined,
      puntuacionMinima: undefined,
    },
  });

  const handleSubmit = (data: EventoFiltersType) => {
    // Filtrar valores vacíos y convertir a EventosParams
    const filteredData: EventosParams = {};

    if (data.sucursalId) filteredData.sucursalId = data.sucursalId;
    if (data.categoriaId) filteredData.categoriaId = data.categoriaId;
    if (data.estadoId) filteredData.estadoId = data.estadoId;
    if (data.bodegaId) filteredData.bodegaId = data.bodegaId;
    if (data.fechaDesde?.trim())
      filteredData.fechaDesde = data.fechaDesde.trim();
    if (data.fechaHasta?.trim())
      filteredData.fechaHasta = data.fechaHasta.trim();
    if (data.precioMaximo) filteredData.precioMaximo = data.precioMaximo;
    if (data.puntuacionMinima)
      filteredData.puntuacionMinima = data.puntuacionMinima;

    onFilter?.(filteredData);
  };

  const handleClear = () => {
    form.reset();
    onClear?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4 [&>*]:w-full">
          <FormField
            control={form.control}
            name="estadoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  value={field.value?.toString() || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="2">Finalizado</SelectItem>
                    <SelectItem value="3">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sucursalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  value={field.value?.toString() || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las sucursales" />
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
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  value={field.value?.toString() || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
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
            name="bodegaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bodega</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  value={field.value?.toString() || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las bodegas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Bodega Central</SelectItem>
                    <SelectItem value="2">Bodega Norte</SelectItem>
                    <SelectItem value="3">Bodega Sur</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fechaDesde"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha desde</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      placeholder="Fecha de inicio"
                    />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="precioMaximo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio máximo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Precio máximo"
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="puntuacionMinima"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puntuación mínima</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Puntuación mínima"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
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
