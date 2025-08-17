"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  EventoFiltersSchema,
  EventoFiltersType,
} from "@/api/eventos/evento.type";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function EventoFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Obtener valores actuales de los search params
  const getInitialValues = (): EventoFiltersType => {
    return {
      sucursalId: searchParams.get("sucursalId")
        ? Number(searchParams.get("sucursalId"))
        : undefined,
      categoriaId: searchParams.get("categoriaId")
        ? Number(searchParams.get("categoriaId"))
        : undefined,
      estadoId: searchParams.get("estadoId")
        ? Number(searchParams.get("estadoId"))
        : undefined,
      bodegaId: searchParams.get("bodegaId")
        ? Number(searchParams.get("bodegaId"))
        : undefined,
      fechaDesde: searchParams.get("fechaDesde") || "",
      fechaHasta: searchParams.get("fechaHasta") || "",
      precioMaximo: searchParams.get("precioMaximo")
        ? Number(searchParams.get("precioMaximo"))
        : undefined,
      puntuacionMinima: searchParams.get("puntuacionMinima")
        ? Number(searchParams.get("puntuacionMinima"))
        : undefined,
    };
  };

  const form = useForm<EventoFiltersType>({
    resolver: zodResolver(EventoFiltersSchema),
    defaultValues: getInitialValues(),
  });

  // Actualizar formulario cuando cambien los search params
  React.useEffect(() => {
    const newValues: EventoFiltersType = {
      sucursalId: searchParams.get("sucursalId")
        ? Number(searchParams.get("sucursalId"))
        : undefined,
      categoriaId: searchParams.get("categoriaId")
        ? Number(searchParams.get("categoriaId"))
        : undefined,
      estadoId: searchParams.get("estadoId")
        ? Number(searchParams.get("estadoId"))
        : undefined,
      bodegaId: searchParams.get("bodegaId")
        ? Number(searchParams.get("bodegaId"))
        : undefined,
      fechaDesde: searchParams.get("fechaDesde") || "",
      fechaHasta: searchParams.get("fechaHasta") || "",
      precioMaximo: searchParams.get("precioMaximo")
        ? Number(searchParams.get("precioMaximo"))
        : undefined,
      puntuacionMinima: searchParams.get("puntuacionMinima")
        ? Number(searchParams.get("puntuacionMinima"))
        : undefined,
    };
    form.reset(newValues);
  }, [searchParams, form]);

  const handleSubmit = (data: EventoFiltersType) => {
    // Obtener parámetros actuales y preservar los importantes
    const currentParams = new URLSearchParams(searchParams.toString());

    // Preservar parámetros importantes
    const preservedParams: Record<string, string> = {};
    const paramsToPreserve = ["search", "page", "limit", "orderBy"];

    paramsToPreserve.forEach((param) => {
      const value = currentParams.get(param);
      if (value) {
        preservedParams[param] = value;
      }
    });

    // Filtrar valores vacíos y convertir a EventosParams
    const filteredData: Record<string, string> = { ...preservedParams };

    if (data.sucursalId) filteredData.sucursalId = data.sucursalId.toString();
    if (data.categoriaId)
      filteredData.categoriaId = data.categoriaId.toString();
    if (data.estadoId) filteredData.estadoId = data.estadoId.toString();
    if (data.bodegaId) filteredData.bodegaId = data.bodegaId.toString();
    if (data.fechaDesde?.trim())
      filteredData.fechaDesde = data.fechaDesde.trim();
    if (data.fechaHasta?.trim())
      filteredData.fechaHasta = data.fechaHasta.trim();
    if (data.precioMaximo)
      filteredData.precioMaximo = data.precioMaximo.toString();
    if (data.puntuacionMinima)
      filteredData.puntuacionMinima = data.puntuacionMinima.toString();

    // Resetear página a 1 cuando se aplican nuevos filtros
    if (filteredData.page) {
      filteredData.page = "1";
    }

    const newSearchParams = new URLSearchParams(filteredData);
    router.push(`${pathname}?${newSearchParams.toString()}`);

    const closeDrawerButton = document.getElementById(
      "filters-drawer-close",
    ) as HTMLButtonElement;
    if (closeDrawerButton) {
      closeDrawerButton.click();
    }
  };

  const handleClear = () => {
    form.reset({
      sucursalId: undefined,
      categoriaId: undefined,
      estadoId: undefined,
      bodegaId: undefined,
      fechaDesde: "",
      fechaHasta: "",
      precioMaximo: undefined,
      puntuacionMinima: undefined,
    });

    // Preservar solo los parámetros importantes al limpiar
    const currentParams = new URLSearchParams(searchParams.toString());
    const preservedParams: Record<string, string> = {};
    const paramsToPreserve = ["search", "page", "limit", "orderBy"];

    paramsToPreserve.forEach((param) => {
      const value = currentParams.get(param);
      if (value) {
        preservedParams[param] = value;
      }
    });

    const newSearchParams = new URLSearchParams(preservedParams);
    const queryString = newSearchParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        id="evento-filters-form"
      >
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las sucursales" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas las bodegas" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="1">Bodega Central</SelectItem>
                    <SelectItem value="2">Bodega Norte</SelectItem>
                    <SelectItem value="3">Bodega Sur</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaDesde"
            render={({ field: fieldDesde }) => (
              <FormField
                control={form.control}
                name="fechaHasta"
                render={({ field: fieldHasta }) => {
                  const fechaDesde = fieldDesde.value
                    ? moment(fieldDesde.value).toDate()
                    : undefined;
                  const fechaHasta = fieldHasta.value
                    ? moment(fieldHasta.value).toDate()
                    : undefined;

                  const handleDateRangeSelect = (
                    range: { from?: Date; to?: Date } | undefined,
                  ) => {
                    if (range?.from) {
                      fieldDesde.onChange(
                        moment(range.from).format("YYYY-MM-DD"),
                      );
                    } else {
                      fieldDesde.onChange("");
                    }

                    if (range?.to) {
                      fieldHasta.onChange(
                        moment(range.to).format("YYYY-MM-DD"),
                      );
                    } else {
                      fieldHasta.onChange("");
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel>Rango de fechas</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !fechaDesde &&
                                  !fechaHasta &&
                                  "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fechaDesde && fechaHasta
                                ? `${moment(fechaDesde).format("DD/MM/YYYY")} - ${moment(fechaHasta).format("DD/MM/YYYY")}`
                                : fechaDesde
                                  ? `Desde ${moment(fechaDesde).format("DD/MM/YYYY")}`
                                  : fechaHasta
                                    ? `Hasta ${moment(fechaHasta).format("DD/MM/YYYY")}`
                                    : "Seleccionar rango de fechas"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: fechaDesde,
                              to: fechaHasta,
                            }}
                            onSelect={handleDateRangeSelect}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
          />

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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            type="submit"
            className="flex-1"
            form="evento-filters-form"
            id="evento-filters-form-submit"
          >
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
