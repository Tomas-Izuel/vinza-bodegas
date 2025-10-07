"use client";

import { useState } from "react";
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

import { eliminarRol } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";

interface EliminarRolButtonProps {
  rol: Rol;
  onSuccess: () => void;
}

export function EliminarRolButton({ rol, onSuccess }: EliminarRolButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await eliminarRol(rol.id);
      toast.success("Rol eliminado exitosamente");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      toast.error("Error al eliminar el rol. Intente nuevamente.");
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              rol <strong>{rol.nombre}</strong> y todos sus permisos asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
