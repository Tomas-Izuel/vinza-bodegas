import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  readonly = true,
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const iconSize = sizeClasses[size];
  const roundedValue = Math.round(value * 2) / 2; // Redondea a medias estrellas

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= roundedValue;
        const isHalfFilled = starValue - 0.5 === roundedValue;

        return (
          <div key={index} className="relative">
            <Star
              className={cn(
                iconSize,
                "stroke-amber-400",
                isFilled || isHalfFilled
                  ? "fill-amber-400"
                  : "fill-transparent",
              )}
            />
            {isHalfFilled && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  className={cn(iconSize, "fill-amber-400 stroke-amber-400")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
