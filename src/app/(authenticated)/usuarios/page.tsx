import { CommonSearchParams } from "@/api/common.type";
import { getUsuarios } from "@/api/usuarios/usuario.service";
import { obtenerRoles } from "@/api/roles/rol.service";
import { ListaUsuario } from "@/components/usuario/ListaUsuario";
import { ListaRoles } from "@/components/usuario/ListaRoles";
import { CrearRolButton } from "@/components/usuario/CrearRolButton";
import { Routes } from "@/lib/routes";
import { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Vinza - Usuarios y permisos",
  description: "Lista de usuarios y permisos de tu bodega",
};

type UsuariosPageParams = CommonSearchParams & {
  tab?: string;
};

interface UsuariosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsuariosPage({
  searchParams,
}: UsuariosPageProps) {
  const params = (await searchParams) as UsuariosPageParams;
  const activeTab = (params.tab as string) || "usuarios";

  const [usuarios, roles] = await Promise.all([getUsuarios(), obtenerRoles()]);

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios y permisos</h1>
        <div className="flex gap-2">
          <Link href={Routes.CREAR_USUARIO}>
            <Button className="bg-primary text-white px-4 py-2 h-10 rounded">
              <UserPlus className="w-4 h-4" />
              Crear usuario
            </Button>
          </Link>
          <CrearRolButton />
        </div>
      </header>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="?tab=usuarios"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "usuarios"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Usuarios
            </Link>
            <Link
              href="?tab=roles"
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "roles"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Roles
            </Link>
          </nav>
        </div>
      </div>

      <main>
        {activeTab === "usuarios" && <ListaUsuario usuarios={usuarios} />}
        {activeTab === "roles" && <ListaRoles roles={roles} />}
      </main>
    </>
  );
}
