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
import { Rol } from "@/api/roles/rol.type";
import { Badge } from "../ui/badge";
import { Building2, Globe } from "lucide-react";

interface ListaRolesProps {
  roles: Rol[];
}

export function ListaRoles({ roles }: ListaRolesProps) {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
