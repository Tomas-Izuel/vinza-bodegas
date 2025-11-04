"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  pausarUsuario,
  despausarUsuario,
} from "@/api/usuarios/usuario.service";
import { Usuario } from "@/api/usuarios/usuario.type";

interface PausarUsuarioButtonProps {
  usuario: Usuario;
  onSuccess: () => void;
}

export function PausarUsuarioButton({
  usuario,
  onSuccess,
}: PausarUsuarioButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isPaused = !!usuario.pausado;

  const handleTogglePause = async () => {
    try {
      setIsLoading(true);
      if (isPaused) {
        await despausarUsuario(usuario.id);
        toast.success("Usuario activado exitosamente");
      } else {
        await pausarUsuario(usuario.id);
        toast.success("Usuario pausado exitosamente");
      }
      onSuccess();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      toast.error(
        `Error al ${isPaused ? "activar" : "pausar"} el usuario. Intente nuevamente.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleTogglePause}
      disabled={isLoading}
      className={isPaused ? "text-green-600" : "text-orange-600"}
    >
      {isPaused ? (
        <>
          <Play className="w-4 h-4" />
          Activar
        </>
      ) : (
        <>
          <Pause className="w-4 h-4" />
          Pausar
        </>
      )}
    </Button>
  );
}
