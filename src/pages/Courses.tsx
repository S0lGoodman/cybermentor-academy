import React from "react";
import { Helmet } from "react-helmet";
import { Link, Navigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import CourseCard from "@/components/CourseCard";
import { ChevronLeft, Lock, BookOpen, CheckCircle2 } from "lucide-react";
import { useSidebar } from "@/components/Sidebar";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

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

const learningPath = [
  {
    id: "level-1",
    slug: "fundamentals",
    phase: "المستوى الأول: المبادئ الأساسية",
    completed: false,
    current: true,
    level: 1,
    months: "1-2",
    courses: ["1-1", "1-2", "1-3"],
    description: "تعلم أساسيات الشبكات، نظام لينكس، والمفاهيم الأساسية للأمن المعلوماتي",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "فهم المفاهيم الأساسية للشبكات وبروتوكولات الاتصال",
      "التعرف على أساسيات نظام التشغيل Linux وأوامره الرئيسية",
      "تعلم مبادئ الأمن السيبراني والتهديدات الشائعة",
      "تطبيق المفاهيم النظرية في بيئة عملية آمنة",
      "إتقان استخدام الأدوات الأساسية في مجال الأمن السيبراني"
    ]
  },
  {
    id: "level-2",
    slug: "intermediate",
    phase: "المستوى الثاني: المواضيع المتوسطة",
    completed: false,
    current: false,
    level: 2,
    months: "3-4",
    courses: ["2-1", "2-2", "2-3"],
    description: "اختبار تطبيقات الويب، تحليل الثغرات الأمنية، واستغلال الأخطاء الشائعة في الإعدادات",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "تحليل وتقييم أمان تطبيقات الويب",
      "اكتشاف وتوثيق الثغرات الأمنية",
      "فهم واستغلال الأخطاء الشائعة في الإعدادات",
      "استخدام أدوات اختبار الاختراق المتقدمة",
      "تطوير استراتيجيات الحماية والتخفيف من المخاطر"
    ]
  },
  {
    id: "level-3",
    slug: "advanced",
    phase: "المستوى الثالث: المواضيع المتقدمة",
    completed: false,
    current: false,
    level: 3,
    months: "5-6",
    courses: ["3-1", "3-2", "3-3"],
    description: "تصعيد الصلاحيات، استغلال الشبكات، واختراق Active Directory",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "إتقان تقنيات تصعيد الصلاحيات في الأنظمة المختلفة",
      "تحليل وتنفيذ هجمات متقدمة على الشبكات",
      "فهم وتطبيق تقنيات اختراق Active Directory",
      "تطوير حلول أمنية متقدمة للمؤسسات",
      "تنفيذ عمليات اختبار اختراق شاملة"
    ]
  },
  {
    id: "final",
    slug: "certification",
    phase: "الامتحان النهائي والشهادة",
    completed: false,
    current: false,
    level: 4,
    months: "نهاية البرنامج",
    courses: ["final-1"],
    description: "اختبار شامل لجميع المهارات المكتسبة للحصول على شهادة CyberMentor",
    locked: false,
    progress: 0,
    learningOutcomes: [
      "تطبيق جميع المهارات المكتسبة في مشروع عملي",
      "إجراء اختبار اختراق شامل في بيئة واقعية",
      "توثيق وتقديم تقارير احترافية",
      "الحصول على شهادة CyberMentor المعتمدة",
      "إثبات الكفاءة في جميع جوانب الأمن السيبراني"
    ]
  }
];

