import { getCategorias } from "@/api/categoria-evento/categoria-evento.service";
import { CrearEventoStepForm } from "@/components/evento/CrearEventoStepForm";
import { getSucursales } from "@/api/sucursales/sucursal.service";

export const dynamic = "force-dynamic";

const CrearEventoPage = async () => {
  const [categorias, sucursales] = await Promise.all([
    getCategorias(),
    getSucursales(),
  ]);
  return (
    <>
      <section>
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-600 mb-4">Eventos &gt; Crear</div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-8">Crear evento</h1>
      </section>
      <CrearEventoStepForm categorias={categorias} sucursales={sucursales} />
    </>
  );
};

export default CrearEventoPage;
