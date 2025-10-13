"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import InlineErrorHandler from "../common/InlineErrorHandler";
import { editarRol, obtenerPermisos } from "@/api/roles/rol.service";
import { Rol, PermisoSimple, CrearRolDto } from "@/api/roles/rol.type";
import { CrearRolSchema } from "@/api/roles/rol.type";
import { toast } from "sonner";

interface ModalEditarRolProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rol: Rol | null;
  onRolEditado?: () => void;
}

export function ModalEditarRol({
  isOpen,
  onOpenChange,
  rol,
  onRolEditado,
}: ModalEditarRolProps) {
  const [nombre, setNombre] = useState("");
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>(
    [],
  );
  const [permisosDisponibles, setPermisosDisponibles] = useState<
    PermisoSimple[]
  >([]);
  const [error, setError] = useState<string | null>("");
  const [cargando, setCargando] = useState(false);

  // Cargar permisos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarPermisos();
    }
  }, [isOpen]);

  // Actualizar datos del rol cuando cambia
  useEffect(() => {
    if (rol && isOpen) {
      setNombre(rol.nombre);
      setPermisosSeleccionados(rol.permisos.map((p) => p.id));
    }
  }, [rol, isOpen]);

  const cargarPermisos = async () => {
    try {
      const permisos = await obtenerPermisos();
      setPermisosDisponibles(permisos);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      setError("Error al cargar permisos");
    }
  };

  const handleCheckboxChange = (permisoId: number, checked: boolean) => {
    if (checked) {
      setPermisosSeleccionados((prev) => [...prev, permisoId]);
    } else {
      setPermisosSeleccionados((prev) => prev.filter((id) => id !== permisoId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rol) return;

    // Validar datos
    const validacion = CrearRolSchema.safeParse({
      nombre: nombre,
      permisos: permisosSeleccionados,
    });

    if (!validacion.success) {
      const errores = validacion.error.flatten().fieldErrors;
      let mensajeError = "";

      if (errores.nombre) mensajeError += errores.nombre[0] + " ";
      if (errores.permisos) mensajeError += errores.permisos[0];

      setError(mensajeError.trim());
      return;
    }

    setError(null);
    setCargando(true);

    try {
      await editarRol(rol.id, {
        nombre: nombre,
        permisos: permisosSeleccionados,
      });

      toast.success("Rol actualizado correctamente");
      onOpenChange(false);
      onRolEditado?.();

      // Resetear formulario
      setNombre("");
      setPermisosSeleccionados([]);
    } catch (error) {
      console.error("Error al editar rol:", error);
      setError("Error al actualizar el rol. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
    setNombre("");
    setPermisosSeleccionados([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar rol - {rol?.nombre}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del rol</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del rol"
              disabled={cargando}
            />
          </div>

          <div className="space-y-3">
            <Label>Permisos del rol</Label>
            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
              {permisosDisponibles.map((permiso) => (
                <div key={permiso.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`permiso-${permiso.id}`}
                    checked={permisosSeleccionados.includes(permiso.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(permiso.id, !!checked)
                    }
                    disabled={cargando}
                  />
                  <Label
                    htmlFor={`permiso-${permiso.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {permiso.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && <InlineErrorHandler error={new Error(error)} />}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={cargando || permisosSeleccionados.length === 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {cargando ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
