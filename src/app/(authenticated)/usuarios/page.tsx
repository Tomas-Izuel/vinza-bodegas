import { UsuariosPageClient } from "./usuarios-page-client";
import { Metadata } from "next";
import { Suspense } from "react";
import { getUsuariosMiBodega } from "@/api/usuarios/usuario.service";
import { obtenerRolesMiBodega } from "@/api/roles/rol.service";

export const metadata: Metadata = {
  title: "Vinza - Usuarios y permisos",
  description: "Lista de usuarios y permisos de tu bodega",
};

// Forzar renderizado dinámico porque usamos cookies para autenticación
export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const [usuarios, roles] = await Promise.all([
    getUsuariosMiBodega().then((data) => data.sort((a, b) => a.id - b.id)),
    obtenerRolesMiBodega(),
  ]);

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <UsuariosPageClient usuariosIniciales={usuarios} rolesIniciales={roles} />
    </Suspense>
  );
}
