"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CrearRolSchema,
  CrearRolDto,
  PermisoSimple,
} from "@/api/roles/rol.type";
import { crearRol, obtenerPermisos } from "@/api/roles/rol.service";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrearRolModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRolCreado?: () => void;
}

export function CrearRolModal({
  isOpen,
  onOpenChange,
  onRolCreado,
}: CrearRolModalProps) {
  const [permisos, setPermisos] = useState<PermisoSimple[]>([]);
  const [isLoadingPermisos, setIsLoadingPermisos] = useState(false);
  const router = useRouter();

  const form = useForm<CrearRolDto>({
    resolver: zodResolver(CrearRolSchema),
    defaultValues: {
      nombre: "",
      permisos: [],
    },
  });

  const { isSubmitting } = form.formState;

  // Cargar permisos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarPermisos();
    }
  }, [isOpen]);

  const cargarPermisos = async () => {
    try {
      setIsLoadingPermisos(true);
      const permisosData = await obtenerPermisos();
      setPermisos(permisosData);
    } catch {
      toast.error("Error al cargar permisos", {
        description: "No se pudieron cargar los permisos disponibles",
      });
    } finally {
      setIsLoadingPermisos(false);
    }
  };

  const onSubmit = async (data: CrearRolDto) => {
    try {
      await crearRol(data);

      toast.success("Rol creado exitosamente", {
        description: `El rol "${data.nombre}" ha sido creado correctamente`,
      });

      // Limpiar formulario
      form.reset();

      // Cerrar modal
      onOpenChange(false);

      // Callback para actualizar la lista
      if (onRolCreado) {
        onRolCreado();
      }

      // Refrescar la página para actualizar la lista
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear rol";
      toast.error("Error al crear rol", {
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

  const selectedPermissions = form.watch("permisos");

  // Agrupar permisos por módulo
  const permisosAgrupados = permisos.reduce(
    (acc, permiso) => {
      const [modulo] = permiso.clave.split(":");
      if (!acc[modulo]) {
        acc[modulo] = [];
      }
      acc[modulo].push(permiso);
      return acc;
    },
    {} as Record<string, PermisoSimple[]>,
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
          <DialogDescription>
            Crea un nuevo rol asignando los permisos correspondientes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Rol *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Administrador de Bodega"
                      {...field}
                    />
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
                  <FormLabel>Permisos *</FormLabel>
                  <div className="text-sm text-gray-600 mb-3">
                    Selecciona los permisos que tendrá este rol
                  </div>

                  {selectedPermissions.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">
                        Permisos seleccionados ({selectedPermissions.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedPermissions.map((permisoId) => {
                          const permiso = permisos.find(
                            (p) => p.id === permisoId,
                          );
                          return permiso ? (
                            <Badge key={permisoId} variant="default">
                              {permiso.nombre}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {isLoadingPermisos ? (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">
                        Cargando permisos...
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-64 border rounded-md p-4">
                      <div className="space-y-4">
                        {Object.entries(permisosAgrupados).map(
                          ([modulo, permisosModulo]) => (
                            <div key={modulo}>
                              <div className="font-medium text-sm text-gray-700 mb-2 uppercase">
                                {modulo}
                              </div>
                              <div className="space-y-2 pl-4">
                                {permisosModulo.map((permiso) => (
                                  <FormField
                                    key={permiso.id}
                                    control={form.control}
                                    name="permisos"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={permiso.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                permiso.id,
                                              )}
                                              onCheckedChange={(
                                                checked: boolean,
                                              ) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      permiso.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== permiso.id,
                                                      ),
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-normal">
                                              {permiso.nombre}
                                            </FormLabel>
                                            <div className="text-xs text-gray-500">
                                              {permiso.clave}
                                            </div>
                                          </div>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoadingPermisos}
              >
                {isSubmitting ? "Creando..." : "Crear Rol"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
