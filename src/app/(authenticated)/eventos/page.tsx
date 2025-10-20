import { EventosParams } from "@/api/eventos/evento.type";
import { getEventosMiBodega } from "@/api/eventos/eventos.service";
import { getSucursalesMiBodega } from "@/api/sucursales/sucursal.service";
import { getCategorias } from "@/api/categoria-evento/categoria-evento.service";
import { getEstadosEventos } from "@/api/estados/estado.service";
import { ListaEvento } from "@/components/evento/ListaEvento.tsx";
import { Routes } from "@/lib/routes";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vinza - Eventos",
  description: "Lista de eventos de tu bodega",
};

interface EventosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventosPage({ searchParams }: EventosPageProps) {
  const params = (await searchParams) as EventosParams;

  // Obtener eventos, sucursales, categorías y estados en paralelo
  const [eventos, sucursales, categorias, estados] = await Promise.all([
    getEventosMiBodega({
      ...params,
    }),
    getSucursalesMiBodega(),
    getCategorias(),
    getEstadosEventos(),
  ]);

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <Link
          href={Routes.CREAR_EVENTO}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Nuevo evento
        </Link>
      </header>
      <main>
        <ListaEvento
          eventos={eventos.items}
          meta={eventos.meta}
          sucursales={sucursales}
          categorias={categorias}
          estados={estados}
        />
      </main>
    </>
  );
}
