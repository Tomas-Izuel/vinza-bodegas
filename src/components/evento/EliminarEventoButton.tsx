"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { eliminarEvento } from "@/api/eventos/eventos.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EliminarEventoButtonProps {
  eventoId: string;
  eventoNombre: string;
  onEventoEliminado?: () => void;
}

export function EliminarEventoButton({
  eventoId,
  eventoNombre,
  onEventoEliminado,
}: EliminarEventoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEliminar = async () => {
    try {
      setIsLoading(true);
      await eliminarEvento(eventoId);

      setIsOpen(false);

      // Callback para actualizar la lista
      if (onEventoEliminado) {
        onEventoEliminado();
      }

      toast.success("Evento eliminado exitosamente");

      // Refrescar la página para actualizar la lista
      router.refresh();
    } catch (error) {
      toast.error("Error al eliminar evento", {
        description:
          error instanceof Error ? error.message : "Error al eliminar evento",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-500">
          <Trash className="w-4 h-4" />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar evento - {eventoNombre}</DialogTitle>
          <DialogDescription>
            Estás a punto de eliminar el evento <strong>{eventoNombre}</strong>{" "}
            de tus eventos. Esta acción no se puede revertir.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro que deseas continuar?
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleEliminar}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? "Eliminando..." : "Eliminar evento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
