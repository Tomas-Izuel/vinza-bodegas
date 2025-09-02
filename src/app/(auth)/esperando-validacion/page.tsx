import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { Routes } from "@/lib/routes";

const EsperandoValidacionPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            ¡Bodega Creada Exitosamente!
          </CardTitle>
          <CardDescription className="text-base">
            Tu bodega ha sido registrada y está siendo verificada por nuestro
            equipo
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Proceso de Verificación
            </h3>
            <p className="text-sm text-muted-foreground">
              El equipo de Vinza está verificando que tu bodega sea auténtica y
              cumpla con todos los requisitos necesarios. Este proceso puede
              tomar entre 24 a 48 horas hábiles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              ¿Qué sigue después?
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Verificación completada</p>
                  <p className="text-sm text-muted-foreground">
                    Una vez verificada, podrás acceder a todas las
                    funcionalidades
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Crear eventos</p>
                  <p className="text-sm text-muted-foreground">
                    Organiza catas, degustaciones y eventos especiales
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Gestionar reservas</p>
                  <p className="text-sm text-muted-foreground">
                    Administra las reservas de tus clientes de forma eficiente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Panel completo</p>
                  <p className="text-sm text-muted-foreground">
                    Accede a todas las herramientas de gestión de tu bodega
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">
                  Te notificaremos por email
                </p>
                <p className="text-sm text-blue-700">
                  Recibirás un correo electrónico tan pronto como la
                  verificación esté completa.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={Routes.LOGOUT} className="w-full">
              <Button className="flex-1 w-full">
                Iniciar Sesión con otro email
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EsperandoValidacionPage;
