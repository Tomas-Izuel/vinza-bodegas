import { getEvento, getInstanciasEvento } from "@/api/eventos/eventos.service";
import { getCategorias } from "@/api/categoria-evento/categoria-evento.service";
import { getSucursales } from "@/api/sucursales/sucursal.service";
import { EventoDetalle } from "@/components/evento/EventoDetalle";
import { InstanciasEvento } from "@/components/evento/InstanciasEvento";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EventoDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

const EventoDetallePage = async ({ params }: EventoDetallePageProps) => {
  const { id } = await params;

  try {
    // Obtener todos los datos necesarios en paralelo
    const [evento, categorias, sucursales, instancias] = await Promise.all([
      getEvento(id),
      getCategorias(),
      getSucursales(),
      getInstanciasEvento(id),
    ]);

    // Si el evento no existe, mostrar página not-found
    if (!evento) {
      notFound();
    }

    return (
      <>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={Routes.EVENTOS}>Eventos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={Routes.VER_EVENTO + id}>
                  {evento.nombre}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center">
            <h1>{evento.nombre}</h1>
            <Link href={"?editar=true"}>
              <Button>Editar evento</Button>
            </Link>
          </div>
        </section>
        <main className="flex flex-col gap-4">
          <EventoDetalle
            evento={evento}
            categorias={categorias}
            sucursales={sucursales}
          />
          <InstanciasEvento instancias={instancias} eventoId={evento.id} />
        </main>
      </>
    );
  } catch (error) {
    // Si el error es específicamente que no encontró el evento, mostrar not-found
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    // Para otros errores, dejar que el error.tsx se encargue
    throw error;
  }
};

export default EventoDetallePage;
