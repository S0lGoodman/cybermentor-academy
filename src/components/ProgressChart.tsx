import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from './Sidebar';

interface ProgressChartProps {
  data: Array<{
    name: string;
    completed: string;
    total: string;
  }>;
  title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, title }) => {
  const { isAdmin } = useSidebar();
  const maxValue = Math.max(...data.map(item => parseInt(item.total)));
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end gap-6 mb-8 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-6 text-right">
                  {Math.round((maxValue / 4) * (4 - i))}
                </span>
                <div className="w-1 h-px bg-border" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="flex-1 flex justify-around items-end h-full pt-2 pr-2">
            {data.map((item, i) => {
              const completed = parseInt(item.completed);
              const total = parseInt(item.total);
              const completedHeight = Math.max((completed / maxValue) * 180, 20);
              const totalHeight = Math.max((total / maxValue) * 180, 20);
              
              return (
                <div key={i} className="group flex flex-col items-center gap-2">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full mb-2 bg-background border rounded-lg px-3 py-2 text-sm whitespace-nowrap z-10">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {isAdmin ? "Completed" : "المكتمل"}: {item.completed}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {isAdmin ? "Total" : "الإجمالي"}: {item.total}
                    </p>
                  </div>

                  {/* Bars */}
                  <div className="flex gap-1 h-full items-end">
                    <div 
                      className="w-6 bg-gradient-to-t from-[#00C896] to-[#00B4D8] rounded-t transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${completedHeight}px` }}
                    />
                    <div 
                      className="w-6 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t transition-all duration-300 group-hover:opacity-80"
                      style={{ height: `${totalHeight}px` }}
                    />
                  </div>
                  
                  {/* Label */}
                  <span className="text-sm font-medium mt-2 text-center">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6">
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
