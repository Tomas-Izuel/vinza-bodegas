"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Filter } from "lucide-react";
import { ReactNode } from "react";

interface FiltersDrawerProps {
  filtersForm?: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FiltersDrawer({
  filtersForm,
  isOpen,
  onOpenChange,
}: FiltersDrawerProps) {
  // Si no hay formulario de filtros, no renderizar nada
  if (!filtersForm) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
            <DrawerDescription>
              Aplica filtros para refinar los resultados
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">{filtersForm}</div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
