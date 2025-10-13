"use client";

import { useState } from "react";
import { ReservasParams, ReservasResponse } from "@/api/reservas/reserva.type";
import { getReservas } from "@/api/reservas/reserva.service";
import { ListaReserva } from "@/components/reserva/ListaReserva";

interface ReservasPageClientProps {
  reservasIniciales: ReservasResponse;
  searchParams: ReservasParams;
}

export function ReservasPageClient({
  reservasIniciales,
  searchParams,
}: ReservasPageClientProps) {
  const [reservas, setReservas] = useState(reservasIniciales);
  const [cargando, setCargando] = useState(false);

  // Función para refrescar las reservas
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const nuevasReservas = await getReservas(searchParams);
      setReservas(nuevasReservas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleReservaActualizada = () => {
    cargarDatos();
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservas</h1>
      </header>
      <main>
        <ListaReserva
          reservas={reservas.items}
          meta={reservas.meta}
          onRefresh={handleReservaActualizada}
        />
      </main>
    </>
  );
}
