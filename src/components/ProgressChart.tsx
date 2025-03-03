import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";

interface ProgressChartProps {
  data: {
    name: string;
    completed: number;
    total: number;
  }[];
  title?: string;
  className?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-3 border border-border rounded-lg">
        <p className="font-medium text-sm text-foreground">{`${label}`}</p>
        <p className="text-sm text-sky-500">{`Completed: ${payload[0].value}`}</p>
        <p className="text-sm text-muted-foreground">{`Total: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title = "Learning Progress",
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartColors = {
    completed: {
      gradient: [
        { offset: "0%", color: "#0ea5e9" },  // sky-500
        { offset: "100%", color: "#22c55e" }, // green-500
      ]
    },
    total: isDark ? "#334155" : "#f1f5f9", // slate-700 for dark, slate-100 for light
    grid: isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(51, 65, 85, 0.1)", // slate-400/10 for dark, slate-700/10 for light
    text: isDark ? "#cbd5e1" : "#475569", // slate-300 for dark, slate-600 for light
  };

  return (
    <Card className={cn("overflow-hidden bg-card border-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              barGap={0}
              barSize={20}
            >
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="1" y2="0">
                  {chartColors.completed.gradient.map((stop) => (
                    <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                opacity={0.2}
                stroke={chartColors.grid} 
              />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: chartColors.text }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: chartColors.text }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={false}
              />
              <Legend 
                wrapperStyle={{ 
                  color: chartColors.text
                }} 
              />
              <Bar 
                dataKey="completed" 
                fill="url(#completedGradient)"
                name="Completed" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="total" 
                fill={chartColors.total}
                name="Total Modules" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
