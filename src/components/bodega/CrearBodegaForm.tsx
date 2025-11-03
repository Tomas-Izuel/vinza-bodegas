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
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

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

  // Estados para multimedia
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [multimediaPortada, setMultimediaPortada] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  // Observar cambios en el campo dirección para actualizar el mapa
  const direccionValue = form.watch("direccion");

  // Genero la coordenada de la direccion
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
          // Si es la primera imagen cargada y no hay portada seleccionada, establecerla como portada
          if (
            prev.length === 0 &&
            updatedFiles.length > 0 &&
            !multimediaPortada
          ) {
            setMultimediaPortada(updatedFiles[0].name);
          }
          return updatedFiles;
        });
      }
    },
    [selectedFiles, multimediaPortada],
  );

  const removeFile = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const fileToRemove = prev[index];
        const updatedFiles = prev.filter((_, i) => i !== index);

        // Si se elimina la imagen de portada, establecer la primera disponible como nueva portada
        if (fileToRemove.name === multimediaPortada) {
          setMultimediaPortada(
            updatedFiles.length > 0 ? updatedFiles[0].name : "",
          );
        }

        return updatedFiles;
      });
    },
    [multimediaPortada],
  );

  const setAsPortada = useCallback((fileName: string) => {
    setMultimediaPortada(fileName);
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

  const onSubmit = async (data: CrearBodegaDto) => {
    try {
      // Crear FormData para enviar archivos
      const formData = new FormData();

      // Agregar campos básicos
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);
      formData.append("direccion", data.direccion);
      formData.append("telefono", data.telefono);
      formData.append("latitude", coordinates?.lat.toString() || "");
      formData.append("longitude", coordinates?.lng.toString() || "");
      if (data.aclaraciones) {
        formData.append("aclaraciones", data.aclaraciones);
      }

      // Agregar archivos multimedia
      selectedFiles.forEach((file) => {
        formData.append("multimedia", file);
      });

      // Agregar nombre de la portada
      if (multimediaPortada) {
        formData.append("multimediaPortada", multimediaPortada);
      }

      await crearBodega(formData);
      toast.success("Bodega creada exitosamente");

      router.push(Routes.ESPERANDO_VALIDACION);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear la bodega";
      toast.error("Error al crear la bodega", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="border-b">
        <h1>Crear tu bodega</h1>
        <p>Para continuar, necesitas completar la información de tu bodega</p>
      </CardHeader>
      <CardContent className="p-8 min-h-fit">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            id="crear-bodega-form"
          >
            {/* Primera fila - Campos principales en 4 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Mapa y Descripciones - Layout en 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mapa */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ubicación</h3>
                <MapView
                  direccion={direccionValue}
                  setCoordinates={setCoordinates}
                  coordinates={coordinates}
                />
              </div>

              {/* Descripciones */}
              <div className="space-y-4">
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
                          className="min-h-[140px] resize-none"
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
                          className="min-h-[140px] resize-none"
                          {...field}
                          value={field.value || ""}
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
                    Agrega imágenes para mostrar tu bodega
                  </p>
                </div>
                {selectedFiles.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedFiles.length} imagen
                    {selectedFiles.length !== 1 ? "es" : ""} seleccionada
                    {selectedFiles.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Área de upload más compacta */}
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
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
                >
                  Seleccionar imágenes
                </label>
              </div>

              {/* Lista de archivos seleccionados */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Imágenes seleccionadas</h4>
                    <p className="text-xs text-gray-500">
                      Clic derecho para establecer como portada
                    </p>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
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
                            onClick={() => removeFile(index)}
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
