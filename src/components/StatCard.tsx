import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden bg-card border-border hover:shadow-md transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold mb-1 text-foreground">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary dark:text-primary/90">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
