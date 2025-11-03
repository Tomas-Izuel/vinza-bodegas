"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventoFechaSchema } from "@/api/eventos/evento.type";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

// Tipo inferido del schema de Zod
type EventoFechaFields = z.infer<typeof EventoFechaSchema>;

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
];

const diasSemana = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
];

interface EventoFechaStepProps {
  initialData?: Partial<EventoFechaFields>;
  eventData: Partial<{
    nombre: string;
    duracion: number;
    descripcion?: string;
  }>;
  onNext: (data: Partial<EventoFechaFields>) => void;
  onBack: () => void;
}

export function EventoFechaStep({
  initialData,
  eventData,
  onNext,
  onBack,
}: EventoFechaStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>(
    initialData?.fechas || [],
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData?.diasSemana || [],
  );

  const form = useForm<EventoFechaFields>({
    resolver: zodResolver(EventoFechaSchema),
    defaultValues: {
      tipoEvento: initialData?.tipoEvento || "unica",
      fechas: initialData?.fechas || [],
      diasSemana: initialData?.diasSemana || [],
      fechaDesde: initialData?.fechaDesde || "",
      fechaHasta: initialData?.fechaHasta || "",
      hora: initialData?.hora || "",
    },
  });

  const toggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date],
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const formatDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    return date.toISOString().split("T")[0];
  };

  const isDateSelected = (day: number) => {
    const dateStr = formatDate(day);
    return selectedDates.includes(dateStr);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const today = new Date();
    return date < today;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

  const availableTimeSlots = timeSlots;
  return (
    <div className="grid grid-cols-3 gap-8">
      {/* Panel izquierdo - Resumen y tipo de evento */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Fecha y hora</h3>
          <p className="text-gray-600">Selecciona la fecha de tu evento</p>
        </div>

        {/* Resumen del evento */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-medium">
              {eventData.nombre || "Nombre del evento"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span>
              {eventData.duracion || 0} hora
              {eventData.duracion !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm text-gray-600">{eventData.descripcion || ""}</p>
        </div>

        {/* Tipo de evento */}
        <div className="space-y-2">
          <Label>Tipo de evento</Label>
          <Select
            value={form.watch("tipoEvento")}
            onValueChange={(value: "unica" | "recurrente") =>
              form.setValue("tipoEvento", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unica">Única vez</SelectItem>
              <SelectItem value="recurrente">Recurrente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campos opcionales para eventos recurrentes */}
        {form.watch("tipoEvento") === "recurrente" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="fechaDesde" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha desde (opcional)
              </Label>
              <Input
                id="fechaDesde"
                type="date"
                value={form.watch("fechaDesde") || ""}
                onChange={(e) => form.setValue("fechaDesde", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaHasta" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha hasta (opcional)
              </Label>
              <Input
                id="fechaHasta"
                type="date"
                value={form.watch("fechaHasta") || ""}
                onChange={(e) => form.setValue("fechaHasta", e.target.value)}
                className="w-full"
                min={form.watch("fechaDesde") || undefined}
              />
            </div>
          </div>
        )}
      </div>

      {/* Panel central - Calendario o Días de la semana */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {form.watch("tipoEvento") === "unica" ? "Fecha" : "Días de la semana"}
        </h3>

        {form.watch("tipoEvento") === "unica" ? (
          <>
            {/* Navegación del mes */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                    ),
                  )
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium">
                {monthNames[currentMonth.getMonth()]} -{" "}
                {currentMonth.getFullYear()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                    ),
                  )
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600">
              {["D", "L", "M", "Mi", "J", "V", "S"].map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDay }, (_, i) => (
                <div key={`empty-${i}`} className="py-2" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = formatDate(day);
                const isSelected = isDateSelected(day);
                const isDisabled = isDateDisabled(day);

                return (
                  <button
                    key={day}
                    onClick={() => !isDisabled && toggleDate(dateStr)}
                    disabled={isDisabled}
                    className={`
                      py-2 px-3 rounded-full text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? "bg-primary text-white"
                          : isDisabled
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Selector de días de la semana para eventos recurrentes */
          <div className="space-y-2">
            {diasSemana.map((dia) => (
              <button
                key={dia.value}
                onClick={() => toggleDay(dia.value)}
                className={`
                  w-full p-3 text-left rounded-lg border transition-colors
                  ${
                    selectedDays.includes(dia.value)
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {dia.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel derecho - Horarios y fechas opcionales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hora</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {availableTimeSlots.map((time) => (
            <button
              key={time}
              onClick={() => form.setValue("hora", time)}
              className={`
                w-full p-3 text-left rounded-lg border transition-colors
                ${
                  form.watch("hora") === time
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="col-span-3 flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button
          onClick={() => {
            const tipoEvento = form.watch("tipoEvento");
            const data: EventoFechaFields = {
              tipoEvento: tipoEvento as "unica" | "recurrente",
              hora: form.watch("hora"),
              fechas: selectedDates,
              diasSemana: selectedDays,
              fechaDesde: form.watch("fechaDesde"),
              fechaHasta: form.watch("fechaHasta"),
            };

            if (tipoEvento === "unica") {
              data.fechas = selectedDates;
            } else {
              data.diasSemana = selectedDays;
              data.fechaDesde = form.watch("fechaDesde");
              data.fechaHasta = form.watch("fechaHasta");
            }

            // Validación adicional
            if (data.fechaDesde && data.fechaHasta) {
              const fechaDesde = new Date(data.fechaDesde);
              const fechaHasta = new Date(data.fechaHasta);
              if (fechaDesde > fechaHasta) {
                alert("La fecha desde no puede ser mayor a la fecha hasta");
                return;
              }
            }

            onNext(data);
          }}
          disabled={
            !form.watch("hora") ||
            (form.watch("tipoEvento") === "unica" &&
              selectedDates.length === 0) ||
            (form.watch("tipoEvento") === "recurrente" &&
              selectedDays.length === 0)
          }
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
