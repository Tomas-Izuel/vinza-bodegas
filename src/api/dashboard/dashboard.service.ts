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
          valor: 2847500,
          moneda: "ARS",
          tendencia: 12.5,
          periodo: "mes anterior",
        },
        eventosActivos: {
          cantidad: 24,
          capacidadUtilizada: 18,
          capacidadMaxima: 30,
          tendencia: 8.3,
          periodo: "semana anterior",
        },
        personalActivo: {
          cantidad: 47,
          capacidadMaxima: 50,
          tendencia: 8.5,
          periodo: "mes anterior",
        },
        puntuacionPromedio: {
          valor: 4.8,
          meta: 5.0,
          tendencia: 2.1,
          periodo: "mes anterior",
        },
        bodegasActivas: {
          cantidad: 18,
          total: 22,
        },
        tasaOcupacion: {
          porcentaje: 87,
          tendencia: 5.7,
          periodo: "semana anterior",
        },
      },
      charts: {
        ingresosMensuales: [
          { name: "Ene", value: 2100000 },
          { name: "Feb", value: 2300000 },
          { name: "Mar", value: 2800000 },
          { name: "Abr", value: 2600000 },
          { name: "May", value: 3100000 },
          { name: "Jun", value: 2847500 },
        ],
        eventosPorCategoria: [
          { name: "Catas", value: 35 },
          { name: "Tours", value: 28 },
          { name: "Maridajes", value: 22 },
          { name: "Cursos", value: 15 },
        ],
        distribucionPersonal: [
          { name: "Administración", value: 12 },
          { name: "Producción", value: 18 },
          { name: "Ventas", value: 10 },
          { name: "Turismo", value: 7 },
        ],
        ocupacionSemanal: [
          { name: "Lun", value: 78 },
          { name: "Mar", value: 85 },
          { name: "Mié", value: 92 },
          { name: "Jue", value: 88 },
          { name: "Vie", value: 95 },
          { name: "Sáb", value: 89 },
          { name: "Dom", value: 82 },
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
