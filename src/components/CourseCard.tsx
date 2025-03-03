
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
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-blue-100 text-blue-800",
    Advanced: "bg-purple-100 text-purple-800",
  };

  return (
    <Link to={locked ? "#" : `/courses/${id}`}>
      <Card className={cn(
        "overflow-hidden hover-scale transition-all duration-300 h-full flex flex-col",
        locked ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
      )}>
        <div className="relative h-36 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          
          {locked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant="secondary" className={cn("font-medium", levelColors[level])}>
              {level}
            </Badge>
            
            {certified && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-medium">
                <Award className="w-3 h-3 mr-1" /> Certified
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{description}</p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <Clock className="w-4 h-4" /> 
            <span>{duration}</span>
          </div>
          
          {!locked && progress > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center border-t">
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
