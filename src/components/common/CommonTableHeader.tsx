"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic import del FiltersDrawer para optimizar la carga
const FiltersDrawer = dynamic(
  () =>
    import("./FiltersDrawer").then((mod) => ({ default: mod.FiltersDrawer })),
  {
    ssr: false,
  },
);

interface CommonTableHeaderProps {
  placeholder?: string;
  filtersForm?: React.ReactNode;
}

export function CommonTableHeader({
  placeholder,
  filtersForm,
}: CommonTableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Función para actualizar searchParams
  const updateSearchParams = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newSearch) {
        params.set("search", newSearch);
      } else {
        params.delete("search");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // Debounce para el search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateSearchParams(searchInput);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timer);
  }, [searchInput, search, updateSearchParams]);

  // Sincronizar el input con los searchParams cuando cambian externamente
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  return (
    <header className="flex justify-end items-center mb-6 p-4 pb-0 gap-4">
      {placeholder && (
        <Input
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="rounded-none max-w-xl"
        />
      )}
      <FiltersDrawer
        filtersForm={filtersForm}
        isOpen={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
      />
    </header>
  );
}
