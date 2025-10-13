import { ReservasParams } from "@/api/reservas/reserva.type";
import { getReservas } from "@/api/reservas/reserva.service";
import { ReservasPageClient } from "./reservas-page-client";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Vinza - Reservas",
  description: "Lista de reservas de tu bodega",
};

// Forzar renderizado dinámico porque usamos cookies para autenticación
export const dynamic = "force-dynamic";

interface ReservasPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReservasPage({
  searchParams,
}: ReservasPageProps) {
  const params = (await searchParams) as ReservasParams;

  const reservas = await getReservas({
    ...params,
  });

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservasPageClient reservasIniciales={reservas} searchParams={params} />
    </Suspense>
  );
}
