"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEventosMiBodega } from "@/api/eventos/eventos.service";
import { Evento } from "@/api/eventos/evento.type";

interface EventoSearchInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}

export function EventoSearchInput({
  value,
  onChange,
  placeholder = "Buscar evento...",
}: EventoSearchInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [eventos, setEventos] = React.useState<Evento[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedEvento, setSelectedEvento] = React.useState<Evento | null>(
    null,
  );
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const hasLoadedOnceRef = React.useRef(false);

  const loadEventos = React.useCallback(async (search: string) => {
    setLoading(true);
    try {
      const response = await getEventosMiBodega({ search, limit: 20 });
      setEventos(response.items);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Solo cargar eventos cuando el popover se abre por primera vez
  React.useEffect(() => {
    if (open && !hasLoadedOnceRef.current) {
      loadEventos("");
      hasLoadedOnceRef.current = true;
    }
  }, [open, loadEventos]);

  // Buscar el evento seleccionado en la lista cargada cuando hay eventos disponibles
  React.useEffect(() => {
    if (value && eventos.length > 0 && !selectedEvento) {
      const evento = eventos.find((e) => e.id === value);
      if (evento) {
        setSelectedEvento(evento);
      }
    }
  }, [value, eventos, selectedEvento]);

  // Resetear el evento seleccionado cuando el valor se limpia
  React.useEffect(() => {
    if (!value) {
      setSelectedEvento(null);
    }
  }, [value]);

  // Cleanup del timeout cuando el componente se desmonte
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = React.useCallback(
    (term: string) => {
      setSearchTerm(term);

      // Limpiar timeout anterior
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Crear nuevo timeout para debounce
      searchTimeoutRef.current = setTimeout(() => {
        loadEventos(term);
      }, 300);
    },
    [loadEventos],
  );

  const handleSelect = (evento: Evento) => {
    setSelectedEvento(evento);
    onChange(evento.id);
    setOpen(false);
    setSearchTerm(""); // Limpiar búsqueda al seleccionar
  };

  const handleClear = () => {
    setSelectedEvento(null);
    onChange(undefined);
    setSearchTerm("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Resetear búsqueda cuando se cierra el popover
      setSearchTerm("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedEvento ? (
            <span className="truncate">{selectedEvento.nombre}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selectedEvento ? (
            <X
              className="ml-2 h-4 w-4 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Buscar evento..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="max-h-[300px] overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Cargando...
            </div>
          ) : eventos.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No se encontraron eventos
            </div>
          ) : (
            eventos.map((evento) => (
              <button
                key={evento.id}
                type="button"
                onClick={() => handleSelect(evento)}
                className={cn(
                  "w-full flex items-center gap-2 p-2 hover:bg-accent cursor-pointer",
                  selectedEvento?.id === evento.id && "bg-accent",
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4 shrink-0",
                    selectedEvento?.id === evento.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                <span className="text-sm">{evento.nombre}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
