import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from './Sidebar';
import { Separator } from "@/components/ui/separator";

interface ProgressChartProps {
  data: Array<{
    name: string;
    completed: string;
    total: string;
  }>;
  title?: string;
}

const CircularProgress: React.FC<{
  value: number;
  label: string;
  sublabel: string;
}> = ({ value, label, sublabel }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
            className="transition-all duration-500"
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#00C896" />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        </div>
      </div>
      <h3 className="mt-4 text-sm font-medium text-center">{label}</h3>
    </div>
  );
};

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  const { isAdmin } = useSidebar();

  // Calculate overall progress
  const totalModules = data.reduce((acc, item) => acc + parseInt(item.total), 0);
  const completedModules = data.reduce((acc, item) => acc + parseInt(item.completed), 0);
  const overallProgress = Math.round((completedModules / totalModules) * 100);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">التقدم الإجمالي في المسار</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {completedModules} من {totalModules} وحدة مكتملة
              </p>
            </div>
            <span className="text-sm font-bold text-[#00C896]">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00C896] to-[#00B4D8] transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-4">
          {data.map((item, index) => {
            const completed = parseInt(item.completed);
            const total = parseInt(item.total);
            const percentage = Math.round((completed / total) * 100);
            
            return (
              <CircularProgress
                key={index}
                value={percentage}
                label={item.name}
                sublabel={`${completed}/${total} وحدة`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#00C896] to-[#00B4D8]" />
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "Completed" : "المكتمل"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700" />
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "Total Units" : "إجمالي الوحدات"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
