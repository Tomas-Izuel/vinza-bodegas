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

import { EditarRolSchema, EditarRolDto, Rol } from "@/api/roles/rol.type";
import { editarRol, obtenerPermisos } from "@/api/roles/rol.service";
import { PermisoSimple } from "@/api/roles/rol.type";

interface EditarRolModalProps {
  rol: Rol | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditarRolModal({
  rol,
  isOpen,
  onClose,
  onSuccess,
}: EditarRolModalProps) {
  const [permisos, setPermisos] = useState<PermisoSimple[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditarRolDto>({
    resolver: zodResolver(EditarRolSchema),
    defaultValues: {
      nombre: "",
      permisos: [],
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        const permisosData = await obtenerPermisos();
        setPermisos(permisosData);
      } catch (error) {
        console.error("Error al cargar permisos:", error);
        toast.error("Error al cargar los permisos disponibles");
      }
    };

    if (isOpen) {
      cargarPermisos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (rol && isOpen) {
      const initialData = {
        nombre: rol.nombre,
        permisos: rol.permisos.map((permiso) => permiso.id),
      };
      form.reset(initialData);
    }
  }, [rol, isOpen, form]);

  const onSubmit = async (data: EditarRolDto) => {
    if (!rol) return;

    try {
      setIsLoading(true);
      await editarRol(rol.id, data);
      toast.success("Rol editado exitosamente");

      // Llamar a onSuccess antes de cerrar para refrescar los datos
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al editar rol:", error);
      toast.error("Error al editar el rol. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    const currentPermissions = form.getValues("permisos");
    const newPermissions = checked
      ? [...currentPermissions, permissionId]
      : currentPermissions.filter((id) => id !== permissionId);

    // Marcar el campo como modificado para que isDirty funcione correctamente
    form.setValue("permisos", newPermissions, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  if (!rol) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Rol</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Rol</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el nombre del rol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permisos"
              render={() => (
                <FormItem>
                  <FormLabel>Permisos</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-60 overflow-y-auto">
                    {permisos.map((permiso) => (
                      <div
                        key={permiso.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`permission-${permiso.id}`}
                          checked={form.watch("permisos").includes(permiso.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              permiso.id,
                              checked as boolean,
                            )
                          }
                        />
                        <label
                          htmlFor={`permission-${permiso.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permiso.nombre}
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
