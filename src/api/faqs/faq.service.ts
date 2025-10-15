"use server";

import { errorLogger } from "@/lib/utils";
import { FaqResponseType } from "./faq.types";
import { fetchApi } from "@/lib/utils.server";

export const getFaqs = async (): Promise<FaqResponseType> => {
  try {
    const response = await fetchApi<FaqResponseType>("/faqs", {
      method: "GET",
      cache: "no-store",
    });

    // Filtrar solo las FAQs que tienen recipient.name = "BODEGAS"
    const filteredItems = response.items.filter(
      (item) => item.recipient.name === "BODEGAS",
    );

    // Crear la respuesta filtrada manteniendo la estructura original
    const filteredResponse: FaqResponseType = {
      ...response,
      items: filteredItems,
      meta: {
        ...response.meta,
        totalItems: filteredItems.length,
        totalPages: Math.ceil(
          filteredItems.length / response.meta.itemsPerPage,
        ),
      },
    };

    return filteredResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error al obtener las preguntas frecuentes";
    errorLogger(error, "[FAQ]: getFaqs");
    throw new Error(errorMessage);
  }
};
