"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  CrearUsuarioSchema,
  CrearUsuarioDto,
} from "@/api/usuarios/usuario.type";
import { crearUsuario } from "@/api/usuarios/usuario.service";
import { obtenerRolesMiBodega } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface CrearUsuarioModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUsuarioCreado?: () => void;
}

export function CrearUsuarioModal({
  isOpen,
  onOpenChange,
  onUsuarioCreado,
}: CrearUsuarioModalProps) {
  const router = useRouter();
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargandoRoles, setCargandoRoles] = useState(false);

  const form = useForm<CrearUsuarioDto>({
    resolver: zodResolver(CrearUsuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      contrasena: "",
      roles: [],
    },
  });

  const { isSubmitting } = form.formState;

  const cargarRoles = useCallback(async () => {
    try {
      setCargandoRoles(true);
      const rolesData = await obtenerRolesMiBodega();
      setRoles(rolesData);
    } catch {
      toast.error("Error al cargar roles", {
        description: "No se pudieron cargar los roles disponibles",
      });
    } finally {
      setCargandoRoles(false);
    }
  }, []);

  // Cargar roles cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarRoles();
      // Sincronizar el estado inicial cuando se abre el modal
      form.clearErrors();
      form.setValue("roles", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cargarRoles]); // form no se incluye para evitar renders innecesarios

  const onSubmit = async (data: CrearUsuarioDto) => {
    try {
      // Preparar los datos, excluyendo campos vacíos
      const dataParaEnviar: CrearUsuarioDto = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        contrasena: data.contrasena,
        roles: data.roles,
      };

      // Solo agregar fecha_nacimiento si no está vacía
      if (data.fecha_nacimiento && data.fecha_nacimiento.trim() !== "") {
        dataParaEnviar.fecha_nacimiento = data.fecha_nacimiento;
      }

      await crearUsuario(dataParaEnviar);

      toast.success("Usuario creado exitosamente", {
        description: `El usuario "${data.nombre} ${data.apellido}" ha sido creado correctamente`,
      });

      // Limpiar formulario
      form.reset();

      // Cerrar modal
      onOpenChange(false);

      // Callback para actualizar la lista
      if (onUsuarioCreado) {
        onUsuarioCreado();
      }

      // Refrescar la página para actualizar la lista
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear usuario";
      toast.error("Error al crear usuario", {
        description: errorMessage,
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription>
            Agrega un nuevo empleado a tu bodega con los permisos
            correspondientes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: María" {...field} />
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
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Fernández" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ej: maria.fernandez@bodega.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contraseña */}
                <FormField
                  control={form.control}
                  name="contrasena"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Selección de Rol */}
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol *</FormLabel>
                      <div className="border border-dashed rounded-lg p-4">
                        {cargandoRoles ? (
                          <div className="text-center py-4 text-gray-500">
                            Cargando roles...
                          </div>
                        ) : roles.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            No hay roles disponibles.
                            <br />
                            <span className="text-sm">
                              Crea roles primero para asignar permisos al
                              usuario.
                            </span>
                          </div>
                        ) : (
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value: string) => {
                                field.onChange([Number(value)]);
                              }}
                              value={field.value[0]?.toString() || ""}
                            >
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {roles.map((rol) => (
                                  <div
                                    key={rol.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <RadioGroupItem
                                      value={rol.id.toString()}
                                      id={`rol-${rol.id}`}
                                    />
                                    <Label
                                      htmlFor={`rol-${rol.id}`}
                                      className="cursor-pointer flex-1 flex items-center justify-between"
                                    >
                                      <span>{rol.nombre}</span>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {rol.permisos.length} permisos
                                      </Badge>
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                          </FormControl>
                        )}
                      </div>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2">
                        Selecciona el rol que tendrá este empleado.
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Creando..." : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
