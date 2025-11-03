"use client";

import { EventoMultimedia } from "@/api/eventos/evento.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface EventoImagenesProps {
  imagenes: EventoMultimedia[];
  imagenPortada?: EventoMultimedia;
  nombreEvento: string;
}

export function EventoImagenes({
  imagenes,
  imagenPortada,
  nombreEvento,
}: EventoImagenesProps) {
  console.log("imagenes", imagenes);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="aspect-square w-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-gray-500 text-sm">Sin imágenes</p>
      </div>
    );
  }

  const imagenPrincipal = imagenPortada || imagenes[0];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + imagenes.length) % imagenes.length,
    );
  };

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="aspect-square w-48 bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer">
        <Image
          src={imagenPrincipal.url || ""}
          alt={`${nombreEvento} - Portada`}
          width={192}
          height={192}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onClick={() => openModal(imagenes.indexOf(imagenPrincipal))}
        />

        {/* Indicador de portada */}
        {imagenPortada && (
          <Badge
            variant="default"
            className="absolute top-2 left-2 bg-primary text-white"
          >
            Portada
          </Badge>
        )}

        {/* Indicador de más imágenes */}
        {imagenes.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            +{imagenes.length - 1} más
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto max-w-[200px] pb-2">
          {imagenes.map((imagen, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                imagen === imagenPrincipal
                  ? "border-primary"
                  : "border-transparent hover:border-gray-300"
              }`}
              onClick={() => openModal(index)}
            >
              <Image
                src={imagen.url || ""}
                alt={`${nombreEvento} - Imagen ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal de imagen completa */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-fit h-fit min-w-7xl p-0">
          <div className="relative">
            {/* Imagen principal */}
            <div className="relative aspect-video w-full flex items-center justify-center bg-black/5">
              <Image
                src={imagenes[selectedImageIndex].url || ""}
                alt={`${nombreEvento} - Imagen ${selectedImageIndex + 1}`}
                fill
                className="object-cover aspect-video"
              />
            </div>

            {/* Controles de navegación */}
            {imagenes.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Información de la imagen */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded">
              <p className="text-sm">
                {selectedImageIndex === imagenes.indexOf(imagenPrincipal) &&
                  "Imagen de portada"}
                {selectedImageIndex !== imagenes.indexOf(imagenPrincipal) &&
                  `Imagen ${selectedImageIndex + 1} de ${imagenes.length}`}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
