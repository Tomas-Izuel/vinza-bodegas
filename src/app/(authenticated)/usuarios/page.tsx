import { EventosParams } from "@/api/eventos/evento.type";
import { getUsuarios } from "@/api/usuarios/usuario.service";
import { ListaUsuario } from "@/components/usuario/ListaUsuario";
import { Routes } from "@/lib/routes";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vinza - Usuarios y permisos",
  description: "Lista de usuarios y permisos de tu bodega",
};

interface EventosPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventosPage({ searchParams }: EventosPageProps) {
  const params = (await searchParams) as EventosParams;

  const usuarios = await getUsuarios();

  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios y permisos</h1>
        <Link
          href={Routes.CREAR_USUARIO}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Crear usuario
        </Link>
      </header>
      <main>
        <ListaUsuario usuarios={usuarios} />
      </main>
    </>
  );
}
