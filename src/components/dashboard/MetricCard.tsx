"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  alert?: {
    type: "warning" | "error" | "success";
    message: string;
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  progress,
  alert,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>

        {trend && trend.value !== 0 && (
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600",
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          </div>
        )}

        {progress && (
          <div className="space-y-1">
            <Progress value={progress.value} max={progress.max} />
          </div>
        )}

        {alert && (
          <Badge
            variant={
              alert.type === "warning"
                ? "outline"
                : alert.type === "error"
                  ? "destructive"
                  : "secondary"
            }
            className="w-full justify-center"
          >
            {alert.message}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
