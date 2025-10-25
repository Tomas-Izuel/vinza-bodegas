"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  CrearSucursalSchema,
  CrearSucursalType,
} from "@/api/sucursales/sucursal.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { crearSucursal } from "@/api/sucursales/sucursal.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";
import { Switch } from "../ui/switch";
import dynamic from "next/dynamic";
import { useState } from "react";

const MapView = dynamic(() => import("../bodega/MapView"), {
  ssr: false,
});

interface CrearSucursalFormProps {
  bodegaId: number;
}

const CrearSucursalForm = ({ bodegaId }: CrearSucursalFormProps) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();
  const form = useForm<CrearSucursalType>({
    resolver: zodResolver(CrearSucursalSchema),
    defaultValues: {
      nombre: "",
      direccion: "",
      aclaraciones: "",
      es_principal: false,
      bodegaId: bodegaId,
    },
  });

  // Observar cambios en el campo dirección para actualizar el mapa
  const direccionValue = form.watch("direccion");

  const onSubmit = async (data: CrearSucursalType) => {
    try {
      await crearSucursal({
        ...data,
        latitude: coordinates?.lat || 0,
        longitude: coordinates?.lng || 0,
      });
      toast.success("Sucursal creada exitosamente");

      router.push(Routes.BODEGA_INFORMACION);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear la sucursal";
      toast.error("Error al crear la sucursal", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <h1>Crear sucursal</h1>
        <p>Completa la información para crear una nueva sucursal</p>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="crear-sucursal-form"
          >
            {/* Primera fila - Nombre y Dirección */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required text-sm font-medium">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre de la sucursal"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required text-sm font-medium">
                      Dirección
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dirección de la sucursal"
                        className="h-9"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Mapa - Ocupa todo el ancho */}
            <div>
              <MapView
                direccion={direccionValue}
                setCoordinates={setCoordinates}
                coordinates={coordinates}
              />
            </div>

            {/* Switch para sucursal principal */}
            <FormField
              control={form.control}
              name="es_principal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">
                      Sucursal principal
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Marca esta sucursal como la principal de la bodega
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Aclaraciones */}
            <FormField
              control={form.control}
              name="aclaraciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Aclaraciones
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre la sucursal (opcional)"
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(Routes.BODEGA_INFORMACION)}
                className="px-6 h-10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="crear-sucursal-form"
                isLoading={form.formState.isSubmitting}
                disabled={!coordinates}
                className="px-8 h-10"
              >
                Crear sucursal
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CrearSucursalForm;
