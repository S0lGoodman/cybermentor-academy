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
  const scale = 80 / maxValue; // 80 is our max height in the chart

  return (
    <Card>
      <CardHeader className="pb-2">
        {title && <CardTitle className="text-lg font-medium">{title}</CardTitle>}
      </CardHeader>
      <CardContent>
        <div className="relative h-[240px]">
          <div className="absolute inset-0 flex items-end justify-around gap-6">
            {data.map((item, i) => {
              const completedHeight = parseInt(item.completed) * scale;
              const totalHeight = parseInt(item.total) * scale;
              
              return (
                <div key={i} className="relative flex-1">
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1">
                    <div 
                      className="w-8 bg-teal-500/20 rounded-t-lg"
                      style={{ height: `${completedHeight}%` }}
                    />
                    <div 
                      className="w-8 bg-slate-500/20 rounded-t-lg"
                      style={{ height: `${totalHeight}%` }}
                    />
                  </div>
                  <div className="absolute -bottom-6 inset-x-0 text-center">
                    <p className="text-sm font-medium">{item.name}</p>
                  </div>
                  <div 
                    className="absolute -top-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm border rounded-lg px-2 py-1 text-xs"
                    style={{ 
                      opacity: 0,
                      transition: '0.2s',
                      pointerEvents: 'none'
                    }}
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground">
                      {isAdmin ? "Completed" : "المكتمل"}: {item.completed}
                    </p>
                    <p className="text-muted-foreground">
                      {isAdmin ? "Total" : "الإجمالي"}: {item.total}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="absolute left-0 inset-y-6 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-6 text-right">
                  {Math.round((maxValue / 4) * (4 - i))}
                </span>
                <div className="w-1 h-px bg-border" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-teal-500/20" />
            <span className="text-sm text-muted-foreground">
              {isAdmin ? "Completed" : "المكتمل"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-slate-500/20" />
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
