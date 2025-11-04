"use client";

import {
  EventoDetalle as EventoDetalleType,
  EditarEventoSchema,
  EditarEventoType,
  EventoMultimedia,
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
import Image from "next/image";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actualizarEvento } from "@/api/eventos/eventos.service";
import { useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface EventoDetalleEditFormProps {
  evento: EventoDetalleType;
  categorias: CategoriaEvento[];
  sucursales: Sucursal[];
  onEventoUpdated?: (eventoActualizado: EventoDetalleType) => void;
  onCancel: () => void;
}

export function EventoDetalleEditForm({
  evento,
  categorias,
  sucursales,
  onEventoUpdated,
  onCancel,
}: EventoDetalleEditFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  // Estados para multimedia
  const [existingMultimedia, setExistingMultimedia] = useState<
    EventoMultimedia[]
  >(evento.multimedia || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedMultimediaIds, setRemovedMultimediaIds] = useState<number[]>(
    [],
  );
  const [multimediaPortada, setMultimediaPortada] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  // Inicializar portada desde multimedia existente
  useEffect(() => {
    const portada = existingMultimedia.find((m) => m.es_portada);
    if (portada) {
      setMultimediaPortada(`existing_${portada.id}`);
    } else if (evento.multimediaPortada) {
      setMultimediaPortada(`existing_${evento.multimediaPortada.id}`);
    }
  }, [existingMultimedia, evento.multimediaPortada]);

  // Funciones para manejar archivos
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files) {
        const newFiles = Array.from(files).filter(
          (file) =>
            file.type.startsWith("image/") &&
            !selectedFiles.some((existing) => existing.name === file.name),
        );
        setSelectedFiles((prev) => {
          const updatedFiles = [...prev, ...newFiles];
          // Si no hay portada seleccionada y hay archivos nuevos, establecer la primera como portada
          if (
            !multimediaPortada &&
            updatedFiles.length > 0 &&
            prev.length === 0 &&
            existingMultimedia.length === 0
          ) {
            setMultimediaPortada(updatedFiles[0].name);
          }
          return updatedFiles;
        });
      }
    },
    [selectedFiles, multimediaPortada, existingMultimedia.length],
  );

  const removeNewFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const fileToRemove = prev[index];
        const updatedFiles = prev.filter((_, i) => i !== index);

        // Si se elimina la imagen de portada (nueva), establecer la primera disponible como nueva portada
        if (fileToRemove.name === multimediaPortada) {
          const firstExisting = existingMultimedia.find(
            (m) => !removedMultimediaIds.includes(m.id),
          );
          const firstNew = updatedFiles[0];
          setMultimediaPortada(
            firstExisting
              ? `existing_${firstExisting.id}`
              : firstNew
                ? firstNew.name
                : "",
          );
        }

        return updatedFiles;
      });
    },
    [multimediaPortada, existingMultimedia, removedMultimediaIds],
  );

  const removeExistingMultimedia = useCallback(
    (multimediaId: number) => {
      setExistingMultimedia((prev) => {
        const itemToRemove = prev.find((m) => m.id === multimediaId);
        if (itemToRemove && itemToRemove.es_portada) {
          // Si se elimina la portada, establecer la primera disponible como nueva portada
          const remaining = prev.filter((m) => m.id !== multimediaId);
          const firstRemaining = remaining.find(
            (m) => !removedMultimediaIds.includes(m.id),
          );
          const firstNew = selectedFiles[0];
          setMultimediaPortada(
            firstRemaining
              ? `existing_${firstRemaining.id}`
              : firstNew
                ? firstNew.name
                : "",
          );
        }
        return prev.filter((m) => m.id !== multimediaId);
      });
      setRemovedMultimediaIds((prev) => [...prev, multimediaId]);
    },
    [removedMultimediaIds, selectedFiles],
  );

  const setAsPortada = useCallback((identifier: string) => {
    setMultimediaPortada(identifier);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect],
  );

  const onSubmit = async (data: EditarEventoType) => {
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();

      // Agregar campos básicos
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion || "");
      formData.append("cupo", data.cupo.toString());
      formData.append("precio", data.precio.toString());
      formData.append("categoriaId", data.categoriaId.toString());
      formData.append("sucursalId", data.sucursalId.toString());
      formData.append("estadoId", evento.estadoId.toString());

      // Agregar recurrencias como JSON string (mantener las existentes)
      if (evento.recurrencias && evento.recurrencias.length > 0) {
        const recurrenciasData = evento.recurrencias.map((rec) => ({
          dia: rec.dia,
          hora: rec.hora,
          fecha_desde: rec.fecha_desde,
          fecha_hasta: rec.fecha_hasta,
        }));
        formData.append("recurrencias", JSON.stringify(recurrenciasData));
      }

      // Agregar IDs de multimedia a eliminar
      if (removedMultimediaIds.length > 0) {
        formData.append(
          "removeMultimedia",
          JSON.stringify(removedMultimediaIds),
        );
      }

      // Agregar archivos multimedia nuevos
      selectedFiles.forEach((file) => {
        formData.append("multimedia", file);
      });

      // Agregar nombre de la portada
      if (multimediaPortada) {
        // Si es una imagen existente, extraer el nombre del archivo
        // Si es una nueva, usar el nombre del archivo directamente
        if (multimediaPortada.startsWith("existing_")) {
          const id = parseInt(multimediaPortada.replace("existing_", ""));
          const multimedia = existingMultimedia.find((m) => m.id === id);
          if (multimedia) {
            // Extraer el nombre del archivo de la URL
            const urlParts = multimedia.url.split("/");
            const fileName = urlParts[urlParts.length - 1];
            formData.append("multimediaPortada", fileName);
          }
        } else {
          formData.append("multimediaPortada", multimediaPortada);
        }
      }

      const result = await actualizarEvento(evento.id.toString(), formData);

      if (result.success && result.data) {
        onEventoUpdated?.(result.data);

        // Actualizar estado local con la respuesta
        setExistingMultimedia(result.data.multimedia || []);
        setSelectedFiles([]);
        setRemovedMultimediaIds([]);

        // Remover el parámetro de edición de la URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("editar");
        router.push(`?${params.toString()}`);

        toast.success("Evento actualizado exitosamente");
      } else {
        toast.error("Error al actualizar el evento", {
          description: result.error || "Error al actualizar el evento",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el evento";
      toast.error("Error al actualizar el evento", {
        description: errorMessage,
      });
    }
  };

  const cancelarEdicion = () => {
    form.reset();
    // Cambiar estados de multimedia
    setExistingMultimedia(evento.multimedia || []);
    setSelectedFiles([]);
    setRemovedMultimediaIds([]);
    const portada =
      evento.multimediaPortada || evento.multimedia?.find((m) => m.es_portada);
    setMultimediaPortada(portada ? `existing_${portada.id}` : "");
    onCancel();
  };

  const hasChanges =
    form.formState.isDirty ||
    selectedFiles.length > 0 ||
    removedMultimediaIds.length > 0 ||
    (() => {
      const currentPortada =
        evento.multimediaPortada ||
        existingMultimedia.find((m) => m.es_portada);
      const expectedPortada = currentPortada
        ? `existing_${currentPortada.id}`
        : "";
      return multimediaPortada !== expectedPortada;
    })();

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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Sucursal
                    </p>
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Categoría
                    </p>
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Fecha de creación
                    </p>
                    <p className="text-base text-green-600">
                      {moment(evento.created_at).format("MMM DD, YYYY")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Precio
                    </p>
                    <FormField
                      control={form.control}
                      name="precio"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Cupos
                    </p>
                    <FormField
                      control={form.control}
                      name="cupo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sección de Multimedia */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Multimedia</h3>
                      <p className="text-sm text-gray-600">
                        Gestiona las imágenes de tu evento
                      </p>
                    </div>
                    {(existingMultimedia.filter(
                      (m) => !removedMultimediaIds.includes(m.id),
                    ).length > 0 ||
                      selectedFiles.length > 0) && (
                      <span className="text-sm text-gray-500">
                        {existingMultimedia.filter(
                          (m) => !removedMultimediaIds.includes(m.id),
                        ).length + selectedFiles.length}{" "}
                        imagen
                        {existingMultimedia.filter(
                          (m) => !removedMultimediaIds.includes(m.id),
                        ).length +
                          selectedFiles.length !==
                        1
                          ? "es"
                          : ""}{" "}
                        {existingMultimedia.filter(
                          (m) => !removedMultimediaIds.includes(m.id),
                        ).length +
                          selectedFiles.length !==
                        1
                          ? "disponibles"
                          : "disponible"}
                      </span>
                    )}
                  </div>

                  {/* Área de upload */}
                  <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center transition-colors
                        ${
                          dragActive
                            ? "border-primary bg-primary/5"
                            : "border-gray-300 hover:border-gray-400"
                        }
                      `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-3 text-sm">
                      Clickea o arrastra las imágenes que desees agregar
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                      id="file-upload-evento-edit"
                    />
                    <label
                      htmlFor="file-upload-evento-edit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
                    >
                      Seleccionar imágenes
                    </label>
                  </div>

                  {/* Lista de multimedia existente y nueva */}
                  {(existingMultimedia.filter(
                    (m) => !removedMultimediaIds.includes(m.id),
                  ).length > 0 ||
                    selectedFiles.length > 0) && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Imágenes disponibles</h4>
                        <p className="text-xs text-gray-500">
                          Clic derecho para establecer como portada
                        </p>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                        {/* Multimedia existente */}
                        {existingMultimedia
                          .filter((m) => !removedMultimediaIds.includes(m.id))
                          .map((multimedia) => {
                            const identifier = `existing_${multimedia.id}`;
                            const isPortada =
                              multimediaPortada === identifier ||
                              (multimedia.es_portada &&
                                !multimediaPortada &&
                                !selectedFiles.length);
                            return (
                              <div
                                key={multimedia.id}
                                className="relative group"
                              >
                                <Image
                                  src={multimedia.url}
                                  alt={`Multimedia ${multimedia.id}`}
                                  width={96}
                                  height={96}
                                  className={`w-full h-24 object-cover rounded-lg ${
                                    isPortada
                                      ? "ring-2 ring-primary ring-offset-1"
                                      : ""
                                  }`}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setAsPortada(identifier);
                                  }}
                                />

                                {/* Indicador de portada */}
                                {isPortada && (
                                  <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                    Portada
                                  </div>
                                )}

                                {/* Botón de eliminar */}
                                <button
                                  onClick={() =>
                                    removeExistingMultimedia(multimedia.id)
                                  }
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}

                        {/* Archivos nuevos */}
                        {selectedFiles.map((file, index) => {
                          const isPortada = file.name === multimediaPortada;
                          return (
                            <div key={index} className="relative group">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                width={96}
                                height={96}
                                className={`w-full h-24 object-cover rounded-lg ${
                                  isPortada
                                    ? "ring-2 ring-primary ring-offset-1"
                                    : ""
                                }`}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  setAsPortada(file.name);
                                }}
                              />

                              {/* Indicador de portada */}
                              {isPortada && (
                                <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                                  Portada
                                </div>
                              )}

                              {/* Botón de eliminar */}
                              <button
                                onClick={() => removeNewFile(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>

                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {file.name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting || !hasChanges}
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
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
