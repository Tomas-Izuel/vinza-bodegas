import { getEventos } from "@/api/eventos/eventos.service";
import Link from "next/link";

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <Link href="#" className="bg-primary text-white px-4 py-2 rounded">
          Nuevo evento
        </Link>
      </div>
      {/* Buscador y paginación (TODO: implementar) */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border rounded px-3 py-2 w-64"
          disabled
        />
        {/* Aquí iría el badge de notificaciones si aplica */}
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Sucursal</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Última modificación</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id} className="border-b last:border-0">
                <td className="px-4 py-2">{evento.nombre}</td>
                <td className="px-4 py-2">{evento.sucursal}</td>
                <td className="px-4 py-2">
                  {/* Badge de estado */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      evento.estado === "Activo"
                        ? "bg-green-100 text-green-700"
                        : evento.estado === "Finalizado"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {evento.estado}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(evento.ultimaModificacion).toLocaleDateString(
                    "es-AR",
                    { year: "numeric", month: "short", day: "numeric" },
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Link href="#" className="text-gray-700 hover:underline">
                    Ver
                  </Link>
                  <Link href="#" className="text-primary hover:underline">
                    Editar
                  </Link>
                  <button className="text-red-600 hover:underline" disabled>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginación (TODO: implementar) */}
      <div className="flex justify-end mt-4">
        <button className="bg-primary text-white px-4 py-2 rounded" disabled>
          Siguiente
        </button>
      </div>
    </>
  );
}
