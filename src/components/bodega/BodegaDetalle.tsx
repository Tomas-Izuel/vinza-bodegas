"use client";

import { BodegaDetalle as BodegaDetalleType } from "@/api/bodegas/bodega.type";
import { useSearchParams, useRouter } from "next/navigation";
import { BodegaDetalleView } from "./BodegaDetalleView";
import { BodegaDetalleEditForm } from "./BodegaDetalleEditForm";

interface BodegaDetalleProps {
  bodega: BodegaDetalleType;
  onBodegaUpdated?: (bodegaActualizada: BodegaDetalleType) => void;
}

export function BodegaDetalle({ bodega, onBodegaUpdated }: BodegaDetalleProps) {
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
      <BodegaDetalleEditForm
        bodega={bodega}
        onBodegaUpdated={onBodegaUpdated}
        onCancel={handleCancel}
      />
    );
  }

  return <BodegaDetalleView bodega={bodega} />;
}
