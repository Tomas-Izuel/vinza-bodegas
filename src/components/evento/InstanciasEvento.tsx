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
import { Eye, Trash } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import { EstadosEvento } from "@/api/eventos/evento.type";

type InstanciaEvento = {
  id: number;
  fecha: string;
  reservas: number;
  estado: string;
};

interface InstanciasEventoProps {
  instancias: InstanciaEvento[];
  eventoId: number;
}

export function InstanciasEvento({
  instancias,
  eventoId,
}: InstanciasEventoProps) {
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

  const handleSuspender = (instanciaId: number) => {
    // TODO: Implementar lógica de suspensión
    console.log(`Suspender instancia ${instanciaId}`);
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
            <TableHead>Fecha</TableHead>
            <TableHead>Reservas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instancias.map((instancia) => (
            <TableRow key={instancia.id}>
              <TableCell className="font-medium">
                {moment(instancia.fecha).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>{instancia.reservas}</TableCell>
              <TableCell>
                <Badge variant={getEstadoVariant(instancia.estado)}>
                  {instancia.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/eventos/${eventoId}/instancias/${instancia.id}/reservas`}
                >
                  <Button variant="ghost" size={"sm"}>
                    <Eye className="w-4 h-4" />
                    Ver reservas
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size={"sm"}
                  className="text-red-500"
                  onClick={() => handleSuspender(instancia.id)}
                >
                  <Trash className="w-4 h-4" />
                  Suspender
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
