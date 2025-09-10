"use client";

import { Sucursal } from "@/api/sucursales/sucursal.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, LandPlot, Pencil, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ListaSucursalesProps {
  sucursales: Sucursal[];
}

export function ListaSucursales({ sucursales }: ListaSucursalesProps) {
  return (
    <section className="bg-white border">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Aclaraciones</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sucursales.map((sucursal) => (
            <TableRow key={sucursal.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {sucursal.nombre}
                  {sucursal.es_principal && (
                    <Tooltip>
                      <TooltipTrigger>
                        <LandPlot className="w-4 h-4 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sucursal principal</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {sucursal.direccion}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {sucursal.aclaraciones || "Sin aclaraciones"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={sucursal.es_principal ? "default" : "secondary"}
                >
                  {sucursal.es_principal ? "Principal" : "Secundaria"}
                </Badge>
              </TableCell>
              <TableCell>
                {moment(sucursal.updated_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size={"sm"}>
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  <Button variant="ghost" size={"sm"}>
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="ghost" size={"sm"} className="text-red-500">
                    <Trash className="w-4 h-4" />
                    Borrar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
