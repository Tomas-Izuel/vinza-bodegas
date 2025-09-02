"use client";

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
import { CheckCircle, XCircle } from "lucide-react";

interface ListaUsuarioProps {
  usuarios: Usuario[];
}

export function ListaUsuario({ usuarios }: ListaUsuarioProps) {
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
            <TableHead> </TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
