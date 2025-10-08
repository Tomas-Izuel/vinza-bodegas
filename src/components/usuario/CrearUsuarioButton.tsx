"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CrearUsuarioModal } from "./CrearUsuarioModal";

interface CrearUsuarioButtonProps {
  onUsuarioCreado?: () => void;
}

export function CrearUsuarioButton({
  onUsuarioCreado,
}: CrearUsuarioButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded h-10"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Crear usuario
      </Button>

      <CrearUsuarioModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onUsuarioCreado={onUsuarioCreado}
      />
    </>
  );
}
