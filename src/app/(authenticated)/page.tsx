/* eslint-disable @typescript-eslint/no-explicit-any */
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

const HomePage = () => {
  const [showExportPanel, setShowExportPanel] = useState(false);
  const { exportData, generateReport } = useExportUtils();

  // Datos mock para métricas principales
  const mainMetrics = [
    {
      title: "Ingresos Mensuales",
      value: "$2,847,500",
      subtitle: "ARS",
      trend: { value: 12.5, isPositive: true, period: "mes anterior" },
      onDownload: () => exportData("excel", [], "ingresos-mensuales"),
      onAlert: () => alert("Configurar alerta para ingresos mensuales"),
    },
    {
      title: "Eventos Activos",
      value: 24,
      subtitle: "en curso",
      trend: { value: 8.3, isPositive: true, period: "semana anterior" },
      progress: { value: 18, max: 30, label: "Capacidad utilizada" },
      onDownload: () => exportData("csv", [], "eventos-activos"),
    },
    {
      title: "Personal Activo",
      value: "47",
      subtitle: "empleados",
      trend: { value: 8.5, isPositive: true, period: "mes anterior" },
      progress: { value: 47, max: 50, label: "Capacidad de personal" },
      onAlert: () => alert("Ver gestión de personal"),
    },
    {
      title: "Puntuación Promedio",
      value: "4.8",
      subtitle: "★ de 5.0",
      trend: { value: 2.1, isPositive: true, period: "mes anterior" },
      progress: { value: 48, max: 50, label: "Meta mensual" },
    },
    {
      title: "Bodegas Activas",
      value: 18,
      subtitle: "de 22 total",
      progress: { value: 18, max: 22, label: "Operativas" },
      onDownload: () => exportData("excel", [], "bodegas-status"),
    },
    {
      title: "Tasa de Ocupación",
      value: "87%",
      subtitle: "promedio",
      trend: { value: 5.7, isPositive: true, period: "semana anterior" },
      alert: { type: "success" as const, message: "Meta superada" },
    },
  ];

  // Datos para gráficos
  const monthlyRevenue = [
    { name: "Ene", value: 2100000 },
    { name: "Feb", value: 2300000 },
    { name: "Mar", value: 2800000 },
    { name: "Abr", value: 2600000 },
    { name: "May", value: 3100000 },
    { name: "Jun", value: 2847500 },
  ];

  const eventsByCategory = [
    { name: "Catas", value: 35 },
    { name: "Tours", value: 28 },
    { name: "Maridajes", value: 22 },
    { name: "Cursos", value: 15 },
  ];

  const staffDistribution = [
    { name: "Administración", value: 12 },
    { name: "Producción", value: 18 },
    { name: "Ventas", value: 10 },
    { name: "Turismo", value: 7 },
  ];

  const occupancyTrend = [
    { name: "Lun", value: 78 },
    { name: "Mar", value: 85 },
    { name: "Mié", value: 92 },
    { name: "Jue", value: 88 },
    { name: "Vie", value: 95 },
    { name: "Sáb", value: 89 },
    { name: "Dom", value: 82 },
  ];

  const handleExportDashboard = async () => {
    await generateReport(
      "Dashboard Completo - Bodegas",
      mainMetrics,
      [
        monthlyRevenue as any,
        eventsByCategory as any,
        staffDistribution as any,
        occupancyTrend as any,
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
          data={monthlyRevenue}
          type="area"
          dataKey="value"
          badge={{ text: "Tendencia Positiva", variant: "secondary" }}
          onDownload={() =>
            exportData("excel", monthlyRevenue, "ingresos-mensuales")
          }
          onRefresh={() => console.log("Actualizando ingresos...")}
        />

        <ChartCard
          title="Eventos por Categoría"
          subtitle="Distribución de tipos de eventos"
          data={eventsByCategory}
          type="pie"
          dataKey="value"
          badge={{ text: "Activos", variant: "secondary" }}
          onDownload={() =>
            exportData("csv", eventsByCategory, "eventos-categoria")
          }
        />

        <ChartCard
          title="Distribución de Personal"
          subtitle="Personal por departamento"
          data={staffDistribution}
          type="pie"
          dataKey="value"
          badge={{ text: "47 Total", variant: "secondary" }}
          onDownload={() =>
            exportData("excel", staffDistribution, "distribucion-personal")
          }
          onFilter={() => console.log("Filtrar personal...")}
        />

        <ChartCard
          title="Ocupación Semanal"
          subtitle="Porcentaje de ocupación por día"
          data={occupancyTrend}
          type="bar"
          dataKey="value"
          badge={{ text: "87% Promedio", variant: "outline" }}
          onDownload={() =>
            exportData("csv", occupancyTrend, "ocupacion-semanal")
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
};

export default HomePage;
