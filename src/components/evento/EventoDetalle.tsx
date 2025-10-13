"use client";

import {
  EventoDetalle as EventoDetalleType,
  EditarEventoSchema,
  EditarEventoType,
} from "@/api/eventos/evento.type";
import { CategoriaEvento } from "@/api/categoria-evento/categoria-evento.type";
import { Sucursal } from "@/api/sucursales/sucursal.type";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actualizarEvento } from "@/api/eventos/eventos.service";
import { toast } from "sonner";
import { EventoImagenes } from "./EventoImagenes";

interface EventoDetalleProps {
  evento: EventoDetalleType;
  categorias: CategoriaEvento[];
  sucursales: Sucursal[];
  onEventoUpdated?: (eventoActualizado: EventoDetalleType) => void;
}

export function EventoDetalle({
  evento,
  categorias,
  sucursales,
  onEventoUpdated,
}: EventoDetalleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = searchParams.get("editar") === "true";

  const form = useForm<EditarEventoType>({
    resolver: zodResolver(EditarEventoSchema),
    defaultValues: {
      nombre: evento.nombre,
      descripcion: evento.descripcion || "",
      cupo: parseInt(evento.cupo),
      precio: parseFloat(evento.precio),
      categoriaId: evento.categoriaId,
      sucursalId: evento.sucursalId,
    },
  });

  const formatPrecio = (precio: string) => {
    return `$${parseFloat(precio).toLocaleString()}`;
  };

  const formatFecha = (fechaISO: string) => {
    return moment(fechaISO).format("MMM DD, YYYY");
  };

  const onSubmit = async (data: EditarEventoType) => {
    const result = await actualizarEvento(evento.id.toString(), data);

    if (result.success && result.data) {
      onEventoUpdated?.(result.data);

      // Remover el parámetro de edición de la URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("editar");
      router.push(`?${params.toString()}`);
    } else {
      toast.error("Error al actualizar el evento", {
        description: result.error || "Error al actualizar el evento",
      });
    }
  };

  const cancelarEdicion = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editar");
    router.push(`?${params.toString()}`);
    form.reset();
  };

  const habilitarEdicion = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("editar", "true");
    router.push(`?${params.toString()}`);
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Información del evento */}
              <div className="lg:col-span-3 space-y-6">
                {/* Primera fila de información */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Nombre
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">{evento.nombre}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Sucursal
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="sucursalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value?.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar sucursal" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  {sucursales.map((sucursal) => (
                                    <SelectItem
                                      key={sucursal.id}
                                      value={sucursal.id.toString()}
                                    >
                                      {sucursal.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">
                        {evento.sucursal.nombre}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Categoría
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="categoriaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value?.toString()}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  {categorias.map((categoria) => (
                                    <SelectItem
                                      key={categoria.id}
                                      value={categoria.id.toString()}
                                    >
                                      {categoria.nombre}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">
                        {evento.categoria.nombre}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Puntuación promedio
                    </p>
                    <div className="flex items-center gap-2">
                      <Rating value={parseFloat(evento.promedioValoracion)} />
                    </div>
                  </div>
                </div>

                {/* Segunda fila de información */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Descripción
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="descripcion"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">
                        {evento.descripcion || "Sin descripción"}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Fecha de creación
                    </p>
                    <p className="text-base text-green-600">
                      {formatFecha(evento.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Precio
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="precio"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">
                        {formatPrecio(evento.precio)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Cupos
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="cupo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-base text-gray-900">{evento.cupo}</p>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isDirty
                      }
                    >
                      {form.formState.isSubmitting
                        ? "Guardando..."
                        : "Guardar cambios"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelarEdicion}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {/* Imágenes del evento */}
              <div className="lg:col-span-1">
                <EventoImagenes
                  imagenes={evento.multimedia || []}
                  imagenPortada={evento.multimediaPortada}
                  nombreEvento={evento.nombre}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
