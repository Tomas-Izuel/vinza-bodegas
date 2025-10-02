"use client";

import { useState, useEffect } from "react";
import { getInstanciasEvento } from "@/api/eventos/eventos.service";
import { InstanciasEvento } from "./InstanciasEvento";

interface InstanciasEventoWrapperProps {
  eventoId: number;
}

export function InstanciasEventoWrapper({
  eventoId,
}: InstanciasEventoWrapperProps) {
  const [instancias, setInstancias] = useState<
    Array<{
      id: number;
      fecha: string;
      reservas: number;
      estado: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstancias = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await getInstanciasEvento(eventoId.toString());
      // console.log("📊 Datos de instancias recibidos:", data);
      setInstancias(data);
    } catch (err) {
      console.error("Error al cargar instancias:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar instancias",
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInstancias(true); // Mostrar loading en carga inicial
  }, [eventoId]);

  const handleInstanciaUpdated = () => {
    // Refrescar las instancias cuando se actualiza una (sin mostrar loading)
    // console.log("🔄 Refrescando instancias después de actualización...");
    fetchInstancias(false);
  };

  if (loading) {
    return (
      <section className="bg-white border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Instancias del evento
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando instancias...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Instancias del evento
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={() => fetchInstancias(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <InstanciasEvento
      instancias={instancias}
      eventoId={eventoId}
      onInstanciaUpdated={handleInstanciaUpdated}
    />
  );
}
