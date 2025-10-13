"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReservasInstancia } from "@/api/eventos/eventos.service";
import { ReservaInstancia } from "@/api/eventos/evento.type";
import { toast } from "sonner";
import moment from "moment";

interface VerReservasModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  instanciaData: {
    id: number;
    eventoNombre: string;
    fecha: string;
  } | null;
}

interface EstadisticasReservas {
  totalReservas: number;
  totalPersonas: number;
  totalIngresos: number;
  promedioPersonasPorReserva: number;
}

export function VerReservasModal({
  isOpen,
  onOpenChange,
  instanciaData,
}: VerReservasModalProps) {
  const [reservas, setReservas] = useState<ReservaInstancia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState<EstadisticasReservas>({
    totalReservas: 0,
    totalPersonas: 0,
    totalIngresos: 0,
    promedioPersonasPorReserva: 0,
  });

  const cargarReservas = useCallback(async () => {
    if (!instanciaData) return;

    try {
      setIsLoading(true);
      const data = await getReservasInstancia(instanciaData.id.toString());
      setReservas(data);
      calcularEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error("Error al cargar las reservas");
    } finally {
      setIsLoading(false);
    }
  }, [instanciaData]);

  useEffect(() => {
    if (isOpen && instanciaData) {
      cargarReservas();
    }
  }, [isOpen, instanciaData, cargarReservas]);

  const calcularEstadisticas = (reservasData: ReservaInstancia[]) => {
    const totalReservas = reservasData.length;
    const totalPersonas = reservasData.reduce(
      (sum, reserva) => sum + reserva.cantidadGente,
      0,
    );
    const totalIngresos = reservasData.reduce(
      (sum, reserva) => sum + reserva.precio,
      0,
    );
    const promedioPersonasPorReserva =
      totalReservas > 0 ? totalPersonas / totalReservas : 0;

    setEstadisticas({
      totalReservas,
      totalPersonas,
      totalIngresos,
      promedioPersonasPorReserva,
    });
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format("DD/MM/YYYY HH:mm");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getEstadoVariant = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === "confirmada" || estadoLower === "confirmado") {
      return "default";
    } else if (estadoLower === "pendiente") {
      return "secondary";
    } else if (estadoLower === "cancelada" || estadoLower === "cancelado") {
      return "destructive";
    } else {
      return "outline";
    }
  };

  if (!instanciaData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservas del evento</DialogTitle>
          <DialogDescription>
            Reservas para <strong>{instanciaData.eventoNombre}</strong> el{" "}
            <strong>{moment(instanciaData.fecha).format("DD/MM/YYYY")}</strong>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando reservas...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Reservas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {estadisticas.totalReservas}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Personas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {estadisticas.totalPersonas}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Ingresos Totales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(estadisticas.totalIngresos)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Promedio por Reserva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {estadisticas.promedioPersonasPorReserva.toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500">personas</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico simple de barras */}
            {reservas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Distribución de Personas por Reserva
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reservas.slice(0, 10).map((reserva) => (
                      <div key={reserva.id} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-gray-600 truncate">
                          {reserva.user.nombre} {reserva.user.apellido}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                          <div
                            className="bg-blue-500 h-4 rounded-full"
                            style={{
                              width: `${(reserva.cantidadGente / Math.max(...reservas.map((r) => r.cantidadGente))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-900">
                          {reserva.cantidadGente}
                        </div>
                      </div>
                    ))}
                    {reservas.length > 10 && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        ... y {reservas.length - 10} reservas más
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabla de reservas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                {reservas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay reservas para esta instancia</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Personas</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha Reserva</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservas.map((reserva) => (
                          <TableRow key={reserva.id}>
                            <TableCell className="font-medium">
                              {reserva.user.nombre} {reserva.user.apellido}
                            </TableCell>
                            <TableCell>{reserva.user.email}</TableCell>
                            <TableCell>{reserva.cantidadGente}</TableCell>
                            <TableCell>
                              {formatCurrency(reserva.precio)}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {reserva.estados.map((estado) => (
                                  <Badge
                                    key={estado.id}
                                    variant={getEstadoVariant(estado.nombre)}
                                    className="text-xs"
                                  >
                                    {estado.nombre}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(reserva.created_at)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
