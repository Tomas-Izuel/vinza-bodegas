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
    <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white z-10 border-b">
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

            {/* Sección de Multimedia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Multimedia</h3>
              <p className="text-sm text-gray-600">
                Agrega imágenes para mostrar tu bodega
              </p>

              {/* Área de upload */}
              <div
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-colors
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
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
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
                  <h4 className="font-medium">
                    Imágenes seleccionadas ({selectedFiles.length})
                  </h4>
                  <p className="text-sm text-gray-600">
                    Haz clic derecho en una imagen para establecerla como
                    portada
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {selectedFiles.map((file, index) => {
                      const isPortada = file.name === multimediaPortada;
                      return (
                        <div key={index} className="relative group">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            width={128}
                            height={128}
                            className={`w-full h-32 object-cover rounded-lg ${
                              isPortada
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            }`}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setAsPortada(file.name);
                            }}
                          />

                          {/* Indicador de portada */}
                          {isPortada && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                              Portada
                            </div>
                          )}

                          {/* Botón de eliminar */}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
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
