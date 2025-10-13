"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import { useState } from "react";
import { SuspenderInstanciaModal } from "./SuspenderInstanciaModal";
import { VerReservasModal } from "./VerReservasModal";

type InstanciaEvento = {
  id: number;
  fecha: string;
  reservas: number;
  estado: string;
};

interface InstanciasEventoProps {
  instancias: InstanciaEvento[];
  eventoNombre: string;
}

export function InstanciasEvento({
  instancias,
  eventoNombre,
}: InstanciasEventoProps) {
  const [modalData, setModalData] = useState<{
    id: number;
    eventoNombre: string;
    fecha: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para el modal de reservas
  const [reservasModalData, setReservasModalData] = useState<{
    id: number;
    eventoNombre: string;
    fecha: string;
  } | null>(null);
  const [isReservasModalOpen, setIsReservasModalOpen] = useState(false);

  // Función para obtener la variante del badge según el estado
  const getEstadoVariant = (
    estadoNombre: string,
  ): "activo" | "finalizado" | "suspendido" | "inactivo" | "default" => {
    const estado = estadoNombre.toLowerCase();

    // Mapear estados del backend a variantes de badge
    if (estado === "activo" || estado === "activa") {
      return "activo";
    } else if (estado === "suspendido" || estado === "suspendida") {
      return "suspendido";
    } else if (estado === "finalizado" || estado === "finalizada") {
      return "finalizado";
    } else if (estado === "inactivo" || estado === "inactiva") {
      return "inactivo";
    } else {
      console.warn("⚠️ Estado no reconocido:", estado);
      return "default";
    }
  };

  const handleSuspenderClick = (instancia: InstanciaEvento) => {
    setModalData({
      id: instancia.id,
      eventoNombre,
      fecha: instancia.fecha,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleVerReservasClick = (instancia: InstanciaEvento) => {
    setReservasModalData({
      id: instancia.id,
      eventoNombre,
      fecha: instancia.fecha,
    });
    setIsReservasModalOpen(true);
  };

  const handleReservasModalClose = () => {
    setIsReservasModalOpen(false);
    setReservasModalData(null);
  };

  // Función para formatear el texto del estado (mayúsculas)
  const formatEstadoTexto = (estado: string): string => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === "activo" || estadoLower === "activa") {
      return "ACTIVO";
    } else if (estadoLower === "suspendido" || estadoLower === "suspendida") {
      return "SUSPENDIDO";
    } else if (estadoLower === "finalizado" || estadoLower === "finalizada") {
      return "FINALIZADO";
    } else if (estadoLower === "inactivo" || estadoLower === "inactiva") {
      return "INACTIVO";
    } else {
      return estado.toUpperCase();
    }
  };

  const isInstanciaSuspendida = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    // Manejar tanto "suspendido" como "suspendida"
    return estadoLower === "suspendido" || estadoLower === "suspendida";
  };

  return (
    <section className="bg-white border">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          Instancias del evento ({instancias.length})
        </h2>
      </div>
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="w-1/5">Fecha</TableHead>
            <TableHead className="w-1/5">Cantidad de reservas</TableHead>
            <TableHead className="w-1/5">Estado</TableHead>
            <TableHead className="w-1/5">Ver reservas</TableHead>
            <TableHead className="w-1/5">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instancias.map((instancia) => {
            const esSuspendida = isInstanciaSuspendida(instancia.estado);
            return (
              <TableRow key={instancia.id}>
                <TableCell className="font-medium w-1/5">
                  {moment(instancia.fecha).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell className="w-1/5">
                  {instancia.reservas} Reservas
                </TableCell>
                <TableCell className="w-1/5">
                  <Badge variant={getEstadoVariant(instancia.estado)}>
                    {formatEstadoTexto(instancia.estado)}
                  </Badge>
                </TableCell>
                <TableCell className="w-1/5">
                  {instancia.reservas > 0 ? (
                    <Button
                      variant="ghost"
                      size={"sm"}
                      className="text-gray-600"
                      onClick={() => handleVerReservasClick(instancia)}
                    >
                      Ver reservas
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No hay reservas
                    </span>
                  )}
                </TableCell>
                <TableCell className="w-1/5">
                  {esSuspendida ? (
                    <span className="text-gray-400 text-sm">-</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size={"sm"}
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleSuspenderClick(instancia)}
                    >
                      Suspender
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <SuspenderInstanciaModal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        instanciaData={modalData}
      />

      <VerReservasModal
        isOpen={isReservasModalOpen}
        onOpenChange={handleReservasModalClose}
        instanciaData={reservasModalData}
      />
    </section>
  );
}
