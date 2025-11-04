"use client";

import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type SortOrder = "asc" | "desc";

export interface SortableHeaderProps<T extends string> {
  label: string;
  field?: T;
  allowedFields: readonly T[];
}

/**
 * Hook para manejar el ordenamiento de tablas
 */
export function useTableSort<T extends string>(allowedFields: readonly T[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Función común para manejar el ordenamiento
  const onSort = (field: T) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentOrderBy = currentParams.get("orderBy");

    // Si el campo ya está siendo ordenado, alternar entre asc y desc
    if (currentOrderBy) {
      const [currentField, currentOrder] = currentOrderBy.split(":");
      if (currentField === field) {
        // Alternar entre asc y desc
        const newOrder = currentOrder === "asc" ? "desc" : "asc";
        currentParams.set("orderBy", `${field}:${newOrder}`);
      } else {
        // Cambiar a nuevo campo con orden ascendente por defecto
        currentParams.set("orderBy", `${field}:asc`);
      }
    } else {
      // Si no hay ordenamiento, establecer el nuevo campo con asc por defecto
      currentParams.set("orderBy", `${field}:asc`);
    }

    // Cambiar página a 1 al cambiar el ordenamiento
    currentParams.set("page", "1");

    router.push(`${pathname}?${currentParams.toString()}`);
  };

  // Obtener el ordenamiento actual
  const getCurrentSort = (field: T): SortOrder | null => {
    const currentOrderBy = searchParams.get("orderBy");
    if (!currentOrderBy) return null;

    const [currentField, currentOrder] = currentOrderBy.split(":");
    if (currentField === field) {
      return currentOrder as SortOrder;
    }
    return null;
  };

  return { onSort, getCurrentSort };
}

/**
 * Componente reutilizable para headers de tabla ordenables
 */
export function SortableHeader<T extends string>({
  label,
  field,
  allowedFields,
}: SortableHeaderProps<T>) {
  const { onSort, getCurrentSort } = useTableSort(allowedFields);

  if (!field) {
    return <TableHead>{label}</TableHead>;
  }

  const currentSort = getCurrentSort(field);
  const isSortable = allowedFields.includes(field);

  if (!isSortable) {
    return <TableHead>{label}</TableHead>;
  }

  return (
    <TableHead>
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-2 hover:text-primary transition-colors"
      >
        {label}
        {currentSort === "asc" ? (
          <ArrowUp className="w-4 h-4" />
        ) : currentSort === "desc" ? (
          <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUpDown className="w-4 h-4 opacity-50" />
        )}
      </button>
    </TableHead>
  );
}
