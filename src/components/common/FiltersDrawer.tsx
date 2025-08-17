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
import { Filter, X } from "lucide-react";
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
            <DrawerTitle className="flex items-center justify-between">
              Filtros{" "}
              <DrawerClose asChild>
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </DrawerTitle>

            <DrawerDescription>
              Aplica filtros para refinar los resultados
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">{filtersForm}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
