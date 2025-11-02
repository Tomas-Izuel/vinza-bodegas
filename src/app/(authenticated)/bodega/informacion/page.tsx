import { getBodegaDetalle } from "@/api/bodegas/bodega.service";
import { SucursalesSearchParams } from "@/api/bodegas/bodega.type";
import { BodegaDetalle } from "@/components/bodega/BodegaDetalle";
import { ListaSucursales } from "@/components/sucursal/ListaSucursales";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Información de la bodega",
  description: "Información detallada de tu bodega y lista de sucursales",
};

interface BodegaInformacionPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BodegaInformacionPage = async ({
  searchParams,
}: BodegaInformacionPageProps) => {
  const rawParams = await searchParams;
  const params = rawParams as SucursalesSearchParams;
  const isEditing = rawParams.editar === "true";

  try {
    // Obtener la información de la bodega con parámetros de búsqueda
    const bodega = await getBodegaDetalle(params);

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
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Detalle bodega</h1>

            {!isEditing && (
              <Link href={"?editar=true"}>
                <Button>Editar bodega</Button>
              </Link>
            )}
          </div>
        </section>

        <main className="flex flex-col gap-4">
          <BodegaDetalle bodega={bodega} />

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Sucursales</h2>
              <Link href={Routes.CREAR_SUCURSAL}>
                <Button>Crear sucursal</Button>
              </Link>
            </div>
            <div className="bg-white border">
              <ListaSucursales sucursales={bodega.sucursales} />
            </div>
          </section>
        </main>
      </>
    );
  } catch (error) {
    // Para errores, dejar que el error.tsx se encargue
    throw error;
  }
};

export default BodegaInformacionPage;
