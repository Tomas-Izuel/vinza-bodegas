import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarX, ArrowLeft, Plus, List } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";

export default function EventoNotFound() {
  return (
    <div className="flex items-center justify-center my-auto h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
            <CalendarX className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Evento No Encontrado
          </CardTitle>
          <CardDescription className="text-gray-600">
            El evento que buscas no existe o ha sido eliminado
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-lg p-4 space-y-3 border border-orange-200">
              <div className="text-center">
                <p className="text-6xl font-bold text-orange-600 mb-2">404</p>
                <p className="text-sm text-orange-700">
                  Este evento no está disponible
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Es posible que el evento haya sido eliminado, movido o que el
              enlace sea incorrecto.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver atrás
              </Button>

              <Link href="/eventos" className="flex-1">
                <Button
                  variant="secondary"
                  className="w-full flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  Ver eventos
                </Button>
              </Link>
            </div>

            <div className="pt-2">
              <Link href={Routes.CREAR_EVENTO} className="w-full">
                <Button className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Crear nuevo evento
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
