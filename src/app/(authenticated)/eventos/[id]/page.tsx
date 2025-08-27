import { getEvento } from "@/api/eventos/eventos.service";
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

interface EventoDetallePageProps {
  params: {
    id: string;
  };
}

const EventoDetallePage = async ({ params }: EventoDetallePageProps) => {
  const { id } = params;

  // Obtener todos los datos necesarios en paralelo
  const [evento, categorias, sucursales] = await Promise.all([
    getEvento(id),
    getCategorias(),
    getSucursales(),
  ]);

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
        <InstanciasEvento instancias={[]} eventoId={evento.id} />
      </main>
    </>
  );
};

export default EventoDetallePage;
