"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventoDetallesSchema } from "@/api/eventos/evento.type";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Tipo inferido del schema de Zod
type EventoDetallesFields = z.infer<typeof EventoDetallesSchema>;

interface EventoDetallesStepProps {
  initialData?: Partial<EventoDetallesFields>;
  onNext: (data: Partial<EventoDetallesFields>) => void;
  onCancel: () => void;
  categorias: Array<{ id: number; nombre: string }>;
  sucursales: Array<{ id: number; nombre: string }>;
}

export function EventoDetallesStep({
  initialData,
  onNext,
  onCancel,
  categorias,
  sucursales,
}: EventoDetallesStepProps) {
  const form = useForm<EventoDetallesFields>({
    resolver: zodResolver(EventoDetallesSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      duracion: initialData?.duracion,
      cupos: initialData?.cupos,
      categoriaId: initialData?.categoriaId,
      precio: initialData?.precio,
      sucursalId: initialData?.sucursalId,
      descripcion: initialData?.descripcion || "",
    },
  });

  const {
    formState: { isValid },
  } = form;

  const onSubmit = (data: EventoDetallesFields) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              {...form.register("nombre")}
              placeholder="Nombre del evento"
            />
            {form.formState.errors.nombre && (
              <p className="text-sm text-red-600">
                {form.formState.errors.nombre.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duracion">Duración (Hrs) *</Label>
            <Input
              id="duracion"
              type="number"
              min={0}
              max={24}
              {...form.register("duracion")}
              placeholder="Duración en horas"
            />
            {form.formState.errors.duracion && (
              <p className="text-sm text-red-600">
                {form.formState.errors.duracion.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cupos">Cupos *</Label>
            <Input
              id="cupos"
              {...form.register("cupos")}
              placeholder="Número de cupos"
            />
            {form.formState.errors.cupos && (
              <p className="text-sm text-red-600">
                {form.formState.errors.cupos.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select
              value={form.watch("categoriaId")?.toString() || ""}
              onValueChange={(value) =>
                form.setValue("categoriaId", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar categoria" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {categorias.map((categoria) => (
                  <SelectItem
                    key={categoria.id}
                    value={categoria.id.toString()}
                  >
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.categoriaId && (
              <p className="text-sm text-red-600">
                {form.formState.errors.categoriaId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="precio">Precio *</Label>
            <Input
              id="precio"
              {...form.register("precio")}
              placeholder="Precio del evento"
            />
            {form.formState.errors.precio && (
              <p className="text-sm text-red-600">
                {form.formState.errors.precio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sucursal">Sucursal *</Label>
            <Select
              value={form.watch("sucursalId")?.toString() || ""}
              onValueChange={(value) =>
                form.setValue("sucursalId", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {sucursales.map((sucursal) => (
                  <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.sucursalId && (
              <p className="text-sm text-red-600">
                {form.formState.errors.sucursalId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            {...form.register("descripcion")}
            placeholder="Descripción del evento"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
