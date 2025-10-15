import { FaqItemType } from "@/api/faqs/faq.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FaqListProps {
  faqs: FaqItemType[];
}

export function FaqList({ faqs }: FaqListProps) {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No hay preguntas frecuentes disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {faqs.map((faq) => (
        <Card key={faq.id} className="w-full">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-left pr-4">
                {faq.question}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0">
                {faq.recipient.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Última actualización:{" "}
                {new Date(faq.updated_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
