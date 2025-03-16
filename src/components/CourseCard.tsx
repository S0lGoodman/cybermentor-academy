import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lock, Video, FileText, FlaskConical, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ContentCounts {
  video: number;
  text: number;
  quiz: number;
  lab: number;
}

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  level: string;
  duration: string;
  locked?: boolean;
  phaseId: string;
  slug: string;
  contentCounts: ContentCounts;
  thumbnailUrl?: string;
}

const levelLabels = {
  Beginner: "مبتدئ",
  Intermediate: "متوسط",
  Advanced: "متقدم",
};

export const CourseCard = ({
  id,
  title,
  description,
  progress,
  level,
  duration,
  locked = false,
  phaseId,
  slug,
  contentCounts,
  thumbnailUrl
}: CourseCardProps) => {
  return (
    <Link 
      to={locked ? "#" : `/student/courses/${phaseId}/${slug}`}
      className={cn(
        "block h-full",
        locked ? "cursor-not-allowed" : ""
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        whileHover={!locked ? {
          y: -8,
          transition: { duration: 0.2, type: "tween" }
        } : {}}
      >
        <Card className={cn(
          "relative h-full overflow-hidden transition-all duration-300 ease-in-out",
          locked ? "opacity-75" : "hover:border-[#00C896] hover:shadow-lg hover:shadow-[#00C896]/10"
        )}>
          {/* Thumbnail */}
          <div className="relative w-full h-48 overflow-hidden bg-muted group">
            <motion.img 
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500"
              whileHover={!locked ? { scale: 1.05 } : {}}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/course-thumbnails/default.jpg';
              }}
            />
            {locked && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Lock className="w-8 h-8 text-white mx-auto mb-2" />
                  </motion.div>
                  <p className="text-white text-sm px-4">أكمل الدورة السابقة لفتح هذه الدورة</p>
                </div>
              </motion.div>
            )}
          </div>

          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs transition-colors duration-300 hover:bg-[#00C896] hover:text-white">
                {level}
              </Badge>
              <Badge variant="outline" className="text-xs transition-colors duration-300 hover:bg-[#00C896] hover:text-white">
                {duration}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold line-clamp-2 transition-colors duration-300 group-hover:text-[#00C896]">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                {contentCounts.video > 0 && (
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Video className="w-4 h-4 transition-colors duration-300 hover:text-[#00C896]" />
                    <span>{contentCounts.video}</span>
                  </motion.div>
                )}
                {contentCounts.text > 0 && (
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FileText className="w-4 h-4 transition-colors duration-300 hover:text-[#00C896]" />
                    <span>{contentCounts.text}</span>
                  </motion.div>
                )}
                {contentCounts.quiz > 0 && (
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <GraduationCap className="w-4 h-4 transition-colors duration-300 hover:text-[#00C896]" />
                    <span>{contentCounts.quiz}</span>
                  </motion.div>
                )}
                {contentCounts.lab > 0 && (
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FlaskConical className="w-4 h-4 transition-colors duration-300 hover:text-[#00C896]" />
                    <span>{contentCounts.lab}</span>
                  </motion.div>
                )}
              </div>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2 transition-all duration-300",
                !locked && "hover:h-3"
              )} 
            />
          </CardContent>

          <CardFooter>
            <div className="text-sm text-muted-foreground">
              {progress}% مكتمل
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default CourseCard;
