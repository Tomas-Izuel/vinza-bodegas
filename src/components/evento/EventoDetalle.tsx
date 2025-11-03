"use client";

import { EventoDetalle as EventoDetalleType } from "@/api/eventos/evento.type";
import { CategoriaEvento } from "@/api/categoria-evento/categoria-evento.type";
import { Sucursal } from "@/api/sucursales/sucursal.type";
import { useSearchParams, useRouter } from "next/navigation";
import { EventoDetalleView } from "./EventoDetalleView";
import { EventoDetalleEditForm } from "./EventoDetalleEditForm";

interface EventoDetalleProps {
  evento: EventoDetalleType;
  categorias: CategoriaEvento[];
  sucursales: Sucursal[];
  onEventoUpdated?: (eventoActualizado: EventoDetalleType) => void;
}

export function EventoDetalle({
  evento,
  categorias,
  sucursales,
  onEventoUpdated,
}: EventoDetalleProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isEditing = searchParams.get("editar") === "true";

  const handleCancel = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editar");
    router.push(`?${params.toString()}`);
  };

  if (isEditing) {
    return (
      <EventoDetalleEditForm
        evento={evento}
        categorias={categorias}
        sucursales={sucursales}
        onEventoUpdated={onEventoUpdated}
        onCancel={handleCancel}
      />
    );
  }

  return <EventoDetalleView evento={evento} />;
}
