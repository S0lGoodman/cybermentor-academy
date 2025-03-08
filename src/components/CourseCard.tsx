import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Lock, Clock, ArrowLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  progress?: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  locked?: boolean;
  phaseId?: string;
  slug?: string;
}

const levelLabels = {
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
};

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  image,
  progress = 0,
  level,
  duration,
  locked = false,
  phaseId,
  slug,
}) => {
  const courseUrl = `/student/courses/${phaseId}/${slug || id}`;

  return (
    <Link to={locked ? "#" : courseUrl} className="block h-full">
      <Card className={cn(
        "overflow-hidden hover:scale-[1.02] transition-all duration-300 h-full flex flex-col bg-card border-border",
        locked ? "opacity-75 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"
      )}>
        <div className="relative aspect-video overflow-hidden">
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

          {/* Progress Overlay - Only shown for unlocked courses */}
          {!locked && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-[2px] p-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{progress}% مكتمل</span>
                <span className="text-muted-foreground">التقدم</span>
              </div>
              <div className="relative w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="flex-1 p-4">
          <h3 className="text-lg font-semibold line-clamp-1 text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{description}</p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" /> 
            <span>{duration}</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center gap-2 text-muted-foreground bg-muted/5 border-t p-4">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {locked ? "استكمل المتطلبات الأساسية لفتح الدورة" : "انقر هنا لعرض الدورة"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
