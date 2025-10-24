import { obtenerPerfilUsuario } from "@/api/usuarios/usuario.service";
import { obtenerRoles } from "@/api/roles/rol.service";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Routes } from "@/lib/routes";
import { Metadata } from "next";
import PerfilUsuarioForm from "@/components/usuario/PerfilUsuarioForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vinza - Mi perfil",
  description: "Información de tu perfil de usuario",
};

const PerfilPage = async () => {
  try {
    // Obtener la información del perfil del usuario y los roles disponibles
    const [perfil, rolesResponse] = await Promise.all([
      obtenerPerfilUsuario(),
      obtenerRoles(),
    ]);

    return (
      <>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={Routes.PERFIL}>Mi perfil</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mi perfil</h1>
          </div>
        </section>

        <main className="flex justify-center">
          <PerfilUsuarioForm
            perfil={perfil}
            rolesDisponibles={rolesResponse || []}
          />
        </main>
      </>
    );
  } catch (error) {
    // Para errores, dejar que el error.tsx se encargue
    throw error;
  }
};

export default PerfilPage;
