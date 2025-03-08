import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Breadcrumb } from "../components/Breadcrumb";
import { CourseCard } from "../components/CourseCard";
import { ChevronLeft, Lock, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { cn } from "../lib/utils";
import { learningPath, coursesData } from "@/data/courses";

// Helper function to create URL-friendly slugs
const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Mock user progress - this should come from your user state/context
const userProgress = {
  currentPhase: "level-1", // This would normally be fetched from user data
  isNewUser: true,
  phaseProgress: {
    "level-1": 0,
    "level-2": 0,
    "level-3": 0,
    "final": 0
  },
  courseProgress: {
    "1-1": 0,
    "1-2": 0,
    "1-3": 0,
    "2-1": 0,
    "2-2": 0,
    "2-3": 0,
    "3-1": 0,
    "3-2": 0,
    "3-3": 0,
    "final-1": 0
  }
};

export const Courses = () => {
  const { expanded } = useSidebar();
  const { phaseId } = useParams();

  // If no phaseId is provided, show the first phase
  const currentPhase = phaseId 
    ? learningPath.find(phase => phase.id === phaseId)
    : learningPath[0]; // Default to first phase

  const currentPhaseIndex = phaseId
    ? learningPath.findIndex(phase => phase.id === phaseId)
    : 0;

  // Check if previous level is completed
  const isPreviousLevelCompleted = (currentIndex: number) => {
    if (currentIndex === 0) return true; // First level is always unlocked
    const previousPhase = learningPath[currentIndex - 1];
    return previousPhase?.progress === 100;
  };

  // Generate breadcrumb items for all levels
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/student/dashboard" },
    { label: "الدورات", href: "/student/courses" },
    ...learningPath.map((phase, index) => {
      const isLocked = !isPreviousLevelCompleted(index);
      return {
        label: phase.phase,
        href: `/student/courses/${phase.id}`, // Allow navigation to all levels
        locked: isLocked,
        current: phase.id === currentPhase?.id
      };
    })
  ];

  // Get all courses for the current phase
  const currentPhaseCourses = coursesData.filter(course => 
    currentPhase?.courses.includes(course.id)
  );

  // Calculate phase progress based on course progress
  const phaseProgress = currentPhaseCourses.length > 0
    ? Math.round(currentPhaseCourses.reduce((acc, course) => acc + course.progress, 0) / currentPhaseCourses.length)
    : 0;

  // Get next phase if exists
  const nextPhase = learningPath[currentPhaseIndex + 1];
  const isNextPhaseLocked = nextPhase && !isPreviousLevelCompleted(currentPhaseIndex + 1);

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>{currentPhase?.phase || "الدورات"} | أكاديمية الأمن السيبراني</title>
            </Helmet>

            {/* Phase-based Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 && (
                      <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <Link
                      to={item.href}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1",
                        item.current
                          ? "bg-[#00C896] text-white"
                          : item.locked
                          ? "text-muted-foreground hover:bg-muted/50"
                          : "hover:bg-muted"
                      )}
                    >
                      {item.label}
                      {item.locked && <Lock className="h-3 w-3" />}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Level Progress Section */}
            <div className="mb-8">
              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{currentPhase?.phase}</h2>
                    <p className="text-sm text-muted-foreground">{currentPhase?.description}</p>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-teal-500 mb-1">{phaseProgress}%</div>
                    <div className="text-sm text-muted-foreground">تقدم المستوى</div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">المدة المتوقعة: {currentPhase?.months} أشهر</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{currentPhase?.courses.length} دورات</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  ماذا ستتعلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPhase?.learningOutcomes?.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Phase Button */}
            {nextPhase && (
              <Button 
                variant="outline" 
                className="gap-2 hover:bg-[#00C896] hover:text-white transition-colors mb-8" 
                asChild
              >
                <Link to={`/student/courses/${nextPhase.id}`}>
                  المرحلة التالية
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </Button>
            )}

            {/* Current Phase Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPhaseCourses.map((course) => (
                <div key={course.id} className="h-full">
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    image={course.image}
                    progress={!isPreviousLevelCompleted(currentPhaseIndex) ? 0 : course.progress}
                    level={course.level}
                    duration={course.duration}
                    locked={!isPreviousLevelCompleted(currentPhaseIndex)}
                    phaseId={currentPhase.id}
                    slug={course.slug}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
