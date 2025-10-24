"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  ValidateAccountSchema,
  ValidateAccountDto,
} from "@/api/auth/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { validateAccount, requestValidation } from "@/api/auth/auth.service";
import { toast } from "sonner";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { Mail, Shield } from "lucide-react";
import { useState } from "react";

const ValidateAccountForm = () => {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const form = useForm<ValidateAccountDto>({
    resolver: zodResolver(ValidateAccountSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const onSubmit = async (data: ValidateAccountDto) => {
    try {
      await validateAccount(data);

      toast.success("Cuenta validada exitosamente", {
        description: "Tu cuenta ha sido activada correctamente",
      });

      router.push(Routes.CREAR_BODEGA);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al validar la cuenta";
      toast.error("Error al validar la cuenta", {
        description: errorMessage,
      });
    }
  };

  const handleResendCode = async () => {
    const email = form.getValues("email");

    if (!email) {
      toast.error("Email requerido", {
        description: "Por favor ingresa tu email para reenviar el código",
      });
      return;
    }

    setIsResending(true);
    try {
      await requestValidation({ email });

      toast.success("Código reenviado", {
        description: "Hemos enviado un nuevo código a tu email",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al reenviar el código";
      toast.error("Error al reenviar el código", {
        description: errorMessage,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Validar cuenta</CardTitle>
          <CardDescription>
            Ingresa el código de validación que recibiste por email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-lg bg-blue-50 p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-blue-900">
                  Revisa tu correo electrónico
                </p>
                <p className="text-sm text-blue-700">
                  Te hemos enviado un código de 6 dígitos para validar tu
                  cuenta.
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              id="validate-form"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu-email@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      Código de validación
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="ABC123"
                        className="text-center text-lg font-mono tracking-widest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            form="validate-form"
            isLoading={form.formState.isSubmitting}
          >
            Validar cuenta
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            ¿No recibiste el código?{" "}
            <Button
              variant="link"
              type="button"
              className="p-0 h-auto text-sm"
              onClick={handleResendCode}
              disabled={isResending || form.formState.isSubmitting}
              isLoading={isResending}
            >
              {isResending ? "Reenviando..." : "Reenviar código"}
            </Button>
          </div>

          <Link href={Routes.LOGOUT} className="w-full">
            <Button
              variant="outline"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Cerrar sesión
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ValidateAccountForm;
