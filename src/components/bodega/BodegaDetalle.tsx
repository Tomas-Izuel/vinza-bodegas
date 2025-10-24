"use client";

import {
  BodegaDetalle as BodegaDetalleType,
  EditarBodegaSchema,
  EditarBodegaType,
} from "@/api/bodegas/bodega.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actualizarBodega } from "@/api/bodegas/bodega.service";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BodegaDetalleProps {
  bodega: BodegaDetalleType;
  onBodegaUpdated?: (bodegaActualizada: BodegaDetalleType) => void;
}

export function BodegaDetalle({ bodega, onBodegaUpdated }: BodegaDetalleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = searchParams.get("editar") === "true";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const form = useForm<EditarBodegaType>({
    resolver: zodResolver(EditarBodegaSchema),
    defaultValues: {
      nombre: bodega.nombre,
      descripcion: bodega.descripcion || "",
    },
  });

  const getEstadoValidacion = (validada: string | null) => {
    if (validada === null) return "Pendiente";
    return "Validada";
  };

  const getColorEstado = (validada: string | null) => {
    if (validada === null) return "text-yellow-600";
    return "text-green-600";
  };

  const onSubmit = async (data: EditarBodegaType) => {
    try {
      const bodegaActualizada = await actualizarBodega(data);
      onBodegaUpdated?.(bodegaActualizada);

      // Remover el parámetro de edición de la URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("editar");
      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error("Error al actualizar bodega:", error);
    }
  };

  const cancelarEdicion = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editar");
    router.push(`?${params.toString()}`);
    form.reset();
  };

  // Funciones del carrusel
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === bodega.multimedia.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? bodega.multimedia.length - 1 : prev - 1,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Información de la bodega */}
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
                      <p className="text-base text-gray-900">{bodega.nombre}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Cantidad de sucursales
                    </p>
                    <p className="text-base text-gray-900">
                      {bodega.sucursales.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Estado
                    </p>
                    <p
                      className={`text-base font-medium ${getColorEstado(bodega.validada)}`}
                    >
                      {getEstadoValidacion(bodega.validada)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Fecha de creación
                    </p>
                    <p className="text-base text-green-600">
                      {moment(bodega.created_at).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>

                {/* Segunda fila de información */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                        {bodega.descripcion || "Sin descripción"}
                      </p>
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

              {/* Carrusel de imágenes de la bodega */}
              <div className="lg:col-span-1">
                {bodega.multimedia && bodega.multimedia.length > 0 ? (
                  <div className="space-y-4">
                    {/* Imagen principal */}
                    <div className="relative aspect-square w-48 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={bodega.multimedia[currentImageIndex]?.url}
                        alt={`${bodega.nombre} - Imagen ${currentImageIndex + 1}`}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />

                      {/* Controles del carrusel */}
                      {bodega.multimedia.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Indicadores */}
                    {bodega.multimedia.length > 1 && (
                      <div className="flex justify-center space-x-2">
                        {bodega.multimedia.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-primary"
                                : "bg-gray-300 hover:bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Información de la imagen */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        {currentImageIndex + 1} de {bodega.multimedia.length}
                        {bodega.multimedia[currentImageIndex]?.es_portada && (
                          <span className="ml-2 text-primary font-medium">
                            (Portada)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square w-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm text-center">
                      Sin imágenes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
