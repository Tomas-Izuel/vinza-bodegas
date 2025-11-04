"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InlineErrorHandler from "../common/InlineErrorHandler";
import { eliminarRol, canDeleteRol } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";
import { toast } from "sonner";
import { useState, useEffect } from "react";

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
  const [canDelete, setCanDelete] = useState<boolean | null>(null);
  const [isCheckingDelete, setIsCheckingDelete] = useState(false);

  useEffect(() => {
    if (isOpen && rol) {
      const checkCanDelete = async () => {
        try {
          setIsCheckingDelete(true);
          const response = await canDeleteRol(rol.id);
          console.log("response", response);
          setCanDelete(response.canDelete);
        } catch {
          // Si hay error al verificar, asumimos que no se puede eliminar por seguridad
          setCanDelete(false);
        } finally {
          setIsCheckingDelete(false);
        }
      };

      checkCanDelete();
    } else {
      // Cambiar el estado cuando se cierra el modal
      setCanDelete(null);
    }
  }, [isOpen, rol]);

  const handleEliminar = async () => {
    if (!rol || !canDelete) {
      return;
    }

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar rol - {rol?.nombre}</DialogTitle>
          {isCheckingDelete ? (
            <DialogDescription>
              Verificando si se puede eliminar el rol...
            </DialogDescription>
          ) : canDelete === false ? (
            <DialogDescription>
              No se puede eliminar el rol <strong>{rol?.nombre}</strong>
              .
              <br />
              Este rol tiene usuarios relacionados.
            </DialogDescription>
          ) : (
            <DialogDescription>
              Estás a punto de eliminar el rol <strong>{rol?.nombre}</strong>
              .
              <br />
              Esta acción <strong>no</strong> se puede revertir.
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">
          {isCheckingDelete ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : canDelete === false ? (
            <p className="text-sm text-muted-foreground">
              No se puede eliminar el rol, tiene usuarios relacionados.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro que deseas continuar?
            </p>
          )}
        </div>
        {error && <InlineErrorHandler error={new Error(error)} />}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={cargando}>
            Cancelar
          </Button>
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleEliminar}
              disabled={cargando || isCheckingDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {cargando ? "Eliminando..." : "Eliminar rol"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
