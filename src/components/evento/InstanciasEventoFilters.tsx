"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const InstanciasEventoFiltersSchema = z.object({
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
});

type InstanciasEventoFiltersType = z.infer<
  typeof InstanciasEventoFiltersSchema
>;

export function InstanciasEventoFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialValues =
    React.useCallback((): InstanciasEventoFiltersType => {
      return {
        fechaDesde: searchParams.get("fechaDesde") || "",
        fechaHasta: searchParams.get("fechaHasta") || "",
      };
    }, [searchParams]);

  const form = useForm<InstanciasEventoFiltersType>({
    resolver: zodResolver(InstanciasEventoFiltersSchema),
    defaultValues: getInitialValues(),
  });

  React.useEffect(() => {
    const newValues = getInitialValues();
    form.reset(newValues, { keepDefaultValues: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSubmit = (data: InstanciasEventoFiltersType) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.fechaDesde?.trim()) {
      params.set("fechaDesde", data.fechaDesde.trim());
    } else {
      params.delete("fechaDesde");
    }

    if (data.fechaHasta?.trim()) {
      params.set("fechaHasta", data.fechaHasta.trim());
    } else {
      params.delete("fechaHasta");
    }

    router.push(`${pathname}?${params.toString()}`);

    const closeDrawerButton = document.getElementById(
      "filters-drawer-close",
    ) as HTMLButtonElement;
    if (closeDrawerButton) {
      closeDrawerButton.click();
    }
  };

  const handleClear = () => {
    const params = new URLSearchParams();
    const newUrl = pathname;
    window.location.href = newUrl;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
        id="instancias-filters-form"
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
        </div>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            type="submit"
            className="flex-1"
            form="instancias-filters-form"
            id="instancias-filters-form-submit"
          >
            Filtrar
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
