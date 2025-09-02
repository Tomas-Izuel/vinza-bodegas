import { headers } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";

const UnauthorizedPage = async () => {
  const headersList = await headers();
  const userName = headersList.get("x-user-name") || "Usuario";
  const userRole = headersList.get("x-user-role") || "Sin rol";
  const userEmail = headersList.get("x-user-email") || "";

  return (
    <div className="flex items-center justify-center my-auto h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acceso Denegado
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tu rol actual no tiene permisos para acceder a esta página
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Información de tu cuenta:
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Usuario:</span>
                <span className="text-sm font-medium text-gray-900">
                  {userName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="text-sm font-medium text-gray-900">
                  {userEmail}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rol actual:</span>
                <Badge variant="outline" className="text-xs">
                  {userRole}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Si crees que deberías tener acceso a esta página, contacta con el
              administrador de tu organización.
            </p>

            <div className="flex gap-2">
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
};

export default UnauthorizedPage;
