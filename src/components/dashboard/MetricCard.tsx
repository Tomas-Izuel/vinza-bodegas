"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
} from "lucide-react";
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
  onDownload?: () => void;
  onAlert?: () => void;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  progress,
  alert,
  className,
  onDownload,
  onAlert,
}: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex items-center gap-1">
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onDownload}
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
            {onAlert && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onAlert}
              >
                <AlertTriangle className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>

        {trend && (
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
            <span className="text-sm text-muted-foreground">
              vs {trend.period}
            </span>
          </div>
        )}

        {progress && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{progress.label}</span>
              <span className="font-medium">
                {progress.value}/{progress.max}
              </span>
            </div>
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
