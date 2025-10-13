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
import { CommonTableHeader } from "../common/CommonTableHeader";
import moment from "moment";
import { Usuario } from "@/api/usuarios/usuario.type";
import { Badge } from "../ui/badge";
import { CheckCircle, XCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditarUsuarioModal } from "./EditarUsuarioModal";
import { EliminarUsuarioButton } from "./EliminarUsuarioButton";

interface ListaUsuarioProps {
  usuarios: Usuario[];
  onUsuarioActualizado?: () => void;
}

export function ListaUsuario({
  usuarios,
  onUsuarioActualizado,
}: ListaUsuarioProps) {
  const router = useRouter();
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const getRolVariant = (rol: number) => {
    switch (rol) {
      case 1:
        return "activo";
      case 2:
        return "finalizado";
      default:
        return "inactivo";
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingUsuario(null);
    if (onUsuarioActualizado) {
      onUsuarioActualizado();
    } else {
      router.refresh();
    }
  };

  const handleDeleteSuccess = () => {
    if (onUsuarioActualizado) {
      onUsuarioActualizado();
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
            <TableHead>Rol</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead>Validado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell className="font-medium">
                {usuario.nombre} {usuario.apellido}
              </TableCell>
              <TableCell>
                {usuario.roles.map((role) => (
                  <Badge key={role.id} variant={getRolVariant(role.id)}>
                    {role.nombre}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>
                {moment(usuario.updated_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                {usuario.validado ? (
                  <Badge variant="activo">
                    <CheckCircle className="w-4 h-4" />
                    Si
                  </Badge>
                ) : (
                  <Badge variant="inactivo">
                    <XCircle className="w-4 h-4" />
                    No
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(usuario)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <EliminarUsuarioButton
                    usuario={usuario}
                    onSuccess={handleDeleteSuccess}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditarUsuarioModal
        usuario={editingUsuario}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUsuario(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </section>
  );
}
