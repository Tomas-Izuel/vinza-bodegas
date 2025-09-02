"use client"; // Error boundaries deben ser Client Components

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error a un servicio de reporte de errores
    console.error("Error en aplicación:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center my-auto h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Error en la Aplicación
          </CardTitle>
          <CardDescription className="text-gray-600">
            Se ha producido un error inesperado
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 space-y-3 border border-red-200">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-red-800">
                  Mensaje de error:
                </span>
              </div>
              <p className="text-sm text-red-700 break-words">
                {error.message || "Error desconocido"}
              </p>

              {error.digest && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">ID de error:</span>
                  <Badge variant="destructive" className="text-xs font-mono">
                    {error.digest}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Si este error persiste, contacta con el administrador del sistema.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={reset}
                className="flex-1 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>

              <Link href={Routes.HOME} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
