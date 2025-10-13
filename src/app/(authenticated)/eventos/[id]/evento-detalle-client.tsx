"use client";

import { useState } from "react";
import { getInstanciasEvento } from "@/api/eventos/eventos.service";
import { InstanciasEvento } from "@/components/evento/InstanciasEvento";
import { EventoDetalle } from "@/components/evento/EventoDetalle";
import { EventoDetalle as EventoDetalleType } from "@/api/eventos/evento.type";
import { CategoriaEvento } from "@/api/categoria-evento/categoria-evento.type";
import { Sucursal } from "@/api/sucursales/sucursal.type";

type InstanciaEvento = {
  id: number;
  fecha: string;
  reservas: number;
  estado: string;
};

interface EventoDetalleClientProps {
  evento: EventoDetalleType;
  categorias: CategoriaEvento[];
  sucursales: Sucursal[];
  instanciasIniciales: InstanciaEvento[];
}

export function EventoDetalleClient({
  evento,
  categorias,
  sucursales,
  instanciasIniciales,
}: EventoDetalleClientProps) {
  const [instancias, setInstancias] =
    useState<InstanciaEvento[]>(instanciasIniciales);

  const handleInstanciaUpdated = async () => {
    try {
      // Recargar las instancias desde el servidor
      const nuevasInstancias = await getInstanciasEvento(evento.id.toString());
      setInstancias(nuevasInstancias);
    } catch (error) {
      console.error("Error al recargar instancias:", error);
    }
  };

  return (
    <main className="flex flex-col gap-4">
      <EventoDetalle
        evento={evento}
        categorias={categorias}
        sucursales={sucursales}
      />
      <InstanciasEvento
        instancias={instancias}
        eventoId={evento.id}
        eventoNombre={evento.nombre}
        onInstanciaUpdated={handleInstanciaUpdated}
      />
    </main>
  );
}
