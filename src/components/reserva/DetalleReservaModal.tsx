"use client";

import { useState, useEffect } from "react";
import { Reserva, EstadosReserva } from "@/api/reservas/reserva.type";
import {
  getReservaPorId,
  cancelarReserva,
} from "@/api/reservas/reserva.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

interface DetalleReservaModalProps {
  reservaId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onReservaCancelada?: () => void;
}

export function DetalleReservaModal({
  reservaId,
  isOpen,
  onClose,
  onReservaCancelada,
}: DetalleReservaModalProps) {
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);

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

  // Función para obtener el icono del estado
  const getEstadoIcon = (estadoNombre: string) => {
    const estado = estadoNombre.toLowerCase();
    switch (estado) {
      case EstadosReserva.CONFIRMADO:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case EstadosReserva.PENDIENTE:
        return <Clock className="h-4 w-4 text-orange-500" />;
      case EstadosReserva.CANCELADA:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
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

  // Función para obtener las iniciales del nombre
  const getInitials = (nombre: string, apellido?: string) => {
    const firstInitial = nombre?.charAt(0).toUpperCase() || "";
    const lastInitial = apellido?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial;
  };

  // Cargar detalles de la reserva
  useEffect(() => {
    if (isOpen && reservaId) {
      setLoading(true);
      getReservaPorId(reservaId.toString())
        .then((data) => {
          setReserva(data);
        })
        .catch((error) => {
          toast.error("Error al cargar los detalles de la reserva");
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, reservaId]);

  // Función para cancelar la reserva
  const handleCancelarReserva = async () => {
    if (!reservaId) return;

    setCanceling(true);
    try {
      await cancelarReserva(reservaId.toString());
      toast.success("Reserva cancelada exitosamente");
      onReservaCancelada?.();
      onClose();
    } catch (error) {
      toast.error("Error al cancelar la reserva");
      console.error("Error:", error);
    } finally {
      setCanceling(false);
    }
  };

  // Función para verificar si la reserva puede ser cancelada
  const canCancelarReserva = () => {
    if (!reserva) return false;
    const estadoActual = getEstadoActual(reserva.estados);
    return estadoActual.toLowerCase() !== EstadosReserva.CANCELADA;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </div>
            ) : (
              `Reserva ${reserva?.id || ""}`
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : reserva ? (
          <div className="space-y-6">
            {/* Información del cliente */}
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {getInitials(
                    reserva.recorrido?.user?.nombre || "",
                    reserva.recorrido?.user?.apellido || "",
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {reserva.recorrido?.user?.nombre || "Cliente"}{" "}
                  {reserva.recorrido?.user?.apellido || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  {reserva.recorrido?.user?.email || "Sin email"}
                </p>
              </div>
            </div>

            {/* Detalles de la reserva */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fecha de reserva:</span>
                <span className="font-medium">
                  {moment(reserva.instanciaEvento?.fecha).format("DD/MM/YYYY")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Evento:</span>
                <span className="font-medium text-right">
                  {reserva.instanciaEvento?.evento?.nombre || "Sin evento"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Precio:</span>
                <span className="font-medium">
                  ${parseFloat(reserva.precio).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  Cantidad de personas:
                </span>
                <span className="font-medium">{reserva.cantidadGente}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estado:</span>
                <div className="flex items-center gap-2">
                  {getEstadoIcon(getEstadoActual(reserva.estados))}
                  <Badge
                    variant={getEstadoVariant(getEstadoActual(reserva.estados))}
                  >
                    {getEstadoActual(reserva.estados)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              {canCancelarReserva() && (
                <Button
                  variant="destructive"
                  onClick={handleCancelarReserva}
                  disabled={canceling}
                  className="flex-1"
                >
                  {canceling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Cancelando...
                    </>
                  ) : (
                    "Cancelar reserva"
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No se pudo cargar la información de la reserva
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
