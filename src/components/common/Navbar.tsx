import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { getAuthCookie } from "@/lib/utils.server";

export default async function TopNav() {
  const authCookie = await getAuthCookie();

  return (
    <nav className="bg-primary text-white px-6 py-2 flex items-center justify-between h-16">
      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-wider font-inria-serif">
          VINZA {authCookie.bodega ? " - " + authCookie.bodega.nombre : ""}
        </h1>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold">{authCookie.email}</p>
              <p className="text-xs text-gray-300">
                {authCookie.roles[0].nombre}
              </p>
            </div>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="end">
          <div className="py-1">
            <Link
              href={Routes.PERFIL}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="mr-3 h-4 w-4" />
              Ver perfil
            </Link>
            <Link
              href={Routes.LOGOUT}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar sesión
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
