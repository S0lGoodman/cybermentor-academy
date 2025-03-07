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
      "transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-[#00C896]">
              {value}
            </h3>
            <p className={cn(
              "text-sm mt-2",
              isPositive ? "text-[#00C896]" : "text-red-500"
            )}>
              <span>{trend.value}</span>
              <span className="text-muted-foreground ml-1">{trend.label}</span>
            </p>
            <p className="text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/70">{description}</p>
          </div>
          <div className="p-3 rounded-full bg-[#00C896]/10 transition-transform duration-300 group-hover:scale-110">
            <div className="transition-all duration-300 group-hover:rotate-12 text-[#00C896]">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
