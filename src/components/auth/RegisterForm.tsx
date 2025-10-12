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
import { RegisterSchema, RegisterDto } from "@/api/auth/auth.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { register } from "@/api/auth/auth.service";
import { toast } from "sonner";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { z } from "zod";

// Schema extendido para el formulario con confirmación de contraseña
const RegisterFormSchema = RegisterSchema.extend({
  confirmarPassword: z.string({
    message: "La confirmación de contraseña es requerida",
  }),
}).refine((data) => data.password === data.confirmarPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarPassword"],
});

type RegisterFormData = z.infer<typeof RegisterFormSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      nombre: "",
      confirmarPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Extraer solo los campos necesarios para el backend
      const registerData: RegisterDto = {
        email: data.email,
        password: data.password,
        nombre: data.nombre,
      };
      await register(registerData);

      toast.success("Registro exitoso", {
        description: "Tu cuenta ha sido creada correctamente",
      });

      router.push(Routes.VALIDATE_ACCOUNT);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al registrar usuario";
      toast.error("Error al registrar usuario", {
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">Crear cuenta</CardTitle>
        <CardDescription className="text-center">
          Completa los datos para crear tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="register-form"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Nombre</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmarPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">
                    Confirmar contraseña
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
          form="register-form"
          isLoading={form.formState.isSubmitting}
        >
          Registrarme
        </Button>
        <Link href={Routes.LOGIN} className="w-full">
          <Button
            variant="outline"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Ya tengo una cuenta
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
