"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CrearRolModal } from "./CrearRolModal";
import { UserPlus } from "lucide-react";

interface CrearRolButtonProps {
  onRolCreado?: () => void;
}

export function CrearRolButton({ onRolCreado }: CrearRolButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Crear rol
      </Button>

      <CrearRolModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onRolCreado={onRolCreado}
      />
    </>
  );
}
