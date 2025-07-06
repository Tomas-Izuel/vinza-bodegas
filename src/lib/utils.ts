import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorLogger = (error: unknown, method?: string) => {
  const timestamp = new Date().toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const methodInfo = method ? `[${method}]` : "[Unknown Method]";

  console.log("--------------------------------");
  console.error(`ERROR ${methodInfo} - ${timestamp}`);
  console.error("Error details:", error);

  if (error instanceof Error) {
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
  }

  console.log("--------------------------------");
};
