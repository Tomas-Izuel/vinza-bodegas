"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Building2, Globe, Edit } from "lucide-react";
import { EditarRolModal } from "./EditarRolModal";
import { EliminarRolButton } from "./EliminarRolButton";

interface ListaRolesProps {
  roles: Rol[];
  onRolActualizado?: () => void;
}

export function ListaRoles({ roles, onRolActualizado }: ListaRolesProps) {
  const router = useRouter();
  const [editingRol, setEditingRol] = useState<Rol | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleEdit = (rol: Rol) => {
    setEditingRol(rol);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingRol(null);
    if (onRolActualizado) {
      onRolActualizado();
    } else {
      router.refresh();
    }
  };

  const handleDeleteSuccess = () => {
    if (onRolActualizado) {
      onRolActualizado();
    } else {
      router.refresh();
    }
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
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(rol)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <EliminarRolButton
                    rol={rol}
                    onSuccess={handleDeleteSuccess}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditarRolModal
        rol={editingRol}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRol(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </section>
  );
}
