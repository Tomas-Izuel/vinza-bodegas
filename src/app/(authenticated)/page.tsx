import { DashboardClient } from "./dashboard-client";
import { getDashboardData } from "@/api/dashboard/dashboard.service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Dashboard",
  description: "Panel de control y métricas administrativas",
};

// Forzar renderizado dinámico porque usamos cookies para autenticación
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const dashboardData = await getDashboardData();

  return <DashboardClient dashboardData={dashboardData} />;
}
