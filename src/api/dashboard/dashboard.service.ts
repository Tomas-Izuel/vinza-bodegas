"use server";

import { errorLogger } from "@/lib/utils";

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
  distribucionPersonal: Array<{
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
}

/**
 * Obtiene los datos del dashboard
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Por ahora retornamos datos mock, pero aquí irían las llamadas reales a la API
    const mockData: DashboardData = {
      metrics: {
        ingresosMensuales: {
          valor: 0,
          moneda: "ARS",
          tendencia: 0,
          periodo: "mes anterior",
        },
        eventosActivos: {
          cantidad: 0,
          capacidadUtilizada: 0,
          capacidadMaxima: 0,
          tendencia: 0,
          periodo: "semana anterior",
        },
        personalActivo: {
          cantidad: 0,
          capacidadMaxima: 0,
          tendencia: 0,
          periodo: "mes anterior",
        },
        puntuacionPromedio: {
          valor: 0,
          meta: 0,
          tendencia: 0,
          periodo: "mes anterior",
        },
        bodegasActivas: {
          cantidad: 0,
          total: 0,
        },
        tasaOcupacion: {
          porcentaje: 0,
          tendencia: 0,
          periodo: "semana anterior",
        },
      },
      charts: {
        ingresosMensuales: [
          { name: "Ene", value: 0 },
          { name: "Feb", value: 0 },
          { name: "Mar", value: 0 },
          { name: "Abr", value: 0 },
          { name: "May", value: 0 },
          { name: "Jun", value: 0 },
        ],
        eventosPorCategoria: [
          { name: "Catas", value: 0 },
          { name: "Tours", value: 0 },
          { name: "Maridajes", value: 0 },
          { name: "Cursos", value: 0 },
        ],
        distribucionPersonal: [
          { name: "Administración", value: 0 },
          { name: "Producción", value: 0 },
          { name: "Ventas", value: 0 },
          { name: "Turismo", value: 0 },
        ],
        ocupacionSemanal: [
          { name: "Lun", value: 0 },
          { name: "Mar", value: 0 },
          { name: "Mié", value: 0 },
          { name: "Jue", value: 0 },
          { name: "Vie", value: 0 },
          { name: "Sáb", value: 0 },
          { name: "Dom", value: 0 },
        ],
      },
    };

    return mockData;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener datos del dashboard";
    errorLogger(error, "getDashboardData");
    throw new Error(errorMessage);
  }
};
