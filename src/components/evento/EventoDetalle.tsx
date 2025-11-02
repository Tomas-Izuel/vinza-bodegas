"use client";
import { useState } from "react";
import {
  EventoDetalle as EventoDetalleType,
  EditarEventoSchema,
  EditarEventoType,
} from "@/api/eventos/evento.type";

import { Tooltip } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CategoriaEvento } from "@/api/categoria-evento/categoria-evento.type";
import { EstadoEvento } from "@/api/eventos/evento.type";
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
  estados: EstadoEvento[];
  onEventoUpdated?: (eventoActualizado: EventoDetalleType) => void;
}

export function EventoDetalle({
  evento,
  categorias,
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
      estadoId: evento.estado.id,
      sucursalId: evento.sucursalId,
    },
  });
  const [precioToastShown, setPrecioToastShown] = useState(false);

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
  const estados = [
    { id: 1, nombre: "ACTIVO" },
    { id: 2, nombre: "SUSPENDIDO" },
    { id: 3, nombre: "FINALIZADO" },
  ];

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                {/* Primera fila */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr] gap-6 pl-2">
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
                      <p className="text-base text-gray-900 bg-gray-100 p-2 rounded">
                        {evento.sucursal.nombre}
                      </p>
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
                      Estado
                    </p>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="estadoId"
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
                                  <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  {estados.map((estado) => (
                                    <SelectItem
                                      key={estado.id}
                                      value={estado.id.toString()}
                                    >
                                      {estado.nombre}
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
                        {evento.estado.nombre}
                      </p>
                    )}
                  </div>
                  {!isEditing && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Fecha de creación
                      </p>
                      <p className="text-base text-green-600">
                        {formatFecha(evento.created_at)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Segunda fila */}
                <div
                  className={`grid grid-cols-1 ${
                    isEditing
                      ? "md:grid-cols-3 gap-4"
                      : "md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 pl-4"
                  }`}
                >
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

                  {!isEditing && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        Puntuación promedio
                      </p>
                      <div className="flex items-center gap-2">
                        <Rating value={parseFloat(evento.promedioValoracion)} />
                      </div>
                    </div>
                  )}

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
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Input
                                      type="number"
                                      inputMode="decimal"
                                      step="100"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e.target.value);
                                        if (!precioToastShown) {
                                          toast.warning(
                                            "⚠️ Recordá que si existen reservas asociadas se respeta el precio anterior.",
                                          );
                                          setPrecioToastShown(true);

                                          // opcional: lo volvés a habilitar después de unos segundos
                                          setTimeout(
                                            () => setPrecioToastShown(false),
                                            8000,
                                          );
                                        }
                                      }}
                                    />
                                  </TooltipTrigger>
                                </Tooltip>
                              </TooltipProvider>
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
