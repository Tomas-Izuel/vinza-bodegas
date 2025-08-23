"use server";

import { fetchApiWithAuth } from "@/lib/utils.server";
import { CategoriaEvento } from "./categoria-evento.type";

export const getCategorias = async () => {
  try {
    const response =
      await fetchApiWithAuth<CategoriaEvento[]>("/categoria-eventos");
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener las categorías");
  }
};
