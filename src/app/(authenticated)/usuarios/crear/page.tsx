import { Routes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CrearUsuarioForm } from "@/components/usuario/CrearUsuarioForm";

export default function CrearUsuarioPage() {
  return (
    <>
      <header className="mb-6">
        <Link href={Routes.USUARIOS}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">Crear Usuario</h1>
        <p className="text-gray-600 mt-2">
          Complete los datos para crear un nuevo usuario en el sistema.
        </p>
      </header>
      <CrearUsuarioForm />
    </>
  );
}
