"use client";

import { Evento } from "@/api/eventos/evento.type";
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

interface ListaEventoProps {
  eventos: Evento[];
  meta: Meta;
}

export function ListaEvento({ eventos, meta }: ListaEventoProps) {
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
            <TableHead>Descripción</TableHead>
            <TableHead>Cupo</TableHead>
            <TableHead className="text-right">Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell className="font-medium">{evento.nombre}</TableCell>
              <TableCell>{evento.descripcion}</TableCell>
              <TableCell>{evento.cupo}</TableCell>
              <TableCell className="text-right">{evento.precio}</TableCell>
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
