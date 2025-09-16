import { getSucursalById } from "@/api/sucursales/sucursal.service";
import { SucursalDetalle } from "@/components/sucursal/SucursalDetalle";
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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Detalle de sucursal",
  description: "Información detallada de la sucursal",
};

interface SucursalDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

const SucursalDetallePage = async ({ params }: SucursalDetallePageProps) => {
  const { id } = await params;

  try {
    // Obtener la información de la sucursal
    const sucursal = await getSucursalById(id);

    // Si la sucursal no existe, mostrar página not-found
    if (!sucursal) {
      notFound();
    }

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
                <BreadcrumbLink href={Routes.VER_SUCURSAL + id}>
                  {sucursal.nombre}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Sucursal {sucursal.nombre}</h1>
            <Link href={"?editar=true"}>
              <Button>Editar esta sucursal</Button>
            </Link>
          </div>
        </section>

        <main className="flex flex-col gap-4">
          <SucursalDetalle sucursal={sucursal} />
        </main>
      </>
    );
  } catch (error) {
    // Si el error es específicamente que no encontró la sucursal, mostrar not-found
    if (error instanceof Error && error.message.includes("404")) {
      notFound();
    }
    // Para otros errores, dejar que el error.tsx se encargue
    throw error;
  }
};

export default SucursalDetallePage;
