import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InlineErrorHandlerProps {
  error: unknown;
  className?: string;
  context?: string;
}

/**
 * Componente para mostrar errores inline en formularios o componentes específicos
 * Para errores de página completa, usar error.tsx de Next.js
 */
const InlineErrorHandler = ({
  error,
  className = "",
  context,
}: InlineErrorHandlerProps) => {
  const processedError =
    error instanceof Error
      ? error
      : new Error(`Error desconocido${context ? ` en ${context}` : ""}`);

  const errorCode = error instanceof Error ? error.name : "UNKNOWN_ERROR";

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-red-800">
            {context ? `Error en ${context}` : "Error en la operación"}
          </p>
          <p className="text-sm text-red-700">{processedError.message}</p>
          <Badge variant="destructive" className="text-xs">
            {errorCode}
          </Badge>
        </div>
      </div>
    </div>
  );
};

/**
 * Utilidad para mostrar errores inline rápidamente
 */
export const showInlineError = (
  error: unknown,
  context?: string,
  className?: string,
) => {
  return (
    <InlineErrorHandler error={error} context={context} className={className} />
  );
};

export default InlineErrorHandler;
