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
  ReservaFiltersSchema,
  ReservaFiltersType,
} from "@/api/reservas/reserva.type";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ReservaFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Memorizar la función para obtener valores de search params
  const getInitialValues = React.useCallback((): ReservaFiltersType => {
    return {
      fechaDesde: searchParams.get("fechaDesde") || "",
      fechaHasta: searchParams.get("fechaHasta") || "",
      estadoId: searchParams.get("estadoId")
        ? Number(searchParams.get("estadoId"))
        : undefined,
      eventoId: searchParams.get("eventoId")
        ? Number(searchParams.get("eventoId"))
        : undefined,
      precioMinimo: searchParams.get("precioMinimo")
        ? Number(searchParams.get("precioMinimo"))
        : undefined,
      precioMaximo: searchParams.get("precioMaximo")
        ? Number(searchParams.get("precioMaximo"))
        : undefined,
      cantidadGente: searchParams.get("cantidadGente")
        ? Number(searchParams.get("cantidadGente"))
        : undefined,
    };
  }, [searchParams]);

  const form = useForm<ReservaFiltersType>({
    resolver: zodResolver(ReservaFiltersSchema),
    defaultValues: getInitialValues(),
  });

  // Actualizar formulario cuando cambien los search params
  React.useEffect(() => {
    const newValues = getInitialValues();
    form.reset(newValues);
  }, [getInitialValues, form]);

  const handleSubmit = (data: ReservaFiltersType) => {
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

    // Filtrar valores vacíos y convertir a ReservasParams
    const filteredData: Record<string, string> = { ...preservedParams };

    if (data.fechaDesde?.trim())
      filteredData.fechaDesde = data.fechaDesde.trim();
    if (data.fechaHasta?.trim())
      filteredData.fechaHasta = data.fechaHasta.trim();
    if (data.estadoId) filteredData.estadoId = data.estadoId.toString();
    if (data.eventoId) filteredData.eventoId = data.eventoId.toString();
    if (data.precioMinimo)
      filteredData.precioMinimo = data.precioMinimo.toString();
    if (data.precioMaximo)
      filteredData.precioMaximo = data.precioMaximo.toString();
    if (data.cantidadGente)
      filteredData.cantidadGente = data.cantidadGente.toString();

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
      fechaDesde: "",
      fechaHasta: "",
      estadoId: undefined,
      eventoId: undefined,
      precioMinimo: undefined,
      precioMaximo: undefined,
      cantidadGente: undefined,
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
        id="reserva-filters-form"
      >
        <div className="flex flex-col gap-4 [&>*]:w-full">
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
                      <FormLabel>Fecha desde (evento)</FormLabel>
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

          <FormField
            control={form.control}
            name="eventoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre evento</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value ? Number(value) : undefined)
                  }
                  value={field.value?.toString() || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nombre evento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="1">Cata vino</SelectItem>
                    <SelectItem value="2">Sunset</SelectItem>
                    <SelectItem value="3">Degustación</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

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
                      <SelectValue placeholder="Nombre estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="1">Confirmado</SelectItem>
                    <SelectItem value="2">Pendiente</SelectItem>
                    <SelectItem value="3">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            type="submit"
            className="flex-1"
            form="reserva-filters-form"
            id="reserva-filters-form-submit"
          >
            Confirmar
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
