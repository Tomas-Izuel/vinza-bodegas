"use client";

import {
    Sucursal,
    EditarSucursalSchema,
    EditarSucursalType,
} from "@/api/sucursales/sucursal.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import moment from "moment";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actualizarSucursal } from "@/api/sucursales/sucursal.service";
import { Switch } from "@/components/ui/switch";
import MapView from "@/components/bodega/MapView";

interface SucursalDetalleProps {
    sucursal: Sucursal;
    onSucursalUpdated?: (sucursalActualizada: Sucursal) => void;
}

export function SucursalDetalle({
    sucursal,
    onSucursalUpdated,
}: SucursalDetalleProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isEditing = searchParams.get("editar") === "true";

    const form = useForm<EditarSucursalType>({
        resolver: zodResolver(EditarSucursalSchema),
        defaultValues: {
            nombre: sucursal.nombre,
            direccion: sucursal.direccion,
            aclaraciones: sucursal.aclaraciones || "",
            es_principal: sucursal.es_principal,
        },
    });

    const onSubmit = async (data: EditarSucursalType) => {
        try {
            const sucursalActualizada = await actualizarSucursal(
                sucursal.id.toString(),
                data
            );
            onSucursalUpdated?.(sucursalActualizada);

            // Remover el parámetro de edición de la URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete("editar");
            router.push(`?${params.toString()}`);
        } catch (error) {
            console.error("Error al actualizar sucursal:", error);
        }
    };

    const cancelarEdicion = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("editar");
        router.push(`?${params.toString()}`);
        form.reset();
    };

    return (
        <Card className="shadow-none">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Información de la sucursal */}
                            <div className="lg:col-span-3 space-y-6">
                                {/* Primera fila de información */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Nombre
                                        </p>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="nombre"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">{sucursal.nombre}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Tipo
                                        </p>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="es_principal"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center space-x-2">
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                                <span className="text-sm">
                                                                    {field.value ? "Principal" : "Secundaria"}
                                                                </span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <Badge
                                                variant={sucursal.es_principal ? "default" : "secondary"}
                                            >
                                                {sucursal.es_principal ? "Principal" : "Secundaria"}
                                            </Badge>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Fecha de creación
                                        </p>
                                        <p className="text-base text-green-600">
                                            {moment(sucursal.created_at).format("DD/MM/YYYY")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Última modificación
                                        </p>
                                        <p className="text-base text-gray-600">
                                            {moment(sucursal.updated_at).format("DD/MM/YYYY")}
                                        </p>
                                    </div>
                                </div>

                                {/* Segunda fila de información */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Dirección
                                        </p>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="direccion"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">
                                                {sucursal.direccion}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">
                                            Aclaraciones
                                        </p>
                                        {isEditing ? (
                                            <FormField
                                                control={form.control}
                                                name="aclaraciones"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea {...field} rows={3} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <p className="text-base text-gray-900">
                                                {sucursal.aclaraciones || "Sin aclaraciones"}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Mapa de ubicación */}
                                <div className="space-y-4">
                                    <MapView direccion={sucursal.direccion} />
                                </div>

                                {/* Botones de acción */}
                                {isEditing && (
                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            disabled={
                                                form.formState.isSubmitting || !form.formState.isDirty
                                            }
                                        >
                                            {form.formState.isSubmitting
                                                ? "Guardando..."
                                                : "Guardar cambios"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={cancelarEdicion}
                                            disabled={form.formState.isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Imagen de la sucursal */}
                            <div className="lg:col-span-1">
                                <div className="aspect-square w-48 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src="/placeholder-event.jpg"
                                        alt={sucursal.nombre}
                                        width={192}
                                        height={192}
                                        className="w-48 h-48 object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
