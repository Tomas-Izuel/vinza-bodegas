"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "../ui/input";
import { useState, useEffect, useRef } from "react";
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
  const searchParamsRef = useRef(searchParams);

  // Mantener searchParams actualizado en el ref
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Debounce para el search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        const params = new URLSearchParams();

        // Preservar todos los params actuales excepto search
        searchParamsRef.current.forEach((value, key) => {
          if (key !== "search") {
            params.set(key, value);
          }
        });

        if (searchInput) {
          params.set("search", searchInput);
        }

        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        router.push(newUrl);
      }
    }, 500); // 500ms de debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

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
