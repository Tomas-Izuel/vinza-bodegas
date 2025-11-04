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
import { ResetPasswordSchema, ResetPasswordDto } from "@/api/auth/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { resetPassword } from "@/api/auth/auth.service";
import { toast } from "sonner";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import Image from "next/image";
import VinzaLogo from "./VinzaLogo";

const ResetPasswordForm = () => {
  const router = useRouter();
  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    try {
      await resetPassword(data);
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido actualizada exitosamente",
      });
      router.push(Routes.LOGIN);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al cambiar la contraseña";
      toast.error("Error al cambiar la contraseña", {
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
                Cambiar contraseña
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa el código recibido y tu nueva contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  id="reset-password-form"
                >
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">
                          Código de recuperación
                        </FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">
                          Nueva contraseña
                        </FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
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
                form="reset-password-form"
                isLoading={form.formState.isSubmitting}
              >
                Cambiar contraseña
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

export default ResetPasswordForm;
