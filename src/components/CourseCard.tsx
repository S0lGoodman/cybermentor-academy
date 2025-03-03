import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock, Clock, Award, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  progress?: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  locked?: boolean;
  certified?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  image,
  progress = 0,
  level,
  duration,
  locked = false,
  certified = false,
}) => {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    Intermediate: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    Advanced: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  };

  return (
    <Link to={locked ? "#" : `/courses/${id}`}>
      <Card className={cn(
        "overflow-hidden hover:scale-[1.02] transition-all duration-300 h-full flex flex-col bg-card border-border",
        locked ? "opacity-75 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      )}>
        <div className="relative h-36 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          
          {locked && (
            <div className="absolute inset-0 bg-background/50 dark:bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Lock className="w-10 h-10 text-foreground" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="secondary" className={cn("font-medium", levelColors[level])}>
              {level}
            </Badge>
            
            {certified && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 font-medium">
                <Award className="w-3 h-3 mr-1" /> Certified
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{description}</p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <Clock className="w-4 h-4" /> 
            <span>{duration}</span>
          </div>
          
          {!locked && progress > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-muted dark:bg-muted/20 flex justify-between items-center border-t border-border">
          <span className="text-xs font-medium text-muted-foreground">
            {locked ? "استكمل المتطلبات الأساسية لفتح الدورة" : "انقر هنا لعرض الدورة"}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
