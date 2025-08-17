import { EventosParams } from "@/api/eventos/evento.type";
import { getEventos } from "@/api/eventos/eventos.service";
import { ListaEvento } from "@/components/evento/ListaEvento.tsx";
import { Routes } from "@/lib/routes";
import Link from "next/link";

interface EventosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventosPage({ searchParams }: EventosPageProps) {
  const params = (await searchParams) as EventosParams;

  const eventos = await getEventos({
    ...params,
  });

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
        <ListaEvento eventos={eventos.items} meta={eventos.meta} />
      </main>
    </>
  );
}
