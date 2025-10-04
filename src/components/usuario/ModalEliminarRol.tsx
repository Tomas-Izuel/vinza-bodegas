"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InlineErrorHandler from "../common/InlineErrorHandler";
import { eliminarRol } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";
import { toast } from "sonner";
import { useState } from "react";

interface ModalEliminarRolProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rol: Rol | null;
  onRolEliminado?: () => void;
}

export function ModalEliminarRol({
  isOpen,
  onOpenChange,
  rol,
  onRolEliminado,
}: ModalEliminarRolProps) {
  const [error, setError] = useState<string | null>("");
  const [cargando, setCargando] = useState(false);

  const handleEliminar = async () => {
    if (!rol) return;

    setError("");
    setCargando(true);

    try {
      await eliminarRol(rol.id);
      toast.success("Rol eliminado correctamente");
      onOpenChange(false);
      onRolEliminado?.();
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      setError("Error al eliminar el rol. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar rol - {rol?.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Estás a punto de eliminar el rol <strong>{rol?.nombre}</strong>.
            </p>
            <p className="text-sm text-gray-600">
              Esta acción <strong>no</strong> se puede revertir.
            </p>
            <p className="text-sm text-gray-600">
              ¿Estás seguro que deseas continuar?
            </p>
          </div>

          {error && <InlineErrorHandler error={new Error(error)} />}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEliminar}
              disabled={cargando}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cargando ? "Eliminando..." : "Eliminar rol"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
