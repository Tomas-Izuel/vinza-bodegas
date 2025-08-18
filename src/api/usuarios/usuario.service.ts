"use server";

import { errorLogger } from "@/lib/utils";
import { fetchApiWithAuth } from "@/lib/utils.server";

export const getUsuarios = async () => {
  try {
    const response = await fetchApiWithAuth<unknown>(`/users`);
    console.log(response);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al obtener usuarios";
    errorLogger(error, "getUsuarios");
    throw new Error(errorMessage);
  }
};
