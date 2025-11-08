"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useExportUtils } from "@/components/dashboard/ExportUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, FileText, RefreshCw } from "lucide-react";
import { DashboardData } from "@/api/dashboard/dashboard.service";
import { LiveDataTable } from "@/components/dashboard/LiveDataTable";

interface DashboardClientProps {
  dashboardData: DashboardData;
  bodegaNombre: string;
}

export function DashboardClient({
  dashboardData,
  bodegaNombre,
}: DashboardClientProps) {
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
      description: (
        <>
          <strong>Ingresos Mensuales:</strong> $
          {metrics.ingresosMensuales.valor.toLocaleString()}{" "}
          {metrics.ingresosMensuales.moneda}
          {metrics.ingresosMensuales.tendencia !== 0 && (
            <span className="text-muted-foreground">
              {" "}
              ({metrics.ingresosMensuales.tendencia >= 0 ? "+" : ""}
              {metrics.ingresosMensuales.tendencia.toFixed(1)}% vs.{" "}
              {metrics.ingresosMensuales.periodo})
            </span>
          )}
          . Representa los ingresos totales generados durante el mes actual.
        </>
      ),
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
      description: (
        <>
          <strong>Eventos Activos:</strong> {metrics.eventosActivos.cantidad}{" "}
          eventos en curso. Indica la cantidad de eventos que se encuentran
          actualmente activos y operativos.
        </>
      ),
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
      description: (
        <>
          <strong>Personal Activo:</strong> {metrics.personalActivo.cantidad}{" "}
          empleados. Refleja el número de trabajadores disponibles en la bodega
          al momento del reporte.
        </>
      ),
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
      description: (
        <>
          <strong>Puntuación Promedio:</strong>{" "}
          {metrics.puntuacionPromedio.valor.toFixed(1)} de 5.0 estrellas
          {metrics.puntuacionPromedio.tendencia !== 0 && (
            <span className="text-muted-foreground">
              {" "}
              ({metrics.puntuacionPromedio.tendencia >= 0 ? "+" : ""}
              {metrics.puntuacionPromedio.tendencia.toFixed(1)}% vs.{" "}
              {metrics.puntuacionPromedio.periodo})
            </span>
          )}
          . Mide el nivel de satisfacción promedio de los clientes con los
          servicios ofrecidos.
        </>
      ),
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
      description: (
        <>
          <strong>Sucursales Activas:</strong> {metrics.bodegasActivas.cantidad}
          {metrics.bodegasActivas.total > 0 &&
            ` de ${metrics.bodegasActivas.total} total`}
          . Representa el número de sucursales operativas dentro de la red.
        </>
      ),
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
      description: (
        <>
          <strong>Tasa de Ocupación:</strong> {metrics.tasaOcupacion.porcentaje}
          % promedio. Indica el porcentaje de capacidad utilizada en relación
          con la capacidad total disponible.
        </>
      ),
    },
  ];

  const handleExportPDF = () => {
    window.print();
  };

  const printDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const printTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6 p-6">
      {/* Print-only header */}
      <div className="print-only-header hidden">
        <h1 className="text-4xl font-bold mb-4">
          Reporte de control gestión de bodega {bodegaNombre}
        </h1>
        <p className="text-xl mb-2 font-semibold">
          Documento de reporte ejecutivo y métricas de gestión
        </p>
        <p className="text-base mb-4 text-muted-foreground">
          Fecha de impresión: {printDate} a las {printTime}
        </p>
        <div className="text-base space-y-3 mb-4">
          <p>
            Este reporte presenta un análisis completo del estado actual de la
            bodega, incluyendo métricas financieras, operativas y de
            rendimiento. Los valores mostrados reflejan el estado en tiempo real
            al momento de la generación del documento.
          </p>

          <p>
            Los gráficos incluidos en este reporte proporcionan una
            visualización detallada de las tendencias de ingresos mensuales,
            distribución de eventos por categoría y ocupación semanal,
            facilitando la identificación de patrones y la toma de decisiones
            estratégicas.
          </p>

          <p className="font-medium">
            Este es el reporte actualizado al momento de la impresión y contiene
            información confidencial para uso interno de la organización.
          </p>
        </div>
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
        <div>
          <h3 className="text-xl font-semibold mb-2 print-only hidden">
            Ingresos Mensuales
          </h3>
          <ChartCard
            title="Ingresos Mensuales"
            subtitle="Evolución de ingresos por mes"
            description={
              <>
                En la evolución de ingresos mensuales podemos observar que el
                mes más reciente (
                {charts.ingresosMensuales[charts.ingresosMensuales.length - 1]
                  ?.name || "N/A"}
                ) registró ingresos de $
                {charts.ingresosMensuales[
                  charts.ingresosMensuales.length - 1
                ]?.value.toLocaleString() || 0}{" "}
                {metrics.ingresosMensuales.moneda}.
                {charts.ingresosMensuales.length >= 2 && (
                  <>
                    {" "}
                    Comparado con el mes anterior (
                    {charts.ingresosMensuales[
                      charts.ingresosMensuales.length - 2
                    ]?.name || "N/A"}
                    ) que tuvo $
                    {charts.ingresosMensuales[
                      charts.ingresosMensuales.length - 2
                    ]?.value.toLocaleString() || 0}{" "}
                    {metrics.ingresosMensuales.moneda},
                    {metrics.ingresosMensuales.tendencia !== 0 && (
                      <>
                        {" "}
                        se observa una{" "}
                        {metrics.ingresosMensuales.tendencia >= 0
                          ? "tendencia positiva"
                          : "disminución"}
                        del{" "}
                        {Math.abs(metrics.ingresosMensuales.tendencia).toFixed(
                          1,
                        )}
                        %.
                      </>
                    )}
                  </>
                )}{" "}
                El total de ingresos mensuales actual es de $
                {metrics.ingresosMensuales.valor.toLocaleString()}{" "}
                {metrics.ingresosMensuales.moneda}.
              </>
            }
            data={charts.ingresosMensuales}
            type="area"
            dataKey="value"
            badge={{ text: "Tendencia Positiva", variant: "secondary" }}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 print-only hidden">
            Eventos por Categoría
          </h3>
          <ChartCard
            title="Eventos por Categoría"
            subtitle="Distribución de tipos de eventos"
            description={(() => {
              const total = charts.eventosPorCategoria.reduce(
                (sum, item) => sum + item.value,
                0,
              );
              const sorted = [...charts.eventosPorCategoria].sort(
                (a, b) => b.value - a.value,
              );
              const categoryTexts = sorted.map((item, index) => {
                const porcentaje =
                  total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
                if (index === 0) {
                  return (
                    <strong key={item.name}>
                      {item.name} tiene el {porcentaje}%
                    </strong>
                  );
                } else if (index === sorted.length - 1) {
                  return (
                    <span key={item.name}>
                      {" "}
                      y {item.name} con el {porcentaje}%
                    </span>
                  );
                } else {
                  return (
                    <span key={item.name}>
                      , {item.name} el {porcentaje}%
                    </span>
                  );
                }
              });
              return (
                <>
                  En la distribución de eventos podemos ver cómo {categoryTexts}
                  . En total hay {total} eventos activos distribuidos en{" "}
                  {charts.eventosPorCategoria.length} categorías diferentes.
                </>
              );
            })()}
            data={charts.eventosPorCategoria}
            type="pie"
            dataKey="value"
            badge={{ text: "Activos", variant: "secondary" }}
          />
        </div>
      </div>

      {/* Ocupación Semanal y Eventos Programados */}
      <h2 className="text-2xl font-bold mb-4 print-only hidden">
        Análisis de Ocupación
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 print-only hidden">
            Ocupación Semanal
          </h3>
          <ChartCard
            title="Ocupación Semanal"
            subtitle="Porcentaje de ocupación por día"
            description={(() => {
              const sorted = [...charts.ocupacionSemanal].sort(
                (a, b) => b.value - a.value,
              );
              const maxDay = sorted[0];
              const minDay = sorted[sorted.length - 1];
              return (
                <>
                  En la ocupación semanal podemos observar que{" "}
                  <strong>{maxDay?.name}</strong> presenta el mayor nivel de
                  ocupación con {maxDay?.value}%,
                  {minDay && minDay.name !== maxDay?.name && (
                    <>
                      {" "}
                      mientras que <strong>{minDay.name}</strong> tiene el menor
                      con {minDay.value}%.
                    </>
                  )}{" "}
                  El promedio general de ocupación es del{" "}
                  <strong>{metrics.tasaOcupacion.porcentaje}%</strong>, lo que
                  indica la eficiencia en la utilización de la capacidad
                  disponible durante la semana.
                </>
              );
            })()}
            data={charts.ocupacionSemanal}
            type="bar"
            dataKey="value"
            badge={{
              text: `${metrics.tasaOcupacion.porcentaje}% Promedio`,
              variant: "outline",
            }}
          />
        </div>

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
