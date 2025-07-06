export type Evento = {
  id: string;
  nombre: string;
  sucursal: string;
  estado: "Activo" | "Finalizado" | "Suspendido";
  ultimaModificacion: string; // ISO date
};

export const getEventos = async (): Promise<Evento[]> => {
  // TODO: Reemplazar por llamada real al backend
  return [
    {
      id: "1",
      nombre: "sit ipsam ipsum",
      sucursal: "sit-ipsam-ipsum",
      estado: "Activo",
      ultimaModificacion: "2024-02-08",
    },
    {
      id: "2",
      nombre: "quae officiis officiis",
      sucursal: "quae-officiis-officiis",
      estado: "Finalizado",
      ultimaModificacion: "2024-03-13",
    },
    {
      id: "3",
      nombre: "laudantium ut voluptates",
      sucursal: "laudantium-ut-voluptates",
      estado: "Finalizado",
      ultimaModificacion: "2024-03-23",
    },
    {
      id: "4",
      nombre: "culpa possimus autem",
      sucursal: "culpa-possimus-autem",
      estado: "Activo",
      ultimaModificacion: "2023-12-24",
    },
    {
      id: "5",
      nombre: "quia ut nihil",
      sucursal: "quia-ut-nihil",
      estado: "Suspendido",
      ultimaModificacion: "2024-04-30",
    },
    // ...otros eventos de ejemplo
  ];
};
