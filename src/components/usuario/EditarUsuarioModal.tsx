"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  EditarUsuarioSchema,
  EditarUsuarioDto,
  Usuario,
} from "@/api/usuarios/usuario.type";
import { editarUsuario } from "@/api/usuarios/usuario.service";
import { obtenerRolesMiBodega } from "@/api/roles/rol.service";
import { Rol } from "@/api/roles/rol.type";

interface EditarUsuarioModalProps {
  usuario: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditarUsuarioModal({
  usuario,
  isOpen,
  onClose,
  onSuccess,
}: EditarUsuarioModalProps) {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const form = useForm<EditarUsuarioDto>({
    resolver: zodResolver(EditarUsuarioSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      roles: [],
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setIsLoadingRoles(true);
        console.log("Cargando roles para editar usuario...");
        const rolesData = await obtenerRolesMiBodega();
        console.log("Roles cargados:", rolesData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error al cargar roles:", error);
        toast.error("Error al cargar los roles disponibles");
      } finally {
        setIsLoadingRoles(false);
      }
    };

    if (isOpen) {
      cargarRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (usuario && isOpen) {
      form.reset({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        roles: usuario.roles.map((role) => role.id),
      });
    }
  }, [usuario, isOpen, form]);

  const onSubmit = async (data: EditarUsuarioDto) => {
    if (!usuario) return;

    try {
      setIsLoading(true);

      // Si no se proporciona contraseña, la removemos del objeto
      const dataToSend = { ...data };

      await editarUsuario(usuario.id, dataToSend);
      toast.success("Usuario editado exitosamente");

      // Llamar a onSuccess antes de cerrar para refrescar los datos
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al editar usuario:", error);
      toast.error("Error al editar el usuario. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (roleId: number) => {
    // Solo permitir un rol seleccionado
    const newRoles = [roleId];

    // Marcar el campo como modificado para que isDirty funcione correctamente
    form.setValue("roles", newRoles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  if (!usuario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

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
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  {isLoadingRoles ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">
                        Cargando roles...
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {roles.map((rol) => (
                        <div
                          key={rol.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`role-${rol.id}`}
                            checked={form.watch("roles").includes(rol.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Si se selecciona este rol, deseleccionar todos los demás
                                handleRoleChange(rol.id);
                              } else {
                                // Si se deselecciona, no permitir (debe haber al menos un rol)
                                // No hacer nada
                              }
                            }}
                          />
                          <label
                            htmlFor={`role-${rol.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {rol.nombre}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading || !isDirty}
              >
                {isSubmitting || isLoading ? "Editando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
