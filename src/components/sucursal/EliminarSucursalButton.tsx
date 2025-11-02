"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import {
  eliminarSucursal,
  canDeleteSucursal,
} from "@/api/sucursales/sucursal.service";
import { Sucursal } from "@/api/sucursales/sucursal.type";
import { toast } from "sonner";

interface EliminarSucursalButtonProps {
  sucursal: Sucursal;
  onSuccess: () => void;
}

export function EliminarSucursalButton({
  sucursal,
  onSuccess,
}: EliminarSucursalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canDelete, setCanDelete] = useState<boolean | null>(null);
  const [isCheckingDelete, setIsCheckingDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const checkCanDelete = async () => {
        try {
          setIsCheckingDelete(true);
          const response = await canDeleteSucursal(sucursal.id);
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
      // Resetear el estado cuando se cierra el modal
      setCanDelete(null);
    }
  }, [isOpen, sucursal.id]);

  const handleEliminar = async () => {
    if (!canDelete) {
      return;
    }

    try {
      setIsLoading(true);
      await eliminarSucursal(sucursal.id);

      setIsOpen(false);

      toast.success("La instancia seleccionada fue eliminada con éxito");

      // Callback para actualizar la lista
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al eliminar la sucursal";

      toast.error("Error al eliminar la sucursal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-red-500"
      >
        <Trash className="w-4 h-4" />
        Borrar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar sucursal - {sucursal.nombre}</DialogTitle>
            {isCheckingDelete ? (
              <DialogDescription>
                Verificando si se puede eliminar la sucursal...
              </DialogDescription>
            ) : canDelete === false ? (
              <DialogDescription>
                No se puede eliminar la sucursal{" "}
                <strong>{sucursal.nombre}</strong>
                .
                <br />
                Esta sucursal tiene reservas asociadas. Debe eliminar las
                reservas asociadas antes de poder eliminar la sucursal.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Estás a punto de eliminar la sucursal{" "}
                <strong>{sucursal.nombre}</strong>
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
                Por favor, elimine las reservas asociadas a esta sucursal antes
                de intentar eliminarla.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                ¿Estás seguro que deseas continuar?
              </p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {canDelete && (
              <Button
                variant="destructive"
                onClick={handleEliminar}
                disabled={isLoading || isCheckingDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? "Eliminando..." : "Eliminar sucursal"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
