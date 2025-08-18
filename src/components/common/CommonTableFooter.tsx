"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CommonTableFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function CommonTableFooter({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: CommonTableFooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Función para actualizar la página en searchParams
  const updatePage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newPage > 1) {
        params.set("page", newPage.toString());
      } else {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      updatePage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      updatePage(currentPage + 1);
    }
  };

  // Calcular el rango de elementos mostrados
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <footer className="flex justify-between items-center p-4 bg-white border-t">
      <div className="text-sm text-gray-600">
        Mostrando {startItem} - {endItem} de {totalItems} elementos
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={isPreviousDisabled}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={isNextDisabled}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
