"use client";

import { Evento, EstadosEvento } from "@/api/eventos/evento.type";
import { Meta } from "@/api/common.type";
import { Sucursal } from "@/api/sucursales/sucursal.type";
import { CategoriaEvento } from "@/api/categoria-evento/categoria-evento.type";
import { EstadoEvento } from "@/api/eventos/evento.type";
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
import { Eye, LandPlot, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { Routes } from "@/lib/routes";
import { EliminarEventoButton } from "./EliminarEventoButton";
import { SortableHeader } from "../common/SortableHeader";

interface ListaEventoProps {
  eventos: Evento[];
  meta: Meta;
  sucursales: Sucursal[];
  categorias: CategoriaEvento[];
  estados: EstadoEvento[];
}

const eventoOrderByAttributes = [
  "id",
  "nombre",
  "precio",
  "descripcion",
  "cupo",
  "sucursalId",
  "created_at",
  "updated_at",
  "deleted_at",
] as const;

type SortableField = (typeof eventoOrderByAttributes)[number];

// Mapeo de headers de tabla a campos ordenables
const headerToFieldMap: Record<string, SortableField> = {
  Nombre: "nombre",
  Sucursal: "sucursalId",
  Precio: "precio",
  Cupo: "cupo",
  "Última actualización": "updated_at",
};

export function ListaEvento({
  eventos,
  meta,
  sucursales,
  categorias,
  estados,
}: ListaEventoProps) {
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
        filtersForm={
          <EventoFilters
            sucursales={sucursales}
            categorias={categorias}
            estados={estados}
          />
        }
      />
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <SortableHeader
              label="Nombre"
              field={headerToFieldMap["Nombre"]}
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Sucursal"
              field={headerToFieldMap["Sucursal"]}
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Precio"
              field={headerToFieldMap["Precio"]}
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Cupo"
              field={headerToFieldMap["Cupo"]}
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Estado"
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Categoría"
              allowedFields={eventoOrderByAttributes}
            />
            <SortableHeader
              label="Última actualización"
              field={headerToFieldMap["Última actualización"]}
              allowedFields={eventoOrderByAttributes}
            />
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell className="font-medium">{evento.nombre}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {evento.sucursal.nombre}
                  {evento.sucursal.es_principal && (
                    <Tooltip>
                      <TooltipTrigger>
                        <LandPlot className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sucursal principal</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>${evento.precio}</TableCell>
              <TableCell>{evento.cupo}</TableCell>
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
                <Link href={Routes.VER_EVENTO + evento.id}>
                  <Button variant="ghost" size={"sm"}>
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                </Link>
                <Link href={Routes.VER_EVENTO + evento.id + "?editar=true"}>
                  <Button variant="ghost" size={"sm"}>
                    <Pencil className="w-4 h-4" />
                    Editar
                  </Button>
                </Link>
                <EliminarEventoButton
                  eventoId={evento.id.toString()}
                  eventoNombre={evento.nombre}
                />
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
