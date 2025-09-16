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
import { CrearBodegaSchema, CrearBodegaDto } from "@/api/bodegas/bodega.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { crearBodega } from "@/api/bodegas/bodega.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

const CrearBodegaForm = () => {
  const router = useRouter();
  const form = useForm<CrearBodegaDto>({
    resolver: zodResolver(CrearBodegaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      direccion: "",
      aclaraciones: "",
      telefono: "",
    },
  });

  // Observar cambios en el campo dirección para actualizar el mapa
  const direccionValue = form.watch("direccion");

  const onSubmit = async (data: CrearBodegaDto) => {
    try {
      await crearBodega(data);
      toast.success("Bodega creada exitosamente");

      router.push(Routes.HOME);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear la bodega";
      toast.error("Error al crear la bodega", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <h1>Crear tu bodega</h1>
        <p>Para continuar, necesitas completar la información de tu bodega</p>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3"
            id="crear-bodega-form"
          >
            {/* Primera fila - Campos principales en 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        placeholder="Nombre de la bodega"
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
                        placeholder="Dirección de la bodega"
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
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required text-sm font-medium">
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Teléfono de contacto"
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
              <MapView direccion={direccionValue} />
            </div>

            {/* Segunda fila - Descripción y Aclaraciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required text-sm font-medium">
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe tu bodega..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Información adicional (opcional)"
                        className="min-h-[120px] resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botón de submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                form="crear-bodega-form"
                isLoading={form.formState.isSubmitting}
                className="px-8 h-10"
              >
                Crear bodega
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CrearBodegaForm;
