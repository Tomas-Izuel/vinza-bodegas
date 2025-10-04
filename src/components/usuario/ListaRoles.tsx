"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CommonTableHeader } from "../common/CommonTableHeader";
import moment from "moment";
import { Rol } from "@/api/roles/rol.type";
import { Badge } from "../ui/badge";
import { Building2, Globe, Pencil, Trash2 } from "lucide-react";
import { ModalEditarRol } from "./ModalEditarRol";
import { ModalEliminarRol } from "./ModalEliminarRol";

interface ListaRolesProps {
  roles: Rol[];
  onRolActualizado?: () => void;
}

export function ListaRoles({ roles, onRolActualizado }: ListaRolesProps) {
  const [rolEditando, setRolEditando] = useState<Rol | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [rolEliminando, setRolEliminando] = useState<Rol | null>(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const getTipoRolVariant = (bodegaId: number | null) => {
    return bodegaId ? "finalizado" : "activo";
  };

  const getTipoRolTexto = (bodegaId: number | null) => {
    return bodegaId ? "Bodega" : "Global";
  };

  const getTipoRolIcono = (bodegaId: number | null) => {
    return bodegaId ? (
      <Building2 className="w-4 h-4" />
    ) : (
      <Globe className="w-4 h-4" />
    );
  };

  const handleEditarRol = (rol: Rol) => {
    setRolEditando(rol);
    setModalEditarAbierto(true);
  };

  const handleEliminarRol = (rol: Rol) => {
    setRolEliminando(rol);
    setModalEliminarAbierto(true);
  };

  const handleRolActualizado = () => {
    setModalEditarAbierto(false);
    setModalEliminarAbierto(false);
    setRolEditando(null);
    setRolEliminando(null);
    onRolActualizado?.();
  };

  return (
    <section className="bg-white border">
      <CommonTableHeader />
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Permisos</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((rol) => (
            <TableRow key={rol.id}>
              <TableCell className="font-medium">{rol.nombre}</TableCell>
              <TableCell>
                <Badge variant={getTipoRolVariant(rol.bodegaId)}>
                  {getTipoRolIcono(rol.bodegaId)}
                  {getTipoRolTexto(rol.bodegaId)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {rol.permisos.slice(0, 3).map((permiso) => (
                    <Badge key={permiso.id} variant="default">
                      {permiso.nombre}
                    </Badge>
                  ))}
                  {rol.permisos.length > 3 && (
                    <Badge variant="inactivo">
                      +{rol.permisos.length - 3} más
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {moment(rol.updated_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditarRol(rol)}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEliminarRol(rol)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Borrar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modales */}
      <ModalEditarRol
        isOpen={modalEditarAbierto}
        onOpenChange={setModalEditarAbierto}
        rol={rolEditando}
        onRolEditado={handleRolActualizado}
      />

      <ModalEliminarRol
        isOpen={modalEliminarAbierto}
        onOpenChange={setModalEliminarAbierto}
        rol={rolEliminando}
        onRolEliminado={handleRolActualizado}
      />
    </section>
  );
}
