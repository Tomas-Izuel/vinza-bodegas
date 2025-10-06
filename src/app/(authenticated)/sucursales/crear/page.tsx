import { getBodegaDetalle } from "@/api/bodegas/bodega.service";
import CrearSucursalForm from "@/components/sucursal/CrearSucursalForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Routes } from "@/lib/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Crear sucursal",
  description: "Crear una nueva sucursal para tu bodega",
};

const CrearSucursalPage = async () => {
  try {
    // Obtener la información de la bodega para extraer el ID
    const bodega = await getBodegaDetalle({});

    return (
      <>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={Routes.BODEGA_INFORMACION}>
                  Información de la bodega
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={Routes.CREAR_SUCURSAL}>
                  Crear sucursal
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>

        <main className="flex justify-center">
          <CrearSucursalForm bodegaId={bodega.id} />
        </main>
      </>
    );
  } catch (error) {
    // Para errores, dejar que el error.tsx se encargue
    throw error;
  }
};

export default CrearSucursalPage;
