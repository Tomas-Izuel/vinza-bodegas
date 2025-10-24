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
  RecoveryPasswordSchema,
  RecoveryPasswordDto,
} from "@/api/auth/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { recoveryPassword } from "@/api/auth/auth.service";
import { toast } from "sonner";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import Image from "next/image";
import VinzaLogo from "./VinzaLogo";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<RecoveryPasswordDto>({
    resolver: zodResolver(RecoveryPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecoveryPasswordDto) => {
    try {
      await recoveryPassword(data);
      toast.success("Código enviado", {
        description: "Se ha enviado un código de recuperación a tu email",
      });
      router.push(Routes.RESET_PASSWORD);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al solicitar recuperación";
      toast.error("Error al solicitar recuperación", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* Lado izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          <VinzaLogo />
          <Card className="shadow-none border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Recuperar contraseña
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tu email para recibir un código de recuperación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  id="forgot-password-form"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                type="submit"
                className="w-full"
                form="forgot-password-form"
                isLoading={form.formState.isSubmitting}
              >
                Enviar código
              </Button>
              <Link href={Routes.LOGIN} className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  isLoading={form.formState.isSubmitting}
                >
                  Volver al login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Lado derecho - Ilustración */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Image
          src="/auth-illustrarion.svg"
          alt="Ilustración de autenticación"
          width={600}
          height={600}
          className="w-full h-auto max-w-lg"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
