
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface Step {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface PathTrackerProps {
  title: string;
  steps: Step[];
  className?: string;
}

export const PathTracker: React.FC<PathTrackerProps> = ({
  title,
  steps,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-start py-3 pl-2 rounded-lg transition-colors",
                step.current && "bg-cyber-primary/5"
              )}
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-cyber-primary" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5", 
                    step.current ? "text-cyber-primary" : "text-muted-foreground/40"
                  )} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  step.completed && "text-muted-foreground/70 line-through",
                  step.current && "text-cyber-primary"
                )}>
                  {step.title}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="h-6 flex items-center ml-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PathTracker;
