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

import { eliminarUsuario } from "@/api/usuarios/usuario.service";
import { Usuario } from "@/api/usuarios/usuario.type";

interface EliminarUsuarioButtonProps {
  usuario: Usuario;
  onSuccess: () => void;
}

export function EliminarUsuarioButton({
  usuario,
  onSuccess,
}: EliminarUsuarioButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await eliminarUsuario(usuario.id);
      toast.success("Usuario eliminado exitosamente");
      onSuccess();
      setIsOpen(false);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar el usuario. Intente nuevamente.");
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
              usuario{" "}
              <strong>
                {usuario.nombre} {usuario.apellido}
              </strong>{" "}
              y todos sus datos asociados.
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
