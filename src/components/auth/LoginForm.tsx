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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LoginSchema, LoginDto } from "@/api/auth/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "@/api/auth/auth.service";
import { toast } from "sonner";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import Image from "next/image";
import VinzaLogo from "./VinzaLogo";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      await login(data);

      router.push(Routes.HOME);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al iniciar sesión";
      toast.error("Error al iniciar sesión", {
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
                Iniciar sesión
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tu email para iniciar sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  id="login-form"
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
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Contraseña</FormLabel>
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
                form="login-form"
                isLoading={form.formState.isSubmitting}
              >
                Iniciar sesión
              </Button>
              <Link href={Routes.REGISTER} className="w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  isLoading={form.formState.isSubmitting}
                >
                  Aún no tengo una cuenta
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

export default LoginForm;
