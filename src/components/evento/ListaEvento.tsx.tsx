"use client";

import { Evento, EstadosEvento } from "@/api/eventos/evento.type";
import { Meta } from "@/api/common.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommonTableHeader } from "../common/CommonTableHeader";
import { CommonTableFooter } from "../common/CommonTableFooter";
import { EventoFilters } from "./EventoFilters";
import moment from "moment";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Pencil, Trash } from "lucide-react";

interface ListaEventoProps {
  eventos: Evento[];
  meta: Meta;
}

export function ListaEvento({ eventos, meta }: ListaEventoProps) {
  // Función para obtener la variante del badge según el estado
  const getEstadoVariant = (
    estadoNombre: string,
  ): "activo" | "finalizado" | "suspendido" | "inactivo" | "default" => {
    const estado = estadoNombre.toLowerCase();
    switch (estado) {
      case EstadosEvento.ACTIVO:
        return "activo";
      case EstadosEvento.FINALIZADO:
        return "finalizado";
      case EstadosEvento.SUSPENDIDO:
        return "suspendido";
      case EstadosEvento.INACTIVO:
        return "inactivo";
      default:
        return "default";
    }
  };
  return (
    <section className="bg-white border">
      <CommonTableHeader
        placeholder="Buscar eventos..."
        filtersForm={<EventoFilters />}
      />
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Última actualización</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell className="font-medium">{evento.nombre}</TableCell>
              <TableCell>{evento.sucursal.nombre}</TableCell>
              <TableCell>${evento.precio}</TableCell>
              <TableCell>
                <Badge variant={getEstadoVariant(evento.estado.nombre)}>
                  {evento.estado.nombre}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="categoria">{evento.categoria.nombre}</Badge>
              </TableCell>
              <TableCell>
                {moment(evento.updated_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
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
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CommonTableFooter
        currentPage={meta.currentPage}
        totalPages={meta.totalPages}
        totalItems={meta.totalItems}
        itemsPerPage={meta.itemsPerPage}
      />
    </section>
  );
}