const coursesData = [
  // Level 1: Fundamentals
  {
    id: "1-1",
    slug: "network-basics",
    title: "أساسيات الشبكات",
    description: "تعلم المفاهيم الأساسية للشبكات وبروتوكولات الاتصال",
    duration: "3 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 245,
    progress: 0,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1"
  },
  {
    id: "1-2",
    slug: "linux-essentials",
    title: "نظام لينكس",
    description: "تعلم أساسيات نظام التشغيل Linux وأوامره الأساسية",
    duration: "4 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 230,
    progress: 0,
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1"
  },
  {
    id: "1-3",
    slug: "cybersecurity-intro",
    title: "مقدمة في الأمن السيبراني",
    description: "فهم المفاهيم الأساسية للأمن السيبراني والتهديدات الشائعة",
    duration: "3 أسابيع",
    level: "Beginner" as const,
    enrolledStudents: 210,
    progress: 0,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300",
    certified: true,
    phaseId: "level-1"
  },
  // Level 2: Intermediate
  {
    id: "2-1",
    slug: "web-application-security-testing",
    title: "اختبار تطبيقات الويب",
    description: "تعلم منهجيات وأدوات اختبار أمان تطبيقات الويب",
    duration: "4 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 189,
    progress: 0,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-2"
  },
  {
    id: "2-2",
    slug: "vulnerability-analysis",
    title: "تحليل الثغرات الأمنية",
    description: "تعلم كيفية تحديد وتحليل الثغرات الأمنية في الأنظمة",
    duration: "4 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 175,
    progress: 0,
    image: "https://images.unsplash.com/photo-1526374870839-e155464bb9b2?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-2"
  },
  {
    id: "2-3",
    slug: "common-configuration-errors",
    title: "الأخطاء الشائعة في الإعدادات",
    description: "اكتشاف واستغلال الأخطاء الشائعة في إعدادات الأنظمة",
    duration: "4 أسابيع",
    level: "Intermediate" as const,
    enrolledStudents: 168,
    progress: 0,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-2"
  },
  // Level 3: Advanced
  {
    id: "3-1",
    slug: "privilege-escalation",
    title: "تصعيد الصلاحيات",
    description: "تعلم تقنيات تصعيد الصلاحيات في الأنظمة المختلفة",
    duration: "4 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 145,
    progress: 0,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-3"
  },
  {
    id: "3-2",
    slug: "lateral-movement",
    title: "استغلال الشبكات",
    description: "تعلم تقنيات استغلال ثغرات الشبكات وحمايتها",
    duration: "4 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 132,
    progress: 0,
    image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-3"
  },
  {
    id: "3-3",
    slug: "active-directory-exploitation",
    title: "اختراق Active Directory",
    description: "تعلم تقنيات اختراق وتأمين Active Directory",
    duration: "4 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 128,
    progress: 0,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true,
    phaseId: "level-3"
  },
  // Final Exam
  {
    id: "final-1",
    title: "الامتحان النهائي والمشروع",
    description: "اختبار شامل وتطبيق عملي للحصول على شهادة CyberMentor",
    duration: "2 أسابيع",
    level: "Advanced" as const,
    enrolledStudents: 95,
    progress: 0,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=300&h=300",
    locked: true,
    certified: true
  }
];

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

const Courses = () => {
  const { expanded } = useSidebar();
  const { phaseId } = useParams();

  // If no phaseId is provided, redirect to level-1
  if (!phaseId) {
    return <Navigate to="/courses/level-1" replace />;
  }

  // Find the current phase based on URL parameter
  const currentPhase = learningPath.find(phase => phase.id === phaseId);
  const currentPhaseIndex = learningPath.findIndex(phase => phase.id === phaseId);

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/dashboard" },
    ...learningPath.slice(0, currentPhaseIndex + 2).map((phase, index) => ({
      label: phase.phase,
      href: phase.locked ? undefined : `/courses/${phase.id}`,
      locked: phase.locked
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
              <Breadcrumb items={breadcrumbItems} />
              
              <div className="mt-6">
                <h1 className="text-2xl font-bold mb-2">{currentPhase?.phase}</h1>
                <p className="text-muted-foreground mb-6">{currentPhase?.description}</p>

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

                {nextPhase && (
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-[#00C896] hover:text-white transition-colors" 
                    disabled={nextPhase.locked}
                    asChild={!nextPhase.locked}
                  >
                    {!nextPhase.locked ? (
                      <Link to={`/courses/${nextPhase.id}`}>
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
              </div>
            </div>

            {/* Current Phase Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {currentPhaseCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  image={course.image}
                  progress={userProgress.courseProgress?.[course.id] || 0}
                  level={course.level}
                  duration={course.duration}
                  locked={course.locked}
                  certified={course.certified}
                  phaseId={phaseId}
                  slug={course.slug}
                />
              ))}
            </div>

            {/* Next Phase Preview */}
            {nextPhase && !nextPhase.locked && (
              <Card className="bg-muted/30 border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">المرحلة القادمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{nextPhase.phase}</h3>
                  <p className="text-muted-foreground mb-4">{nextPhase.description}</p>
                  <Button variant="outline" asChild>
                    <Link to={`/courses/${nextPhase.id}`} className="gap-2 hover:bg-[#00C896] hover:text-white transition-colors">
                      استعراض المرحلة القادمة
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
