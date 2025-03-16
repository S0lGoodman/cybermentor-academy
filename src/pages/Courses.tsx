import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Breadcrumb } from "../components/Breadcrumb";
import { CourseCard } from "../components/CourseCard";
import { ChevronLeft, Lock, BookOpen, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useSidebar, AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { cn } from "../lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const phases = [
  "المستوى الأول: المبادئ الأساسية",
  "المستوى الثاني: المواضيع المتوسطة",
  "المستوى الثالث: المواضيع المتقدمة",
  "الامتحان النهائي والشهادة"
] as const;

interface Course {
  id: string;
  name: string;
  description: string;
  phase: typeof phases[number];
  status: "draft" | "published";
  slug: string;
  order: number;
  thumbnail_url?: string;
}

interface ContentCounts {
  video: number;
  text: number;
  quiz: number;
  lab: number;
}

interface CourseWithProgress extends Course {
  progress: number;
  contentCounts: ContentCounts;
}

interface LevelDescription {
  phase: string;
  description: string;
  learning_objectives: string;
}

export const Courses = () => {
  const { expanded } = useSidebar();
  const { phaseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [allCourses, setAllCourses] = useState<CourseWithProgress[]>([]);
  const [levelDescription, setLevelDescription] = useState<LevelDescription | null>(null);

  // If no phaseId is provided, show the first phase
  const currentPhase = phaseId 
    ? phases.find(phase => phase === phaseId)
    : phases[0];

  const currentPhaseIndex = phaseId
    ? phases.indexOf(phaseId)
    : 0;

  useEffect(() => {
    fetchAllCourses();
    fetchLevelDescription();
  }, [currentPhase]);

  useEffect(() => {
    if (allCourses.length > 0) {
      const phaseCourses = allCourses.filter(course => course.phase === currentPhase);
      setCourses(phaseCourses);
    }
  }, [currentPhase, allCourses]);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);

      // Fetch all published courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('status', 'published')
        .order('order');

      if (coursesError) throw coursesError;

      // Fetch user progress for each course
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not found');

      const { data: progressData, error: progressError } = await supabase
        .from('user_course_progress')
        .select('course_id, progress')
        .eq('user_id', user.user.id);

      if (progressError) throw progressError;

      // Create a map of course progress
      const progressMap = progressData?.reduce((acc, curr) => {
        acc[curr.course_id] = curr.progress;
        return acc;
      }, {} as Record<string, number>) || {};

      // Fetch content counts for each course
      const coursesWithProgress = await Promise.all((coursesData || []).map(async (course) => {
        const { data: contents } = await supabase
          .from('contents')
          .select('type')
          .eq('course_id', course.id);

        const contentCounts = {
          video: contents?.filter(c => c.type === 'video').length || 0,
          text: contents?.filter(c => c.type === 'text').length || 0,
          quiz: contents?.filter(c => c.type === 'quiz').length || 0,
          lab: contents?.filter(c => c.type === 'lab').length || 0,
        };

        return {
          ...course,
          progress: progressMap[course.id] || 0,
          contentCounts
        };
      }));

      setAllCourses(coursesWithProgress || []);
      const phaseCourses = coursesWithProgress.filter(course => course.phase === currentPhase);
      setCourses(phaseCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLevelDescription = async () => {
    try {
      const { data, error } = await supabase
        .from('level_descriptions')
        .select('*')
        .eq('phase', currentPhase)
        .single();

      if (error) throw error;
      setLevelDescription(data);
    } catch (error) {
      console.error('Error fetching level description:', error);
      toast.error('Failed to fetch level description');
    }
  };

  // Check if a course is locked based on previous courses completion
  const isCourseUnlocked = (courseOrder: number, phase: string) => {
    // First course of first phase is always unlocked
    if (phase === phases[0] && courseOrder === 1) return true;

    const phaseCourses = allCourses.filter(c => c.phase === phase);
    const previousCourse = phaseCourses.find(c => c.order === courseOrder - 1);

    // If it's the first course of a phase, check if all courses in previous phase are completed
    if (!previousCourse) {
      const phaseIndex = phases.indexOf(phase);
      if (phaseIndex <= 0) return true;

      const previousPhaseCourses = allCourses.filter(
        c => c.phase === phases[phaseIndex - 1]
      );
      return previousPhaseCourses.every(c => c.progress === 100);
    }

    // Otherwise, check if previous course is completed
    return previousCourse.progress === 100;
  };

  // Generate breadcrumb items
  const breadcrumbItems = phases.map((phase) => ({
    label: phase,
    href: `/student/courses/${phase}`,
    current: phase === currentPhase
  }));

  // Get the next phase
  const nextPhase = currentPhaseIndex < phases.length - 1
    ? phases[currentPhaseIndex + 1]
    : null;

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        expanded ? "mr-64" : "mr-20"
      )}>
        <Navbar />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{currentPhase}</h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  ماذا ستتعلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                {levelDescription && (
                  <div className="flex flex-col gap-4">
                    <div className="text-muted-foreground mb-2">
                      {levelDescription.learning_objectives.split('\n')[0]}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {levelDescription.learning_objectives
                        .split('\n')
                        .slice(1)
                        .map((objective, index) => (
                          objective.trim() && (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#00C896] mt-1 shrink-0" />
                              <span className="text-muted-foreground">{objective.trim()}</span>
                            </div>
                          )
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Phase Button */}
            {nextPhase && (
              <Button 
                variant="outline" 
                className="gap-2 hover:bg-[#00C896] hover:text-white transition-all duration-300 ease-in-out mb-8 flex flex-row-reverse" 
                asChild
              >
                <Link to={`/student/courses/${nextPhase}`}>
                  المرحلة التالية
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </Button>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#00C896]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="h-full">
                    <CourseCard
                      id={course.id}
                      title={course.name}
                      description={course.description}
                      progress={course.progress}
                      level={course.phase}
                      duration={`${course.contentCounts.video + course.contentCounts.text + course.contentCounts.quiz + course.contentCounts.lab} دروس`}
                      locked={!isCourseUnlocked(course.order, course.phase)}
                      phaseId={currentPhase}
                      slug={course.slug}
                      contentCounts={course.contentCounts}
                      thumbnailUrl={course.thumbnail_url || `/thumbnails/${course.slug}.jpg`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
