"use client";

import {
  BodegaDetalle as BodegaDetalleType,
  Multimedia,
} from "@/api/bodegas/bodega.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import moment from "moment";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BodegaDetalleViewProps {
  bodega: BodegaDetalleType;
}

export function BodegaDetalleView({ bodega }: BodegaDetalleViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getEstadoValidacion = (validada: string | null) => {
    if (validada === null) return "Pendiente";
    return "Validada";
  };

  const getColorEstado = (validada: string | null) => {
    if (validada === null) return "text-yellow-600";
    return "text-green-600";
  };

  const allMultimedia: Multimedia[] = bodega.multimedia || [];

  const imagenPrincipal =
    allMultimedia.find((m) => m.es_portada) || allMultimedia[0];

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allMultimedia.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + allMultimedia.length) % allMultimedia.length,
    );
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Información de la bodega */}
          <div className="lg:col-span-3 space-y-6">
            {/* Primera fila de información */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Nombre</p>
                <p className="text-base text-gray-900">{bodega.nombre}</p>
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
                <p className="text-sm font-medium text-gray-500 mb-2">Estado</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Teléfono
                </p>
                <p className="text-base text-gray-900">
                  {bodega.telefono || "Sin teléfono"}
                </p>
              </div>
            </div>

            {/* Tercera fila de información */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Descripción
                </p>
                <p className="text-base text-gray-900">
                  {bodega.descripcion || "Sin descripción"}
                </p>
              </div>
            </div>
          </div>

          {/* Imágenes de la bodega */}
          <div className="lg:col-span-1">
            {allMultimedia.length > 0 ? (
              <div className="space-y-4">
                {/* Imagen principal */}
                <div className="aspect-square w-48 bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer">
                  <Image
                    src={imagenPrincipal?.url || "/placeholder.png"}
                    alt={`${bodega.nombre} - Portada`}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      if (imagenPrincipal) {
                        openModal(allMultimedia.indexOf(imagenPrincipal));
                      }
                    }}
                  />

                  {/* Indicador de portada */}
                  {imagenPrincipal?.es_portada && (
                    <Badge
                      variant="default"
                      className="absolute top-2 left-2 bg-primary text-white"
                    >
                      Portada
                    </Badge>
                  )}

                  {/* Indicador de más imágenes */}
                  {allMultimedia.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{allMultimedia.length - 1} más
                    </div>
                  )}
                </div>

                {/* Miniaturas */}
                {allMultimedia.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allMultimedia.map((imagen, index) => (
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
                          alt={`${bodega.nombre} - Imagen ${index + 1}`}
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
                      <div className="relative w-full h-[90vh] flex items-center justify-center bg-black/5">
                        <Image
                          src={allMultimedia[selectedImageIndex]?.url || ""}
                          alt={`${bodega.nombre} - Imagen ${selectedImageIndex + 1}`}
                          fill
                          className="object-cover aspect-video"
                        />
                      </div>

                      {/* Controles de navegación */}
                      {allMultimedia.length > 1 && (
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
                          {imagenPrincipal &&
                            selectedImageIndex ===
                              allMultimedia.indexOf(imagenPrincipal) &&
                            "Imagen de portada"}
                          {(!imagenPrincipal ||
                            selectedImageIndex !==
                              allMultimedia.indexOf(imagenPrincipal)) &&
                            `Imagen ${selectedImageIndex + 1} de ${allMultimedia.length}`}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
      </CardContent>
    </Card>
  );
}
