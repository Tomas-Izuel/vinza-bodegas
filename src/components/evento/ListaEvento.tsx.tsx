import { Evento } from "@/api/eventos/evento.type";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommonTableHeader } from "../common/CommonTableHeader";
import { EventoFilters } from "./EventoFilters";

interface ListaEventoProps {
  eventos: Evento[];
}

export function ListaEvento({ eventos }: ListaEventoProps) {
  const handleFilter = (filters: Record<string, unknown>) => {
    console.log("Filtros aplicados:", filters);
    // Aquí se implementaría la lógica de filtrado
  };

  const handleClearFilters = () => {
    console.log("Filtros limpiados");
    // Aquí se implementaría la lógica para limpiar filtros
  };

  return (
    <section className="bg-white">
      <CommonTableHeader
        placeholder="Buscar eventos..."
        filtersForm={
          <EventoFilters onFilter={handleFilter} onClear={handleClearFilters} />
        }
      />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
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
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
