import { getFaqs } from "@/api/faqs/faq.service";
import { FaqList } from "@/components/faq/FaqList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vinza - Preguntas Frecuentes",
  description: "Preguntas frecuentes para administradores de bodegas",
};

export default async function FaqsPage() {
  const faqResponse = await getFaqs();

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h1>
        <p className="text-muted-foreground">
          Encuentra respuestas a las preguntas más comunes sobre el uso de la
          plataforma.
        </p>
      </header>

      <main>
        <FaqList faqs={faqResponse.items} />
      </main>
    </>
  );
}
