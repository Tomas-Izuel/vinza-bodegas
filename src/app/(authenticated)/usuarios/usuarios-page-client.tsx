"use client";

import { useState } from "react";
import { getUsuariosMiBodega } from "@/api/usuarios/usuario.service";
import { obtenerRolesMiBodega } from "@/api/roles/rol.service";
import { ListaUsuario } from "@/components/usuario/ListaUsuario";
import { ListaRoles } from "@/components/usuario/ListaRoles";
import { CrearRolButton } from "@/components/usuario/CrearRolButton";
import { CrearUsuarioButton } from "@/components/usuario/CrearUsuarioButton";
import { Rol } from "@/api/roles/rol.type";
import { Usuario } from "@/api/usuarios/usuario.type";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface UsuariosPageClientProps {
  usuariosIniciales: Usuario[];
  rolesIniciales: Rol[];
}

export function UsuariosPageClient({
  usuariosIniciales,
  rolesIniciales,
}: UsuariosPageClientProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "usuarios";

  const [usuarios, setUsuarios] = useState<Usuario[]>(
    [...usuariosIniciales].sort((a, b) => a.id - b.id),
  );

  const [roles, setRoles] = useState<Rol[]>(rolesIniciales);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuariosMiBodega(),
        obtenerRolesMiBodega(),
      ]);
      setUsuarios(usuariosData.sort((a, b) => a.id - b.id));
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleRolActualizado = () => {
    cargarDatos();
  };

  const handleUsuarioCreado = () => {
    cargarDatos();
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios y permisos</h1>
        <div className="flex gap-2">
          <CrearUsuarioButton onUsuarioCreado={handleUsuarioCreado} />
          <CrearRolButton onRolCreado={handleRolActualizado} />
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
        {activeTab === "usuarios" && (
          <ListaUsuario
            usuarios={usuarios}
            onUsuarioActualizado={handleUsuarioCreado}
          />
        )}
        {activeTab === "roles" && (
          <ListaRoles
            roles={roles.filter((rol) => rol.bodegaId)}
            usuarios={usuarios}
            onRolActualizado={handleRolActualizado}
          />
        )}
      </main>
    </>
  );
}
