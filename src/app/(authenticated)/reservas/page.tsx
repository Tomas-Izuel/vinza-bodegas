import { ReservasParams } from "@/api/reservas/reserva.type";
import { getReservas } from "@/api/reservas/reserva.service";
import { ListaReserva } from "@/components/reserva/ListaReserva";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Reservas",
  description: "Lista de reservas de tu bodega",
};

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
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reservas</h1>
      </header>
      <main>
        <ListaReserva reservas={reservas.items} meta={reservas.meta} />
      </main>
    </>
  );
}
