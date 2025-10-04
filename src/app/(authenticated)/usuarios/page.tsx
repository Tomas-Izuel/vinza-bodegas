import { UsuariosPageClient } from "./usuarios-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Usuarios y permisos",
  description: "Lista de usuarios y permisos de tu bodega",
};

export default function UsuariosPage() {
  return <UsuariosPageClient />;
}
