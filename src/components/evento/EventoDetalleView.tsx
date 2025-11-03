"use client";

import { EventoDetalle as EventoDetalleType } from "@/api/eventos/evento.type";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import { EventoImagenes } from "./EventoImagenes";

interface EventoDetalleViewProps {
  evento: EventoDetalleType;
}

export function EventoDetalleView({ evento }: EventoDetalleViewProps) {
  console.log("EVENTO _>", evento);
  const isUnico = !evento.recurrencias || evento.recurrencias.length === 0;
  const primeraRecurrencia = evento.recurrencias?.[0];

  const formatPrecio = (precio: string) => {
    return `$${parseFloat(precio).toLocaleString()}`;
  };

  const formatFecha = (fechaISO: string) => {
    return moment(fechaISO).format("MMM DD, YYYY");
  };

  const formatFechaCorta = (fechaISO: string) => {
    return moment(fechaISO).format("DD/MM/YYYY");
  };

  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Información del evento */}
          <div className="lg:col-span-3 space-y-6">
            {/* Primera fila de información */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Nombre</p>
                <p className="text-base text-gray-900">{evento.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Sucursal
                </p>
                <p className="text-base text-gray-900">
                  {evento.sucursal.nombre}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Categoría
                </p>
                <p className="text-base text-gray-900">
                  {evento.categoria.nombre}
                </p>
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
                <p className="text-base text-gray-900">
                  {evento.descripcion || "Sin descripción"}
                </p>
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
                <p className="text-sm font-medium text-gray-500 mb-2">Precio</p>
                <p className="text-base text-gray-900">
                  {formatPrecio(evento.precio)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Cupos</p>
                <p className="text-base text-gray-900">{evento.cupo}</p>
              </div>
            </div>

            {/* Tipo de evento y fechas */}
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-gray-500">
                Tipo de evento:
              </p>
              <Badge
                variant={isUnico ? "default" : "secondary"}
                className={isUnico ? "bg-primary text-white" : ""}
              >
                {isUnico ? "Único" : "Recurrente"}
              </Badge>
              {!isUnico && primeraRecurrencia && (
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Rango:</span> desde{" "}
                  {formatFechaCorta(primeraRecurrencia.fecha_desde)} hasta{" "}
                  {primeraRecurrencia.fecha_hasta
                    ? formatFechaCorta(primeraRecurrencia.fecha_hasta)
                    : "indefinido"}
                </span>
              )}
            </div>
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
      </CardContent>
    </Card>
  );
}
