"use client";

import { Reserva, EstadosReserva } from "@/api/reservas/reserva.type";
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
import { ReservaFilters } from "./ReservaFilters";
import moment from "moment";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface ListaReservaProps {
  reservas: Reserva[];
  meta: Meta;
}

export function ListaReserva({ reservas, meta }: ListaReservaProps) {
  // Función para obtener la variante del badge según el estado
  const getEstadoVariant = (
    estadoNombre: string,
  ): "activo" | "finalizado" | "suspendido" | "inactivo" | "default" => {
    const estado = estadoNombre.toLowerCase();
    switch (estado) {
      case EstadosReserva.CONFIRMADO:
        return "activo";
      case EstadosReserva.PENDIENTE:
        return "suspendido";
      case EstadosReserva.CANCELADA:
        return "inactivo";
      default:
        return "default";
    }
  };

  // Función para obtener el estado actual de la reserva
  const getEstadoActual = (
    estados: { nombre: string; created_at: string }[],
  ) => {
    if (!estados || estados.length === 0) return "Sin estado";

    // Ordenar por fecha de creación y tomar el más reciente
    const estadoOrdenado = estados.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return estadoOrdenado[0].nombre;
  };

  return (
    <section className="bg-white border">
      <CommonTableHeader
        placeholder="Buscar por nombre cliente"
        filtersForm={<ReservaFilters />}
      />
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservas.map((reserva) => (
            <TableRow key={reserva.id}>
              <TableCell>
                {moment(reserva.instanciaEvento.fecha).format("MMM DD, YYYY")}
              </TableCell>
              <TableCell className="font-medium">
                {reserva.instanciaEvento.evento.nombre}
              </TableCell>
              <TableCell>OR{reserva.id.toString().padStart(6, "0")}</TableCell>
              <TableCell>
                {/* Aquí deberías tener el nombre del cliente desde el backend */}
                Cliente #{reserva.id}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getEstadoVariant(getEstadoActual(reserva.estados))}
                >
                  {getEstadoActual(reserva.estados)}
                </Badge>
              </TableCell>
              <TableCell>{reserva.precio.toFixed(2)}</TableCell>
              <TableCell>
                <Link href={`/reservas/${reserva.id}`}>
                  <Button variant="ghost" size={"sm"}>
                    Ver
                  </Button>
                </Link>
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
