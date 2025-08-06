// Sistema de logging minimalista para el middleware

interface LogContext {
  userId?: string;
  userRole?: string;
  pathname?: string;
  reason?: string;
  [key: string]: string | undefined;
}

class MiddlewareLogger {
  private isEnabled(): boolean {
    // Solo activo en desarrollo o si se especifica explícitamente
    return (
      process.env.NODE_ENV === "development" ||
      process.env.MIDDLEWARE_LOGGING === "true"
    );
  }

  private formatMessage(
    event: string,
    message: string,
    context?: LogContext,
  ): string {
    const timestamp = new Date().toISOString();
    const baseMessage = `[Middleware]: ${timestamp} ${event} - ${message}`;

    if (context && Object.keys(context).length > 0) {
      const contextString = Object.entries(context)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join(" ");

      return `${baseMessage} | ${contextString}`;
    }

    return baseMessage;
  }

  // Solo tres niveles: info para eventos importantes, warn para fallos, error para errores críticos
  info(event: string, message: string, context?: LogContext): void {
    if (!this.isEnabled()) return;
    console.log(this.formatMessage(event, message, context));
  }

  warn(event: string, message: string, context?: LogContext): void {
    if (!this.isEnabled()) return;
    console.warn(this.formatMessage(event, message, context));
  }

  error(event: string, message: string, context?: LogContext): void {
    // Los errores siempre se loggean
    console.error(this.formatMessage(event, message, context));
  }

  // Métodos de conveniencia para eventos clave
  authSuccess(userId: string, userRole: string, pathname: string): void {
    this.info("AUTH_SUCCESS", "Usuario autenticado", {
      userId,
      userRole,
      pathname,
    });
  }

  authFailure(pathname: string, reason: string): void {
    this.warn("AUTH_FAILURE", "Falló autenticación", { pathname, reason });
  }

  permissionDenied(userId: string, userRole: string, pathname: string): void {
    this.warn("PERMISSION_DENIED", "Acceso denegado", {
      userId,
      userRole,
      pathname,
    });
  }

  redirect(from: string, to: string, reason: string): void {
    this.info("REDIRECT", "Redirección", { from, to, reason });
  }

  cookieError(pathname: string, error: string): void {
    this.error("COOKIE_ERROR", "Error de cookie", { pathname, error });
  }
}

// Exportar instancia singleton
export const middlewareLogger = new MiddlewareLogger();
