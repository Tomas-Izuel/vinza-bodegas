"use client";

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

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

  // Cargar roles cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarRoles();
      // Sincronizar el estado inicial cuando se abre el modal
      form.clearErrors();
      form.setValue("roles", []);
    }
  }, [isOpen, form]);

  const cargarRoles = async () => {
    try {
      setCargandoRoles(true);
      const rolesData = await obtenerRolesMiBodega();
      setRoles(rolesData);
    } catch (error) {
      toast.error("Error al cargar roles", {
        description: "No se pudieron cargar los roles disponibles",
      });
    } finally {
      setCargandoRoles(false);
    }
  };

  const onSubmit = async (data: CrearUsuarioDto) => {
    try {
      // Preparar los datos, excluyendo campos vacíos
      const dataParaEnviar: CrearUsuarioDto = {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        contrasena: data.contrasena,
        roles: rolesSeleccionados,
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
      setRolesSeleccionados([]);

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
      setRolesSeleccionados([]);
    }
    onOpenChange(open);
  };

  const toggleRol = (rolId: number) => {
    setRolesSeleccionados((prev) => {
      const newRoles = prev.includes(rolId)
        ? prev.filter((id) => id !== rolId)
        : [...prev, rolId];

      // Actualizar el campo del formulario
      form.setValue("roles", newRoles);

      // Limpiar error si se selecciona al menos un rol
      if (newRoles.length > 0) {
        form.clearErrors("roles");
      }

      return newRoles;
    });
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

                {/* Selección de Roles */}
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <FormLabel>Roles *</FormLabel>
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
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {roles.map((rol) => (
                              <div
                                key={rol.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`rol-${rol.id}`}
                                  checked={rolesSeleccionados.includes(rol.id)}
                                  onCheckedChange={() => toggleRol(rol.id)}
                                />
                                <label
                                  htmlFor={`rol-${rol.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {rol.nombre}
                                </label>
                                <Badge variant="secondary" className="text-xs">
                                  {rol.permisos.length} permisos
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-2">
                        Selecciona los roles que tendrá este empleado.
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
