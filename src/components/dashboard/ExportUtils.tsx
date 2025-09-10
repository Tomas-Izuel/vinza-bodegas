"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Image,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportOption {
  type: "excel" | "csv" | "pdf" | "png";
  label: string;
  icon: React.ReactNode;
  description: string;
  disabled?: boolean;
}

interface ExportUtilsProps {
  data?: Record<string, unknown>[];
  filename?: string;
  onExport?: (type: string, data: Record<string, unknown>[]) => Promise<void>;
  className?: string;
}

const exportOptions: ExportOption[] = [
  {
    type: "excel",
    label: "Excel",
    icon: <FileSpreadsheet className="h-4 w-4" />,
    description: "Exportar como archivo Excel (.xlsx)",
  },
  {
    type: "csv",
    label: "CSV",
    icon: <FileText className="h-4 w-4" />,
    description: "Exportar como archivo CSV",
  },
  {
    type: "pdf",
    label: "PDF",
    icon: <FileText className="h-4 w-4" />,
    description: "Exportar como documento PDF",
  },
  {
    type: "png",
    label: "Imagen",
    icon: <Image className="h-4 w-4" aria-label="Exportar imagen" />,
    description: "Exportar gráfico como imagen PNG",
  },
];

export function ExportUtils({
  data = [],
  filename = "dashboard-export",
  onExport,
  className,
}: ExportUtilsProps) {
  const [exportingType, setExportingType] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = async (type: string) => {
    setExportingType(type);
    setExportSuccess(null);

    try {
      // Simular proceso de exportación
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (onExport) {
        await onExport(type, data);
      } else {
        // Mock export functionality
        mockExport(type, filename);
      }

      setExportSuccess(type);
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error("Error durante la exportación:", error);
    } finally {
      setExportingType(null);
    }
  };

  const mockExport = (type: string, filename: string) => {
    // Simular descarga de archivo
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const fullFilename = `${filename}-${timestamp}`;

    let content = "";
    let mimeType = "";
    let extension = "";

    switch (type) {
      case "excel":
        content = "Mock Excel content";
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        extension = "xlsx";
        break;
      case "csv":
        content = generateCSV(data);
        mimeType = "text/csv";
        extension = "csv";
        break;
      case "pdf":
        content = "Mock PDF content";
        mimeType = "application/pdf";
        extension = "pdf";
        break;
      case "png":
        content = "Mock PNG content";
        mimeType = "image/png";
        extension = "png";
        break;
    }

    // Crear y descargar archivo mock
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullFilename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data: Record<string, unknown>[]) => {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data
      .map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(","),
      )
      .join("\n");

    return `${headers}\n${rows}`;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {exportSuccess && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Archivo exportado exitosamente como {exportSuccess.toUpperCase()}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-2">
        {exportOptions.map((option) => (
          <Button
            key={option.type}
            variant="outline"
            className="h-auto p-3 flex flex-col items-start gap-2"
            onClick={() => handleExport(option.type)}
            disabled={option.disabled || exportingType !== null}
          >
            <div className="flex items-center gap-2 w-full">
              {exportingType === option.type ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                option.icon
              )}
              <span className="font-medium">{option.label}</span>
              {option.disabled && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Próximamente
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground text-left">
              {option.description}
            </span>
          </Button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          Los archivos se descargarán automáticamente al completar la
          exportación.
        </p>
        <p>Datos incluidos: {data.length} registros</p>
      </div>
    </div>
  );
}

// Hook para usar las utilidades de exportación
export function useExportUtils() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (
    type: string,
    data: Record<string, unknown>[],
    exportFilename = "export",
  ) => {
    setIsExporting(true);
    try {
      // Aquí iría la lógica real de exportación
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(
        `Exportando ${data.length} registros como ${type} con nombre ${exportFilename}`,
      );
    } finally {
      setIsExporting(false);
    }
  };

  const generateReport = async (
    title: string,
    metrics: Record<string, unknown>[],
    charts: Record<string, unknown>[],
    tables: Record<string, unknown>[],
  ) => {
    setIsExporting(true);
    try {
      // Generar reporte completo
      const reportData = {
        title,
        generatedAt: new Date().toISOString(),
        metrics,
        charts,
        tables,
      };

      console.log("Generando reporte:", reportData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportData,
    generateReport,
  };
}
