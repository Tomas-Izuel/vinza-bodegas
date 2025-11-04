"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
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
import {
  Download,
  RefreshCw,
  Filter,
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableData {
  id: string;
  [key: string]: string | number | boolean;
}

interface Column {
  key: string;
  label: string;
  render?: (
    value: string | number | boolean,
    row: TableData,
  ) => React.ReactNode;
  sortable?: boolean;
}

interface LiveDataTableProps {
  title: string;
  subtitle?: string;
  data: TableData[];
  columns: Column[];
  refreshInterval?: number;
  onRefresh?: () => void;
  onDownload?: () => void;
  onViewDetails?: (id: string) => void;
  showLiveIndicator?: boolean;
}

// Datos mock para eventos programados
const mockEventData: TableData[] = [
  {
    id: "1",
    evento: "Cata Premium Malbec",
    bodega: "Bodega San Miguel",
    asistentes: 45,
    capacidad: 50,
    ingresos: 67500,
    rating: 4.8,
    estado: "programado",
    inicio: "15 Jul - 14:30",
    tendencia: 12,
  },
  {
    id: "2",
    evento: "Tour Viñedos",
    bodega: "Viñedos del Valle",
    asistentes: 28,
    capacidad: 30,
    ingresos: 42000,
    rating: 4.6,
    estado: "confirmado",
    inicio: "16 Jul - 15:00",
    tendencia: -3,
  },
  {
    id: "3",
    evento: "Degustación Reserva",
    bodega: "Bodega Los Andes",
    asistentes: 60,
    capacidad: 60,
    ingresos: 90000,
    rating: 4.9,
    estado: "completo",
    inicio: "12 Jul - 13:00",
    tendencia: 8,
  },
  {
    id: "4",
    evento: "Maridaje Gourmet",
    bodega: "Casa del Vino",
    asistentes: 22,
    capacidad: 40,
    ingresos: 33000,
    rating: 4.4,
    estado: "programado",
    inicio: "18 Jul - 16:30",
    tendencia: 5,
  },
  {
    id: "5",
    evento: "Curso de Sommelier",
    bodega: "Academia Vitivinícola",
    asistentes: 15,
    capacidad: 20,
    ingresos: 75000,
    rating: 4.7,
    estado: "confirmado",
    inicio: "20 Jul - 10:00",
    tendencia: 15,
  },
];

const eventColumns: Column[] = [
  {
    key: "evento",
    label: "Evento",
    render: (value, row) => (
      <div className="space-y-1">
        <div className="font-medium">{value}</div>
        <div className="text-sm text-muted-foreground">{row.bodega}</div>
      </div>
    ),
  },
  {
    key: "asistentes",
    label: "Asistencia",
    render: (value, row) => {
      const percentage = (Number(value) / Number(row.capacidad)) * 100;
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {value}/{row.capacidad}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                percentage >= 90
                  ? "bg-red-500"
                  : percentage >= 70
                    ? "bg-yellow-500"
                    : "bg-green-500",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    key: "ingresos",
    label: "Ingresos",
    render: (value, row) => (
      <div className="space-y-1">
        <div className="font-medium">${Number(value).toLocaleString()}</div>
        <div className="flex items-center gap-1 text-xs">
          {Number(row.tendencia) > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600" />
          )}
          <span
            className={cn(
              "font-medium",
              Number(row.tendencia) > 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {Number(row.tendencia) > 0 ? "+" : ""}
            {row.tendencia}%
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "rating",
    label: "Valoración",
    render: (value) => (
      <div className="flex items-center gap-1">
        <span className="font-medium">{value}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={cn(
                "text-xs",
                star <= Math.floor(Number(value))
                  ? "text-yellow-400"
                  : "text-gray-300",
              )}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "estado",
    label: "Estado",
    render: (value) => (
      <Badge
        variant={
          value === "programado"
            ? "secondary"
            : value === "confirmado"
              ? "activo"
              : value === "completo"
                ? "finalizado"
                : "secondary"
        }
      >
        {value === "programado"
          ? "Programado"
          : value === "confirmado"
            ? "Confirmado"
            : value === "completo"
              ? "Completo"
              : value}
      </Badge>
    ),
  },
];

export function LiveDataTable({
  title,
  subtitle,
  data = mockEventData,
  columns = eventColumns,
  refreshInterval = 5000,
  onRefresh,
  onDownload,
  onViewDetails,
  showLiveIndicator = true,
}: LiveDataTableProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        if (onRefresh) {
          setIsRefreshing(true);
          onRefresh();
          setTimeout(() => setIsRefreshing(false), 500);
        }
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdate(new Date());
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              {showLiveIndicator && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-muted-foreground">EN VIVO</span>
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {showLiveIndicator && (
              <p className="text-xs text-muted-foreground">
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-semibold">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-1">
                      {onViewDetails && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onViewDetails(row.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
