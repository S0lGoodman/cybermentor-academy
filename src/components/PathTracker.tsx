import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";

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
    <Card className={cn(
      "overflow-hidden bg-card border-border hover:shadow-lg hover:bg-gradient-to-br hover:from-background hover:to-muted transition-all duration-300",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-start py-3 pr-2 rounded-lg transition-all duration-300",
                "hover:bg-muted/50 hover:pr-4",
                step.current && "bg-gradient-to-r from-teal-500/10 to-lime-500/10 hover:from-teal-500/20 hover:to-lime-500/20"
              )}
            >
              <div className="flex-shrink-0 ml-3 mt-0.5">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 transition-transform hover:scale-110" />
                ) : (
                  <Circle className={cn(
                    "h-5 w-5 mr-3 transition-all duration-300",
                    step.current ? "text-teal-500 hover:scale-110" : "text-muted-foreground hover:text-foreground/70"
                  )} />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "flex-1 transition-all duration-300",
                  step.completed && "line-through text-muted-foreground hover:text-foreground/50",
                  step.current && "text-teal-500 font-medium hover:text-teal-400"
                )}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="h-6 flex items-center mr-2">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground/30 transition-opacity group-hover:opacity-50" />
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
