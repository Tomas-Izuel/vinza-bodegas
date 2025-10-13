"use client";

import { useState } from "react";
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
import { DetalleReservaModal } from "./DetalleReservaModal";
import moment from "moment";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ListaReservaProps {
  reservas: Reserva[];
  meta: Meta;
  onRefresh?: () => void;
}

export function ListaReserva({ reservas, meta, onRefresh }: ListaReservaProps) {
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal de detalle
  const handleVerReserva = (reservaId: number) => {
    setSelectedReservaId(reservaId);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservaId(null);
  };

  // Función para manejar cuando se cancela una reserva
  const handleReservaCancelada = () => {
    onRefresh?.();
  };

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
        placeholder="Buscar por nombre de cliente o email"
        filtersForm={<ReservaFilters />}
      />
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Identificador</TableHead>
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
                {reserva.instanciaEvento?.fecha
                  ? moment(reserva.instanciaEvento.fecha).format("MMM DD, YYYY")
                  : "Sin fecha"}
              </TableCell>
              <TableCell className="font-medium">
                {reserva.instanciaEvento?.evento?.nombre ||
                  "Evento no disponible"}
              </TableCell>
              <TableCell>{reserva.id.toString()}</TableCell>
              <TableCell>
                {reserva.recorrido?.user?.nombre ? (
                  <div>
                    <div className="font-medium">
                      {reserva.recorrido.user.nombre}{" "}
                      {reserva.recorrido.user.apellido || ""}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reserva.recorrido.user.email || "Sin email"}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium">Cliente #{reserva.id}</div>
                    <div className="text-sm text-gray-500">
                      Sin información de contacto
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getEstadoVariant(getEstadoActual(reserva.estados))}
                >
                  {getEstadoActual(reserva.estados)}
                </Badge>
              </TableCell>
              <TableCell>${parseFloat(reserva.precio).toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size={"sm"}
                  onClick={() => handleVerReserva(reserva.id)}
                >
                  Ver
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

      {/* Modal de detalle de reserva */}
      <DetalleReservaModal
        reservaId={selectedReservaId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReservaCancelada={handleReservaCancelada}
      />
    </section>
  );
}
