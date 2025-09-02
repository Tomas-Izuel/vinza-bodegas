import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";
import BackButton from "@/components/common/BackButton";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center my-auto h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <FileQuestion className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Página No Encontrada
          </CardTitle>
          <CardDescription className="text-gray-600">
            La página que buscas no existe o ha sido movida
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
              <div className="text-center">
                <p className="text-6xl font-bold text-blue-600 mb-2">404</p>
                <p className="text-sm text-blue-700">
                  No pudimos encontrar lo que buscabas
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Puede que la URL esté mal escrita o que la página haya sido
              eliminada.
            </p>

            <div className="flex gap-2">
              <BackButton className="flex-1" />

              <Link href={Routes.HOME} className="flex-1">
                <Button className="w-full flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Ir al inicio
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
