"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertItem {
  id: string;
  type: "error" | "warning" | "success" | "info";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  isRead: boolean;
  priority: "high" | "medium" | "low";
}

interface AlertsPanelProps {
  alerts?: AlertItem[];
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onConfigureAlerts?: () => void;
}

const mockAlerts: AlertItem[] = [
  {
    id: "1",
    type: "error",
    title: "Sistema de Pagos Inactivo",
    description:
      "El procesador de pagos principal no responde. Se recomienda revisar inmediatamente.",
    timestamp: "Hace 5 minutos",
    source: "Pagos",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Capacidad de Bodega al 85%",
    description:
      "La bodega central está cerca de su capacidad máxima. Considerar redistribución.",
    timestamp: "Hace 15 minutos",
    source: "Inventario",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "success",
    title: "Evento Completado Exitosamente",
    description: "El evento 'Cata Premium' se completó con 95% de asistencia.",
    timestamp: "Hace 1 hora",
    source: "Eventos",
    isRead: true,
    priority: "low",
  },
  {
    id: "4",
    type: "warning",
    title: "Personal Requiere Capacitación",
    description:
      "3 empleados del área de turismo necesitan capacitación en protocolos.",
    timestamp: "Hace 2 horas",
    source: "Personal",
    isRead: false,
    priority: "medium",
  },
  {
    id: "5",
    type: "info",
    title: "Backup Completado",
    description: "Respaldo automático de datos completado correctamente.",
    timestamp: "Hace 3 horas",
    source: "Sistema",
    isRead: true,
    priority: "low",
  },
];

export function AlertsPanel({
  alerts = mockAlerts,
  onMarkAsRead,
  onDismiss,
  onConfigureAlerts,
}: AlertsPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "high">("all");

  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "info":
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertVariant = (type: AlertItem["type"]) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      case "success":
        return "success";
      case "info":
        return "default";
    }
  };

  const getPriorityBadge = (priority: AlertItem["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Alta</Badge>;
      case "medium":
        return <Badge variant="outline">Media</Badge>;
      case "low":
        return <Badge variant="secondary">Baja</Badge>;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "unread") return !alert.isRead;
    if (filter === "high") return alert.priority === "high";
    return true;
  });

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Alertas y Notificaciones
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>

        <CardAction>
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              No leídas
            </Button>
            <Button
              variant={filter === "high" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("high")}
            >
              Prioridad Alta
            </Button>
            <Button variant="ghost" size="icon" onClick={onConfigureAlerts}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay alertas para mostrar</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <Alert
              key={alert.id}
              variant={getAlertVariant(alert.type)}
              className={cn(
                "transition-all duration-200",
                !alert.isRead && "border-l-4 border-l-primary bg-primary/5",
              )}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start gap-3 flex-1">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTitle className="text-sm font-medium">
                        {alert.title}
                      </AlertTitle>
                      {getPriorityBadge(alert.priority)}
                    </div>
                    <AlertDescription className="text-xs">
                      {alert.description}
                    </AlertDescription>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.source}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!alert.isRead && onMarkAsRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onMarkAsRead(alert.id)}
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onDismiss(alert.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
}
