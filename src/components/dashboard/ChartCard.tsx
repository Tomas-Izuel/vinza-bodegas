"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Download, Filter, RefreshCw } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number | boolean;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  type: "bar" | "line" | "pie" | "area";
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  onDownload?: () => void;
  onFilter?: () => void;
  onRefresh?: () => void;
}

const DEFAULT_COLORS = [
  "hsl(var(--primary))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff88",
];

export function ChartCard({
  title,
  subtitle,
  data,
  type,
  dataKey = "value",
  xAxisKey = "name",
  colors = DEFAULT_COLORS,
  height = 300,
  badge,
  onDownload,
  onFilter,
  onRefresh,
}: ChartCardProps) {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12 }}
              axisLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              label={(entry: any) =>
                `${entry.name} ${(entry.percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return <div>Tipo de gráfico no soportado</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <Badge variant={badge.variant || "secondary"}>{badge.text}</Badge>
            )}
          </div>
        </div>

        <CardAction>
          <div className="flex gap-1">
            {onFilter && (
              <Button variant="ghost" size="icon" onClick={onFilter}>
                <Filter className="h-4 w-4" />
              </Button>
            )}
            {onRefresh && (
              <Button variant="ghost" size="icon" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
