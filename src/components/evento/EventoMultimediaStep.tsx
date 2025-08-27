"use client";

import { EventoMultimediaSchema } from "@/api/eventos/evento.type";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

// Tipo inferido del schema de Zod
type EventoMultimediaFields = z.infer<typeof EventoMultimediaSchema>;

interface EventoMultimediaStepProps {
  initialData?: Partial<EventoMultimediaFields>;
  onBack: () => void;
  onSubmit: (data: Partial<EventoMultimediaFields>) => void;
}

export function EventoMultimediaStep({
  initialData,
  onBack,
  onSubmit,
}: EventoMultimediaStepProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(
    initialData?.imagenes || [],
  );
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files) {
        const newFiles = Array.from(files).filter(
          (file) =>
            file.type.startsWith("image/") &&
            !selectedFiles.some((existing) => existing.name === file.name),
        );
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [selectedFiles],
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = () => {
    onSubmit({ imagenes: selectedFiles });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Multimedia</h3>
        <p className="text-gray-600">Agrega imágenes para tu evento</p>
      </div>

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
          Clickea o arrastra las imagenes que desees agregar
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
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
            ))}
          </div>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={handleSubmit}>Crear evento</Button>
      </div>
    </div>
  );
}
