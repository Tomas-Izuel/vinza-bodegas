import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorLogger = (error: unknown, method?: string) => {
  const timestamp = new Date().toISOString();
  const methodInfo = method ? `[${method}]` : "[Unknown Method]";

  console.error(`ERROR ${methodInfo} - ${timestamp}`);
  console.error("Error details:", error);

  if (error instanceof Error) {
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
  }

  console.error("---");
};
