"use server";

import { errorLogger } from "@/lib/utils";
import {
  fetchApiWithAuth,
  getAuthCookie,
  buildApiUrl,
} from "@/lib/utils.server";
import {
  BackendMetricsResponse,
  InstanciaEventoRelated,
} from "./dashboard.type";

export interface DashboardMetrics {
  ingresosMensuales: {
    valor: number;
    moneda: string;
    tendencia: number;
    periodo: string;
  };
  eventosActivos: {
    cantidad: number;
    capacidadUtilizada: number;
    capacidadMaxima: number;
    tendencia: number;
    periodo: string;
  };
  personalActivo: {
    cantidad: number;
    capacidadMaxima: number;
    tendencia: number;
    periodo: string;
  };
  puntuacionPromedio: {
    valor: number;
    meta: number;
    tendencia: number;
    periodo: string;
  };
  bodegasActivas: {
    cantidad: number;
    total: number;
  };
  tasaOcupacion: {
    porcentaje: number;
    tendencia: number;
    periodo: string;
  };
}

export interface DashboardCharts {
  ingresosMensuales: Array<{
    name: string;
    value: number;
  }>;
  eventosPorCategoria: Array<{
    name: string;
    value: number;
  }>;
  ocupacionSemanal: Array<{
    name: string;
    value: number;
  }>;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  charts: DashboardCharts;
  eventosProgramados: InstanciaEventoRelated[];
}

/**
 * Obtiene las instancias de eventos programadas para hoy y los próximos 30 días
 */
export const getEventosProgramados = async (): Promise<
  InstanciaEventoRelated[]
> => {
  try {
    const authCookieValue = await getAuthCookie();

    // Calcular fechas: hoy y próximos 30 días
    const hoy = new Date();
    const en30Dias = new Date();
    en30Dias.setDate(hoy.getDate() + 30);

    // Construir URL con parámetros de fecha
    const params = {
      fechaDesde: hoy,
      fechaHasta: en30Dias,
      bodegaId: authCookieValue.bodegaId,
      limit: 6,
    };

    const url = buildApiUrl("/eventos/instancias", params);
    const response = await fetchApiWithAuth<{
      items: InstanciaEventoRelated[];
      meta: {
        totalItems: number;
        currentPage: number;
        itemsPerPage: number;
        totalPages: number;
      };
    }>(url);
    // Retornar directamente los items de la respuesta
    return response.items;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener eventos programados";
    errorLogger(error, "[DASHBOARD]: getEventosProgramados");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene los datos del dashboard
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Obtener datos del backend
    const authCookieValue = await getAuthCookie();
    const backendMetrics = await fetchApiWithAuth<BackendMetricsResponse>(
      `/bodegas/${authCookieValue.bodegaId}/metrics`,
    );

    // Obtener eventos programados
    const eventosProgramados = await getEventosProgramados();

    // Mapear datos del backend a la estructura del dashboard
    const dashboardData: DashboardData = {
      metrics: {
        // Datos del backend
        eventosActivos: {
          cantidad: backendMetrics.eventosActivos,
          capacidadUtilizada: 0, // No viene del backend, mantener mock
          capacidadMaxima: 0, // No viene del backend, mantener mock
          tendencia: 0, // Removido - no se usa más
          periodo: "semana anterior",
        },
        personalActivo: {
          cantidad: backendMetrics.personalActivo,
          capacidadMaxima: 0, // No viene del backend, mantener mock
          tendencia: 0, // Removido - no se usa más
          periodo: "mes anterior",
        },
        puntuacionPromedio: {
          valor: backendMetrics.puntuacionPromedio,
          meta: 0, // No viene del backend, mantener mock
          tendencia: 0, // No viene del backend, mantener mock
          periodo: "mes anterior",
        },
        bodegasActivas: {
          cantidad: backendMetrics.bodegasActivas,
          total: 0, // No viene del backend, mantener mock
        },
        tasaOcupacion: {
          porcentaje: backendMetrics.tasaOcupacion,
          tendencia: 0, // Removido - no se usa más
          periodo: "semana anterior",
        },
        // Datos del backend
        ingresosMensuales: {
          valor: backendMetrics.ingresosMensuales,
          moneda: "ARS",
          tendencia: (() => {
            // Calcular tendencia comparando con el mes anterior
            if (backendMetrics.historialIngresosMensuales.length >= 2) {
              const currentMonth =
                backendMetrics.historialIngresosMensuales[
                  backendMetrics.historialIngresosMensuales.length - 1
                ];
              const previousMonth =
                backendMetrics.historialIngresosMensuales[
                  backendMetrics.historialIngresosMensuales.length - 2
                ];

              if (previousMonth.ingresos > 0) {
                return (
                  ((currentMonth.ingresos - previousMonth.ingresos) /
                    previousMonth.ingresos) *
                  100
                );
              }
            }
            return 0;
          })(),
          periodo: "mes anterior",
        },
      },
      charts: {
        // Datos del backend
        ingresosMensuales: backendMetrics.historialIngresosMensuales.map(
          (ingreso) => ({
            name: ingreso.month,
            value: ingreso.ingresos,
          }),
        ),
        // Datos del backend
        eventosPorCategoria: backendMetrics.eventosPorCategoria.map(
          (evento) => ({
            name: evento.categoria,
            value: evento.cantidad,
          }),
        ),
        // Datos del backend
        ocupacionSemanal: backendMetrics.ocupacionSemanal.map((ocupacion) => ({
          name: ocupacion.dia,
          value: ocupacion.reservasConfirmadas,
        })),
      },
      eventosProgramados,
    };

    return dashboardData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener datos del dashboard";
    errorLogger(error, "[DASHBOARD]: getDashboardData");
    throw new Error(errorMessage);
  }
};
