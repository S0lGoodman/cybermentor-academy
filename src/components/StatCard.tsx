import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend: {
    value: string;
    label: string;
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
  const isPositive = trend.value.startsWith('+');

  return (
    <Card className={cn(
      "overflow-hidden bg-card border-border group hover:shadow-lg hover:scale-[1.02] hover:bg-gradient-to-br hover:from-background hover:to-muted transition-all duration-300",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground group-hover:text-foreground/80 transition-colors">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:scale-105 transition-transform">
              {value}
            </h3>
            <p className={cn(
              "text-sm mt-2",
              isPositive ? "text-teal-500" : "text-red-500"
            )}>
              <span>{trend.value}</span>
              <span className="text-muted-foreground ml-1">{trend.label}</span>
            </p>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">{description}</p>
          </div>
          <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
