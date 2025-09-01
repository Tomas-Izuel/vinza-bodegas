"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const BackButton = ({
  className = "",
  children = "Volver atrás",
}: BackButtonProps) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default BackButton;
