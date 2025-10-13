"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  CrearUsuarioSchema,
  CrearUsuarioDto,
} from "@/api/usuarios/usuario.type";
import { crearUsuario } from "@/api/usuarios/usuario.service";
import { obtenerRolesMiBodega } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";

export function CrearUsuarioForm() {
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CrearUsuarioDto>({
    resolver: zodResolver(CrearUsuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      contrasena: "",
      fecha_nacimiento: "",
      roles: [],
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const rolesData = await obtenerRolesMiBodega();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        toast.error("Error al cargar los roles disponibles");
      }
    };

    cargarRoles();
  }, []);

  const onSubmit = async (data: CrearUsuarioDto) => {
    try {
      setIsLoading(true);
      await crearUsuario(data);
      toast.success("Usuario creado exitosamente");
      router.push("/usuarios");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      toast.error("Error al crear el usuario. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    const currentRoles = form.getValues("roles");
    if (checked) {
      form.setValue("roles", [...currentRoles, roleId]);
    } else {
      form.setValue(
        "roles",
        currentRoles.filter((id) => id !== roleId),
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Seleccione la fecha de nacimiento"
                        {...field}
                      />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ingrese el email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ingrese la contraseña"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {roles.map((rol) => (
                      <div key={rol.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${rol.id}`}
                          checked={form.watch("roles").includes(rol.id)}
                          onCheckedChange={(checked) =>
                            handleRoleChange(rol.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`role-${rol.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {rol.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/usuarios")}
                disabled={isSubmitting || isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || !isDirty}
              >
                {isSubmitting || isLoading ? "Creando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
