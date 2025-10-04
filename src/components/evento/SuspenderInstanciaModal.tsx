"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { suspenderInstancia } from "@/api/eventos/eventos.service";
import { toast } from "sonner";

interface SuspenderInstanciaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  instanciaData: {
    id: number;
    eventoNombre: string;
    fecha: string;
  } | null;
  onInstanciaSuspendida: () => void;
}

export function SuspenderInstanciaModal({
  isOpen,
  onOpenChange,
  instanciaData,
  onInstanciaSuspendida,
}: SuspenderInstanciaModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuspender = async () => {
    if (!instanciaData) return;

    try {
      setIsLoading(true);
      await suspenderInstancia(instanciaData.id);

      toast.success("Instancia suspendida exitosamente");

      // Cerrar modal y refrescar datos
      onOpenChange(false);
      onInstanciaSuspendida();
    } catch (error) {
      console.error("Error al suspender instancia:", error);
      toast.error("Error al suspender la instancia");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!instanciaData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Suspender instancia de evento</DialogTitle>
        </DialogHeader>

        <DialogDescription className="space-y-4 py-4">
          <div>
            Estás a punto de suspender el evento{" "}
            <strong>{instanciaData.eventoNombre}</strong> el día{" "}
            <strong>{formatDate(instanciaData.fecha)}</strong>.
          </div>

          <div>
            Esta acción <strong>no</strong> se puede revertir.
          </div>

          <div>
            Se enviará una notificación a los usuarios que hayan reservado.
          </div>

          <div>¿Estás seguro que deseas continuar?</div>
        </DialogDescription>

        <DialogFooter className="gap-3 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-initial min-w-[120px]"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSuspender}
            disabled={isLoading}
            className="flex-1 sm:flex-initial min-w-[160px]"
          >
            {isLoading ? "Suspendiendo..." : "Suspender instancia"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
