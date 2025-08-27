import { Avatar, AvatarFallback } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Routes } from "@/lib/routes";
import Link from "next/link";
import { User, LogOut } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="bg-primary text-white px-6 py-2 flex items-center justify-between h-16">
      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-wider font-inria-serif">
          VINZA
        </h1>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
