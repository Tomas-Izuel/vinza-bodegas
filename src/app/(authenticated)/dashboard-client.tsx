"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useExportUtils } from "@/components/dashboard/ExportUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, Bell, RefreshCw } from "lucide-react";
import { DashboardData } from "@/api/dashboard/dashboard.service";
import { LiveDataTable } from "@/components/dashboard/LiveDataTable";

interface DashboardClientProps {
  dashboardData: DashboardData;
}

export function DashboardClient({ dashboardData }: DashboardClientProps) {
  const { exportData } = useExportUtils();

  const { metrics, charts, eventosProgramados } = dashboardData;

  // Transformar eventos programados al formato de la tabla (limitado a 5 items)
  const eventosTableData = eventosProgramados.map((instancia) => ({
    id: instancia.id.toString(),
    evento: instancia.evento.nombre,
    categoria: "Categoría", // TODO: Add categoria from evento if available
    fecha: instancia.fecha,
    hora: instancia.recurrenciaEvento.hora,
    cupoDisponible: instancia.evento.cupo,
    precio: parseFloat(instancia.evento.precio),
    estado: instancia.estado.nombre.toLowerCase(),
    eventoId: instancia.eventoId, // Para redirección
    inicio: `${new Date(instancia.fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    })} - ${instancia.recurrenciaEvento.hora}`,
  }));

  // Columnas para la tabla de eventos programados
  const eventosColumns = [
    {
      key: "evento",
      label: "Evento",
      render: (value: string | number | boolean) => (
        <div className="space-y-1">
          <div className="font-medium">{String(value)}</div>
        </div>
      ),
    },
    {
      key: "categoria",
      label: "Categoría",
      render: (value: string | number | boolean) => (
        <Badge variant="outline">{String(value)}</Badge>
      ),
    },
    {
      key: "inicio",
      label: "Fecha y Hora",
      render: (value: string | number | boolean) => (
        <div className="font-medium">{String(value)}</div>
      ),
    },
    {
      key: "cupoDisponible",
      label: "Cupos",
      render: (value: string | number | boolean) => (
        <div className="font-medium">{String(value)} disponibles</div>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (value: string | number | boolean) => (
        <div className="font-medium">${Number(value).toLocaleString()}</div>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (value: string | number | boolean) => (
        <Badge
          variant={
            String(value) === "activo"
              ? "default"
              : String(value) === "suspendido"
                ? "destructive"
                : "secondary"
          }
        >
          {String(value) === "activo"
            ? "Activo"
            : String(value) === "suspendido"
              ? "Suspendido"
              : String(value) === "finalizado"
                ? "Finalizado"
                : String(value)}
        </Badge>
      ),
    },
  ];

  // Transformar métricas al formato esperado por MetricCard
  const mainMetrics = [
    {
      title: "Ingresos Mensuales",
      value: `$${metrics.ingresosMensuales.valor.toLocaleString()}`,
      subtitle: metrics.ingresosMensuales.moneda,
      ...(metrics.ingresosMensuales.tendencia !== 0 && {
        trend: {
          value: metrics.ingresosMensuales.tendencia,
          isPositive: metrics.ingresosMensuales.tendencia >= 0,
          period: metrics.ingresosMensuales.periodo,
        },
      }),
    },
    {
      title: "Eventos Activos",
      value: metrics.eventosActivos.cantidad,
      subtitle: "en curso",
      progress: {
        value: metrics.eventosActivos.capacidadUtilizada,
        max: metrics.eventosActivos.capacidadMaxima,
        label: "Capacidad utilizada",
      },
    },
    {
      title: "Personal Activo",
      value: metrics.personalActivo.cantidad.toString(),
      subtitle: "empleados",
      progress: {
        value: metrics.personalActivo.cantidad,
        max: metrics.personalActivo.capacidadMaxima,
        label: "Capacidad de personal",
      },
    },
    {
      title: "Puntuación Promedio",
      value: metrics.puntuacionPromedio.valor.toString(),
      subtitle: "★ de 5.0",
      ...(metrics.puntuacionPromedio.tendencia !== 0 && {
        trend: {
          value: metrics.puntuacionPromedio.tendencia,
          isPositive: metrics.puntuacionPromedio.tendencia >= 0,
          period: metrics.puntuacionPromedio.periodo,
        },
      }),
      progress: {
        value: metrics.puntuacionPromedio.valor * 10,
        max: metrics.puntuacionPromedio.meta * 10,
        label: "Meta mensual",
      },
    },
    {
      title: "Sucursales Activas",
      value: metrics.bodegasActivas.cantidad,
      subtitle: `de ${metrics.bodegasActivas.total} total`,
      progress: {
        value: metrics.bodegasActivas.cantidad,
        max: metrics.bodegasActivas.total,
        label: "Operativas",
      },
    },
    {
      title: "Tasa de Ocupación",
      value: `${metrics.tasaOcupacion.porcentaje}%`,
      subtitle: "promedio",
    },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  const handleAlertConfiguration = () => {
    alert("Configuración de alertas - Funcionalidad próximamente disponible");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Print-only header */}
      <div className="print-only-header hidden">
        <h1 className="text-3xl font-bold mb-2">Reporte</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Header del Dashboard */}
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Ejecutivo</h1>
          <p className="text-muted-foreground">
            Panel de control y métricas administrativas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Activity className="h-3 w-3" />
            Dashboard Ejecutivo
          </Badge>
          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <FileText className="h-4 w-4" />
            Exportar como PDF
          </Button>
          <Button
            variant="default"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ingresos Mensuales"
          subtitle="Evolución de ingresos por mes"
          data={charts.ingresosMensuales}
          type="area"
          dataKey="value"
          badge={{ text: "Tendencia Positiva", variant: "secondary" }}
        />

        <ChartCard
          title="Eventos por Categoría"
          subtitle="Distribución de tipos de eventos"
          data={charts.eventosPorCategoria}
          type="pie"
          dataKey="value"
          badge={{ text: "Activos", variant: "secondary" }}
        />
      </div>

      {/* Ocupación Semanal y Eventos Programados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ocupación Semanal"
          subtitle="Porcentaje de ocupación por día"
          data={charts.ocupacionSemanal}
          type="bar"
          dataKey="value"
          badge={{
            text: `${metrics.tasaOcupacion.porcentaje}% Promedio`,
            variant: "outline",
          }}
        />

        <div className="no-print">
          <LiveDataTable
            title="Eventos Programados"
            subtitle="Próximos eventos en los siguientes 30 días"
            data={eventosTableData}
            columns={eventosColumns}
            showLiveIndicator={false}
            refreshInterval={0}
            onDownload={() =>
              exportData("excel", eventosTableData, "eventos-programados")
            }
            onViewDetails={(id) => {
              const evento = eventosTableData.find((e) => e.id === id);
              if (evento) {
                window.location.href = `/eventos/${evento.eventoId}`;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
