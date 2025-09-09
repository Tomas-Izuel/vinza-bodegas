"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// Componente removido - ya no usa Card

// Importar Leaflet dinámicamente para evitar errores de SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapViewProps {
  direccion: string;
}

interface GeocodeResult {
  lat: string;
  lon: string;
  display_name: string;
}

const MapView = ({ direccion }: MapViewProps) => {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para geocodificar la dirección usando Nominatim (OpenStreetMap)
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) {
      setCoordinates(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address + ", Argentina",
        )}&limit=1`,
      );

      if (!response.ok) {
        throw new Error("Error al buscar la dirección");
      }

      const data: GeocodeResult[] = await response.json();

      if (data.length > 0) {
        setCoordinates({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        });
      } else {
        setError("No se pudo encontrar la dirección");
        setCoordinates(null);
      }
    } catch (err) {
      setError("Error al buscar la dirección");
      setCoordinates(null);
      console.error("Geocoding error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para geocodificar cuando cambia la dirección
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      geocodeAddress(direccion);
    }, 1000); // Debounce de 1 segundo

    return () => clearTimeout(timeoutId);
  }, [direccion]);

  if (!direccion.trim()) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Vista previa del mapa
        </label>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="h-64 bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Ingresa una dirección para ver el mapa
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Vista previa del mapa
      </label>
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="h-64 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-muted rounded-md flex items-center justify-center z-10">
              <p className="text-muted-foreground text-sm">
                Buscando dirección...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-muted rounded-md flex items-center justify-center">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {coordinates && !isLoading && (
            <MapContainer
              center={[coordinates.lat, coordinates.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              className="rounded-md"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coordinates.lat, coordinates.lng]}>
                <Popup>
                  <span className="text-sm">{direccion}</span>
                </Popup>
              </Marker>
            </MapContainer>
          )}

          {!coordinates && !isLoading && !error && (
            <div className="h-full bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Ingresa una dirección válida
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;
