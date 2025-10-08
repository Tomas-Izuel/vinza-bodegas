"use client";

import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { LiveDataTable } from "@/components/dashboard/LiveDataTable";
import {
  ExportUtils,
  useExportUtils,
} from "@/components/dashboard/ExportUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  Building2,
  Star,
  Activity,
  Download,
  Bell,
  RefreshCw,
} from "lucide-react";
import { DashboardData } from "@/api/dashboard/dashboard.service";

interface DashboardClientProps {
  dashboardData: DashboardData;
}

export function DashboardClient({ dashboardData }: DashboardClientProps) {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const { exportData, generateReport } = useExportUtils();

  const { metrics, charts } = dashboardData;

  // Transformar métricas al formato esperado por MetricCard
  const mainMetrics = [
    {
      title: "Ingresos Mensuales",
      value: `$${metrics.ingresosMensuales.valor.toLocaleString()}`,
      subtitle: metrics.ingresosMensuales.moneda,
      trend: {
        value: metrics.ingresosMensuales.tendencia,
        isPositive: metrics.ingresosMensuales.tendencia >= 0,
        period: metrics.ingresosMensuales.periodo,
      },
      onDownload: () => exportData("excel", [], "ingresos-mensuales"),
      onAlert: () => alert("Configurar alerta para ingresos mensuales"),
    },
    {
      title: "Eventos Activos",
      value: metrics.eventosActivos.cantidad,
      subtitle: "en curso",
      trend: {
        value: metrics.eventosActivos.tendencia,
        isPositive: metrics.eventosActivos.tendencia >= 0,
        period: metrics.eventosActivos.periodo,
      },
      progress: {
        value: metrics.eventosActivos.capacidadUtilizada,
        max: metrics.eventosActivos.capacidadMaxima,
        label: "Capacidad utilizada",
      },
      onDownload: () => exportData("csv", [], "eventos-activos"),
    },
    {
      title: "Personal Activo",
      value: metrics.personalActivo.cantidad.toString(),
      subtitle: "empleados",
      trend: {
        value: metrics.personalActivo.tendencia,
        isPositive: metrics.personalActivo.tendencia >= 0,
        period: metrics.personalActivo.periodo,
      },
      progress: {
        value: metrics.personalActivo.cantidad,
        max: metrics.personalActivo.capacidadMaxima,
        label: "Capacidad de personal",
      },
      onAlert: () => alert("Ver gestión de personal"),
    },
    {
      title: "Puntuación Promedio",
      value: metrics.puntuacionPromedio.valor.toString(),
      subtitle: "★ de 5.0",
      trend: {
        value: metrics.puntuacionPromedio.tendencia,
        isPositive: metrics.puntuacionPromedio.tendencia >= 0,
        period: metrics.puntuacionPromedio.periodo,
      },
      progress: {
        value: metrics.puntuacionPromedio.valor * 10,
        max: metrics.puntuacionPromedio.meta * 10,
        label: "Meta mensual",
      },
    },
    {
      title: "Bodegas Activas",
      value: metrics.bodegasActivas.cantidad,
      subtitle: `de ${metrics.bodegasActivas.total} total`,
      progress: {
        value: metrics.bodegasActivas.cantidad,
        max: metrics.bodegasActivas.total,
        label: "Operativas",
      },
      onDownload: () => exportData("excel", [], "bodegas-status"),
    },
    {
      title: "Tasa de Ocupación",
      value: `${metrics.tasaOcupacion.porcentaje}%`,
      subtitle: "promedio",
      trend: {
        value: metrics.tasaOcupacion.tendencia,
        isPositive: metrics.tasaOcupacion.tendencia >= 0,
        period: metrics.tasaOcupacion.periodo,
      },
      alert: { type: "success" as const, message: "Meta superada" },
    },
  ];

  const handleExportDashboard = async () => {
    await generateReport(
      "Dashboard Completo - Bodegas",
      mainMetrics,
      [
        charts.ingresosMensuales as unknown as Record<string, unknown>,
        charts.eventosPorCategoria as unknown as Record<string, unknown>,
        charts.distribucionPersonal as unknown as Record<string, unknown>,
        charts.ocupacionSemanal as unknown as Record<string, unknown>,
      ],
      [],
    );
  };

  const handleAlertConfiguration = () => {
    alert("Configuración de alertas - Funcionalidad próximamente disponible");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header del Dashboard */}
      <div className="flex items-center justify-between">
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
          <Button
            variant="outline"
            onClick={() => setShowExportPanel(!showExportPanel)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button
            variant="outline"
            onClick={handleAlertConfiguration}
            className="gap-2"
          >
            <Bell className="h-4 w-4" />
            Alertas
          </Button>
          <Button
            variant="default"
            onClick={handleExportDashboard}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Panel de Exportación */}
      {showExportPanel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exportar Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ExportUtils
              data={mainMetrics}
              filename="dashboard-bodegas"
              onExport={async (type, data) => {
                await exportData(type, data, "dashboard-completo");
              }}
            />
          </CardContent>
        </Card>
      )}

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
          onDownload={() =>
            exportData("excel", charts.ingresosMensuales, "ingresos-mensuales")
          }
          onRefresh={() => console.log("Actualizando ingresos...")}
        />

        <ChartCard
          title="Eventos por Categoría"
          subtitle="Distribución de tipos de eventos"
          data={charts.eventosPorCategoria}
          type="pie"
          dataKey="value"
          badge={{ text: "Activos", variant: "secondary" }}
          onDownload={() =>
            exportData("csv", charts.eventosPorCategoria, "eventos-categoria")
          }
        />

        <ChartCard
          title="Distribución de Personal"
          subtitle="Personal por departamento"
          data={charts.distribucionPersonal}
          type="pie"
          dataKey="value"
          badge={{
            text: `${metrics.personalActivo.cantidad} Total`,
            variant: "secondary",
          }}
          onDownload={() =>
            exportData(
              "excel",
              charts.distribucionPersonal,
              "distribucion-personal",
            )
          }
          onFilter={() => console.log("Filtrar personal...")}
        />

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
          onDownload={() =>
            exportData("csv", charts.ocupacionSemanal, "ocupacion-semanal")
          }
          onRefresh={() => console.log("Actualizando ocupación...")}
        />
      </div>

      {/* Panel de Alertas y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AlertsPanel
            onMarkAsRead={(id) => console.log("Marcar como leída:", id)}
            onDismiss={(id) => console.log("Descartar alerta:", id)}
            onConfigureAlerts={handleAlertConfiguration}
          />
        </div>

        <div className="lg:col-span-2">
          <LiveDataTable
            title="Eventos Programados"
            subtitle="Lista de eventos próximos y en curso"
            data={[]}
            columns={[]}
            showLiveIndicator={false}
            refreshInterval={0}
            onDownload={() => exportData("excel", [], "eventos-programados")}
            onViewDetails={(id) => console.log("Ver detalles del evento:", id)}
          />
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sucursales</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valoraciones</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Este Mes</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crecimiento</p>
                <p className="text-2xl font-bold">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
