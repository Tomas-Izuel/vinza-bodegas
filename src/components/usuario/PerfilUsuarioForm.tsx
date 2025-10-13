"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  ActualizarPerfilSchema,
  ActualizarPerfilDto,
  PerfilUsuario,
} from "@/api/usuarios/usuario.type";
import { Rol } from "@/api/roles/rol.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { actualizarPerfilUsuario } from "@/api/usuarios/usuario.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PerfilUsuarioFormProps {
  perfil: PerfilUsuario;
  rolesDisponibles: Rol[];
}

const PerfilUsuarioForm = ({
  perfil,
  rolesDisponibles,
}: PerfilUsuarioFormProps) => {
  const router = useRouter();
  const form = useForm<ActualizarPerfilDto>({
    resolver: zodResolver(ActualizarPerfilSchema),
    defaultValues: {
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      email: perfil.email,
      fecha_nacimiento: perfil.fecha_nacimiento || "",
      roles: perfil.roles?.map((rol) => rol.id) || [],
    },
  });

  const onSubmit = async (data: ActualizarPerfilDto) => {
    try {
      await actualizarPerfilUsuario(data);
      toast.success("Perfil actualizado exitosamente");

      // Recargar la página para mostrar los cambios
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el perfil";
      toast.error("Error al actualizar el perfil", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Información del perfil */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Información personal</h2>
          <p>Gestiona tu información personal y preferencias</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  ID de usuario
                </p>
                <p className="text-base text-gray-900">#{perfil.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Email</p>
                <p className="text-base text-gray-900">{perfil.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Estado</p>
                <Badge variant={perfil.validado ? "default" : "secondary"}>
                  {perfil.validado ? "Validado" : "Pendiente de validación"}
                </Badge>
              </div>
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Miembro desde
                </p>
                <p className="text-base text-gray-900">
                  {moment(perfil.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Última actualización
                </p>
                <p className="text-base text-gray-900">
                  {moment(perfil.updated_at).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Bodega</p>
                <p className="text-base text-gray-900 font-semibold">
                  {perfil.bodega?.nombre || "Sin bodega"}
                </p>
                {perfil.bodega?.descripcion && (
                  <p className="text-sm text-gray-500 mt-1">
                    {perfil.bodega.descripcion}
                  </p>
                )}
              </div>
            </div>

            {/* Roles actuales */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Roles actuales
                </p>
                <div className="space-y-2">
                  {perfil.roles && perfil.roles.length > 0 ? (
                    perfil.roles.map((rol) => (
                      <Badge key={rol.id} variant="outline">
                        {rol.nombre}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">Sin roles asignados</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario de edición */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Editar información</h2>
          <p>Actualiza tu información personal</p>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              id="perfil-form"
            >
              {/* Primera fila - Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-sm font-medium">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu nombre"
                          className="h-9"
                          {...field}
                        />
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
                      <FormLabel className="required text-sm font-medium">
                        Apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu apellido"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Segunda fila - Email y Fecha de nacimiento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          className="h-9"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Fecha de nacimiento
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-9 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "dd/MM/yyyy", {
                                  locale: es,
                                })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, "yyyy-MM-dd") : "",
                              );
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botón de submit */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  form="perfil-form"
                  isLoading={form.formState.isSubmitting}
                  disabled={!form.formState.isDirty}
                  className="px-8 h-10"
                >
                  {form.formState.isSubmitting
                    ? "Guardando..."
                    : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilUsuarioForm;
