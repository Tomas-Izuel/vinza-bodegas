import { getCategorias } from "@/api/categoria-evento/categoria-evento.service";
import { CrearEventoStepForm } from "@/components/evento/CrearEventoStepForm";
import { getSucursales } from "@/api/sucursales/sucursal.service";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

const CrearEventoPage = async () => {
  const [categorias, sucursales] = await Promise.all([
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
              <BreadcrumbLink href={Routes.CREAR_EVENTO}>Crear</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold mb-8">Crear evento</h1>
      </section>
      <CrearEventoStepForm categorias={categorias} sucursales={sucursales} />
    </>
  );
};

export default CrearEventoPage;
