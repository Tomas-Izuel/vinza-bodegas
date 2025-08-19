"use client";
import Link from "next/link";
import { Home, FileText, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Routes, RouteSchema } from "@/lib/routes";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const path = usePathname();
  const activePage = RouteSchema.safeParse(path);

  return (
    <aside className="w-60 bg-[#FFFAF4] border-r border-gray-200 h-[calc(100vh-64px)]">
      <div className="p-4 space-y-1">
        {/* Panel - Active Item */}
        <Link href={Routes.HOME}>
          <div
            className={cn(
              "flex items-center px-1 py-1 rounded-md text-sm font-medium cursor-pointer",
              activePage.success && activePage.data === Routes.HOME
                ? "bg-gray-100 text-primary"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <Home className="h-4 w-4 mr-3" />
            Panel
          </div>
        </Link>

        {/* Eventos Section */}
        <div className="pt-4">
          <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Eventos
          </div>
          <div className="mt-1 space-y-1">
            <Link
              href={Routes.RESERVAS}
              className={cn(
                "flex items-center px-1 py-1 rounded-md text-sm font-medium cursor-pointer",
                activePage.success && activePage.data === Routes.RESERVAS
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="flex items-center px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <FileText className="h-4 w-4 mr-3" />
                <span className="flex-1">Reservas</span>
                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                  217
                </span>
              </div>
            </Link>
            <Link
              href={Routes.EVENTOS}
              className={cn(
                "flex items-center px-1 py-1 rounded-md text-sm font-medium cursor-pointer",
                activePage.success && activePage.data === Routes.EVENTOS
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="flex items-center px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <Calendar className="h-4 w-4 mr-3" />
                Eventos
              </div>
            </Link>
          </div>
        </div>

        {/* Bodega Section */}
        <div className="pt-4">
          <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bodega
          </div>
          <div className="mt-1 space-y-1">
            <Link
              href={Routes.BODEDA_INFORMACION}
              className={cn(
                "flex items-center px-1 py-1 rounded-md text-sm font-medium cursor-pointer",
                activePage.success &&
                  activePage.data === Routes.BODEDA_INFORMACION
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="flex items-center px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <FileText className="h-4 w-4 mr-3" />
                Información de bodega
              </div>
            </Link>
            <Link
              href={Routes.USUARIOS}
              className={cn(
                "flex items-center px-1 py-1 rounded-md text-sm font-medium cursor-pointer",
                activePage.success && activePage.data === Routes.USUARIOS
                  ? "bg-gray-100 text-primary"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <div className="flex items-center px-1 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
                <Users className="h-4 w-4 mr-3" />
                Usuarios y permisos
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
