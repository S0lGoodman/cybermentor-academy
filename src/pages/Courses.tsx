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

  // Generate breadcrumb items for all levels
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/student/dashboard" },
    { label: "الدورات", href: "/student/courses" },
    ...learningPath.map((phase) => ({
      label: phase.phase,
      href: phase.locked ? undefined : `/student/courses/${phase.id}`,
      locked: phase.locked,
      current: phase.id === currentPhase?.id
    }))
  ];

  // Filter courses to show only current phase courses
  const currentPhaseCourses = coursesData.filter(course => 
    currentPhase?.courses.includes(course.id)
  );

  // Get next phase if exists
  const nextPhase = learningPath[currentPhaseIndex + 1];

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
                    {item.href && !item.locked ? (
                      <Link
                        to={item.href}
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors",
                          item.current
                            ? "bg-[#00C896] text-white"
                            : "hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm whitespace-nowrap",
                          item.locked
                            ? "text-muted-foreground cursor-not-allowed flex items-center gap-1"
                            : "text-foreground"
                        )}
                      >
                        {item.label}
                        {item.locked && <Lock className="h-3 w-3" />}
                      </span>
                    )}
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
                    <div className="text-2xl font-bold text-teal-500 mb-1">{currentPhase?.progress}%</div>
                    <div className="text-sm text-muted-foreground">تقدم المستوى</div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentPhase?.progress || 0}%` }}
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
                disabled={nextPhase.locked}
                asChild={!nextPhase.locked}
              >
                {!nextPhase.locked ? (
                  <Link to={`/student/courses/${nextPhase.id}`}>
                    المرحلة التالية
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    المرحلة التالية
                    <Lock className="w-4 h-4" />
                  </>
                )}
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
                    progress={userProgress.courseProgress?.[course.id] || 0}
                    level={course.level}
                    duration={course.duration}
                    locked={course.locked}
                    certified={course.certified}
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
