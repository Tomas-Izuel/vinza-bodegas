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
import { Usuario } from "@/api/usuarios/usuario.type";
import { Badge } from "../ui/badge";
import { Building2, Globe, Edit } from "lucide-react";
import { EditarRolModal } from "./EditarRolModal";
import { EliminarRolButton } from "./EliminarRolButton";

interface ListaRolesProps {
  roles: Rol[];
  usuarios: Usuario[];
  onRolActualizado?: () => void;
}

export function ListaRoles({
  roles,
  usuarios,
  onRolActualizado,
}: ListaRolesProps) {
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

  // Función para contar cuántos usuarios tienen un rol específico
  const contarUsuariosConRol = (rolId: number): number => {
    if (!usuarios || !Array.isArray(usuarios)) {
      return 0;
    }
    return usuarios.filter(
      (usuario) =>
        usuario.roles &&
        Array.isArray(usuario.roles) &&
        usuario.roles.some((rol) => rol.id === rolId),
    ).length;
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
            <TableHead>Usuarios</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles && Array.isArray(roles) ? (
            roles.map((rol) => (
              <TableRow key={rol.id}>
                <TableCell className="font-medium">{rol.nombre}</TableCell>
                <TableCell>
                  <Badge variant={getTipoRolVariant(rol.bodegaId)}>
                    {getTipoRolIcono(rol.bodegaId)}
                    {getTipoRolTexto(rol.bodegaId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {rol.permisos.length} permiso
                  {rol.permisos.length !== 1 ? "s" : ""}
                </TableCell>
                <TableCell>
                  {contarUsuariosConRol(rol.id)} usuario
                  {contarUsuariosConRol(rol.id) !== 1 ? "s" : ""}
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No hay roles disponibles
              </TableCell>
            </TableRow>
          )}
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
