"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

const CrearBodegaForm = () => {
  const form = useForm<CrearBodegaDto>({
    resolver: zodResolver(CrearBodegaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: CrearBodegaDto) => {
    try {
      await crearBodega(data);
      toast.success("Bodega creada exitosamente");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear la bodega";
      toast.error("Error al crear la bodega", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-center">Crear tu bodega</CardTitle>
        <CardDescription className="text-center">
          Para continuar, necesitas crear tu bodega
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="crear-bodega-form"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">
                    Nombre de la bodega
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Bodega El Roble" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu bodega, sus características principales..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          form="crear-bodega-form"
          isLoading={form.formState.isSubmitting}
        >
          Crear bodega
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrearBodegaForm;
