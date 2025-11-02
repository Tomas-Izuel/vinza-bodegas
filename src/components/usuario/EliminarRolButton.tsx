"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { eliminarRol, canDeleteRol } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";

interface EliminarRolButtonProps {
  rol: Rol;
  onSuccess: () => void;
}

export function EliminarRolButton({ rol, onSuccess }: EliminarRolButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canDelete, setCanDelete] = useState<boolean | null>(null);
  const [isCheckingDelete, setIsCheckingDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const checkCanDelete = async () => {
        try {
          setIsCheckingDelete(true);
          const response = await canDeleteRol(rol.id);
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
  }, [isOpen, rol.id]);

  const handleDelete = async () => {
    if (!canDelete) {
      return;
    }

    try {
      setIsLoading(true);
      await eliminarRol(rol.id);
      toast.success("Rol eliminado exitosamente");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar el rol";

      toast.error("Error al eliminar el rol", {
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
        <Trash2 className="w-4 h-4" />
        Borrar
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar rol - {rol.nombre}</DialogTitle>
            {isCheckingDelete ? (
              <DialogDescription>
                Verificando si se puede eliminar el rol...
              </DialogDescription>
            ) : canDelete === false ? (
              <DialogDescription>
                No se puede eliminar el rol <strong>{rol.nombre}</strong>.
                <br />
                Este rol tiene usuarios relacionados.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Estás a punto de eliminar el rol <strong>{rol.nombre}</strong>.
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
                onClick={handleDelete}
                disabled={isLoading || isCheckingDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                {isLoading ? "Eliminando..." : "Eliminar rol"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
