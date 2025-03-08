import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CourseCard } from "../components/CourseCard";
import { ProgressChart } from "../components/ProgressChart";
import { StatCard } from "../components/StatCard";
import { SkillsRadar } from "../components/SkillsRadar";
import { Button } from "../components/ui/button";
import {
  BookOpen,
  Award,
  Clock,
  FileText,
  ChevronLeft,
  BarChart,
  BookCheck,
  Zap,
  Trophy,
  Medal,
} from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { cn } from "../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

interface LastLearningContent {
  courseId: string;
  courseTitle: string;
  courseImage: string;
  lastUnit: string;
  progress: number;
  phaseId: string;
  slug: string;
}

const progressData = [
  { name: "المستوى المبتدئ", completed: "8", total: "10" },
  { name: "المستوى المتوسط", completed: "5", total: "12" },
  { name: "المستوى المتقدم", completed: "2", total: "15" },
  { name: "المستوى الخبير", completed: "0", total: "8" }
];

const skillsData = [
  { name: "أمن الشبكات", value: 85, color: "#00C896" },
  { name: "أمن التطبيقات", value: 70, color: "#00C896" },
  { name: "التشفير", value: 60, color: "#00C896" },
  { name: "تحليل البرمجيات الخبيثة", value: 45, color: "#00C896" },
  { name: "الاختراق الأخلاقي", value: 75, color: "#00C896" },
  { name: "التحليل الجنائي", value: 55, color: "#00C896" }
];

const recommendedCourses = [
  {
    id: "1",
    title: "أمن تطبيقات الويب المتقدم",
    description: "تعلم كيفية حماية تطبيقات الويب من الهجمات الشائعة وتطبيق أفضل ممارسات الأمان.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&h=300",
    progress: 25,
    level: "Intermediate" as const,
    duration: "8 أسابيع"
  },
  {
    id: "2",
    title: "القرصنة الأخلاقية",
    description: "تعلم مهارات اختبار الاختراق واكتشاف نقاط الضعف في الأنظمة بشكل أخلاقي.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=300&h=300",
    progress: 0,
    level: "Advanced" as const,
    duration: "12 أسبوع",
    locked: true
  },
  {
    id: "3",
    title: "أساسيات الأمن السيبراني",
    description: "مقدمة شاملة لمفاهيم الأمن السيبراني والتهديدات الشائعة وأساليب الحماية.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&h=300",
    progress: 0,
    level: "Beginner" as const,
    duration: "6 أسابيع"
  }
];

const getBadgeStyle = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "epic":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "rare":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default:
      return "bg-muted/50 text-muted-foreground border-border/50";
  }
};

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 text-amber-500" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-400" />;
    case 3:
      return <Medal className="h-4 w-4 text-amber-700" />;
    default:
      return null;
  }
};

// Mock last learning content
const mockLastLearningContent = {
  courseId: "1-1",
  courseTitle: "أساسيات الشبكات",
  courseImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&h=300",
  lastUnit: "مقدمة عن الشبكات والبروتوكولات",
  progress: 85,
  phaseId: "level-1",
  slug: "network-basics"
};

export const Dashboard = () => {
  const { setExpanded, setIsAdmin, expanded } = useSidebar();
  const [lastLearningContent, setLastLearningContent] = useState<LastLearningContent | null>(null);
  
  useEffect(() => {
    setExpanded(false);
    setIsAdmin(false);
    
    // Setup animation observations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [setExpanded, setIsAdmin]);

  useEffect(() => {
    // Fetch last learning content from localStorage or use mock data
    const lastContent = localStorage.getItem('lastLearningContent');
    if (lastContent) {
      setLastLearningContent(JSON.parse(lastContent));
    } else {
      // Use mock data if no saved content exists
      setLastLearningContent(mockLastLearningContent);
      localStorage.setItem('lastLearningContent', JSON.stringify(mockLastLearningContent));
    }
  }, []);

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      
      <div className={cn(
        "flex-1",
        !expanded && "overflow-hidden" // Prevent content from showing behind collapsed sidebar
      )}>
        <Navbar title="" />
        
        <main className="p-6">
          <div className={cn(
            "max-w-7xl mx-auto",
            !expanded && "mr-16" // Add margin when sidebar is collapsed
          )}>
            {/* Welcome & Stats */}
            <div className="mb-8 animate-on-scroll">
              <h1 className="text-2xl font-bold mb-2">مرحباً بعودتك، جون!</h1>
              <p className="text-muted-foreground">تتبع تقدمك وواصل رحلة تعلمك.</p>
            </div>
            
            {/* Continue Learning Section */}
            <div className="mb-8 animate-on-scroll">
              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-foreground">متابعة التعلم</h2>
                {lastLearningContent ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={lastLearningContent.courseImage}
                        alt="Course thumbnail" 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 text-foreground">{lastLearningContent.courseTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-2">آخر نشاط: {lastLearningContent.lastUnit}</p>
                      <div className="h-2 bg-muted rounded-full mb-2 relative overflow-hidden">
                        <div 
                          className="absolute top-0 right-0 h-full bg-gradient-to-l from-green-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${lastLearningContent.progress}%` }}
                        />
                      </div>
                      <Button 
                        asChild
                        className="mt-2 bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600"
                      >
                        <Link to={`/student/courses/${lastLearningContent.phaseId}/${lastLearningContent.slug || lastLearningContent.courseId}`}>
                          متابعة التعلم
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لم تبدأ أي دورة بعد</p>
                    <Button 
                      asChild
                      className="mt-4 bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600"
                    >
                      <Link to="/student/courses">
                        استكشف الدورات
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="الدورات المسجلة"
                value="7"
                icon={<BookOpen className="h-5 w-5" />}
                trend={{ value: "+2", label: "هذا الشهر" }}
              />
              <StatCard
                title="الدورات المكتملة"
                value="3"
                icon={<BookCheck className="h-5 w-5" />}
                trend={{ value: "+1", label: "هذا الشهر" }}
              />
              <StatCard
                title="الشارات المكتسبة"
                value="4"
                icon={<Award className="h-5 w-5" />}
                trend={{ value: "+2", label: "هذا الشهر" }}
              />
              <StatCard
                title="التقييمات المكتملة"
                value="15"
                icon={<FileText className="h-5 w-5" />}
                trend={{ value: "+5", label: "هذا الأسبوع" }}
              />
            </div>
            
            {/* Current Learning Path */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">تقدم المستويات</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 min-h-[360px]">
                  <ProgressChart data={progressData} title="تقدمي في المستويات" />
                </div>
                <SkillsRadar
                  title="مهاراتي"
                  skills={skillsData}
                />
              </div>
            </div>
            
            {/* Recommended Courses */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">دوراتي</h2>
                <Button variant="ghost" size="sm" asChild className="hover:bg-[#00C896]/10 hover:text-[#00C896] transition-colors">
                  <Link to="/student/courses">
                    عرض جميع الدورات <ChevronLeft className="h-4 w-4 mr-1" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
            
            {/* Recent Activity & My Mentor */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">المرشد الخاص بي</h2>
                </div>
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-2 border-teal-500/20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-foreground mb-2">محمد أحمد</h3>
                  <p className="text-sm text-muted-foreground mb-4">خبير في الأمن السيبراني مع أكثر من 10 سنوات من الخبرة في حماية البنية التحتية للشبكات وتطوير الحلول الأمنية المتقدمة</p>
                  <Button variant="outline" size="sm" className="text-sky-500 border-sky-500/30 hover:bg-sky-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin ml-2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    LinkedIn
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm h-full hover:shadow-lg hover:border-border transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-semibold text-foreground">لوحة المتصدرين</h2>
                      <p className="text-sm text-muted-foreground">أفضل المتعلمين أداءً هذا الشهر</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="hover:bg-[#00C896]/10 hover:text-[#00C896] transition-colors">
                      <Link to="/student/leaderboard">
                        عرض الكل <ChevronLeft className="h-4 w-4 mr-1" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { 
                        name: "سارة محمد", 
                        points: 2500, 
                        rank: 1, 
                        avatar: "https://i.pravatar.cc/150?img=1",
                        badges: 8,
                        level: "المستوى المتقدم",
                        pathProgress: 85,
                        topBadges: [
                          { id: 1, name: "خبير SQL", icon: "🛡️", rarity: "legendary" },
                          { id: 2, name: "محلل شبكات", icon: "🌐", rarity: "epic" },
                        ]
                      },
                      { 
                        name: "أحمد خالد", 
                        points: 2350, 
                        rank: 2, 
                        avatar: "https://i.pravatar.cc/150?img=2",
                        badges: 7,
                        level: "المستوى المتقدم",
                        pathProgress: 78,
                        topBadges: [
                          { id: 1, name: "مطور آمن", icon: "💻", rarity: "epic" },
                          { id: 2, name: "محلل تشفير", icon: "🔐", rarity: "rare" },
                        ]
                      },
                      { 
                        name: "فاطمة علي", 
                        points: 2200, 
                        rank: 3, 
                        avatar: "https://i.pravatar.cc/150?img=3",
                        badges: 6,
                        level: "المستوى المتوسط",
                        pathProgress: 65,
                        topBadges: [
                          { id: 1, name: "صائد الثغرات", icon: "🎯", rarity: "rare" },
                          { id: 2, name: "حامي الشبكة", icon: "🛡️", rarity: "rare" },
                        ]
                      },
                      { 
                        name: "عمر حسن", 
                        points: 2100, 
                        rank: 4, 
                        avatar: "https://i.pravatar.cc/150?img=4",
                        badges: 5,
                        level: "المستوى المتوسط",
                        pathProgress: 55,
                        topBadges: [
                          { id: 1, name: "محلل شبكات", icon: "🌐", rarity: "rare" },
                          { id: 2, name: "مطور آمن", icon: "💻", rarity: "rare" },
                        ]
                      }
                    ].map((student, i) => (
                      <div
                        key={i}
                        className={cn(
                          "relative flex items-center gap-6 p-5 rounded-lg transition-all duration-300",
                          "hover:bg-muted/30 group",
                          student.rank === 1 && "bg-gradient-to-r from-amber-500/5 to-yellow-500/5 dark:from-amber-500/10 dark:to-yellow-500/10 hover:from-amber-500/10 hover:to-yellow-500/10 dark:hover:from-amber-500/20 dark:hover:to-yellow-500/20"
                        )}
                      >
                        <div className="flex items-center gap-6 w-full">
                          <div className="relative">
                            <div className="absolute -top-1 -right-1 z-10">
                              {getMedalIcon(student.rank)}
                            </div>
                            <Avatar className={cn(
                              "h-14 w-14 border-2 transition-all duration-300",
                              student.rank === 1 ? "border-amber-500/50 group-hover:border-amber-500/70 dark:border-amber-500/70 dark:group-hover:border-amber-500" :
                              student.rank === 2 ? "border-gray-400/50 group-hover:border-gray-400/70 dark:border-gray-400/70 dark:group-hover:border-gray-400" :
                              student.rank === 3 ? "border-amber-700/50 group-hover:border-amber-700/70 dark:border-amber-700/70 dark:group-hover:border-amber-700" :
                              "border-teal-500/20 group-hover:border-teal-500/40"
                            )}>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-base font-medium">{student.name}</span>
                                <div className="text-sm font-medium text-muted-foreground">
                                  {student.level}
                                </div>
                              </div>
                              <span className="text-base font-semibold text-teal-500">{student.points} نقطة</span>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1.5">
                                    <Award className="h-4 w-4 text-teal-500" />
                                    <span className="text-sm text-muted-foreground">{student.badges} شارات</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {student.topBadges.map((badge) => (
                                      <div
                                        key={badge.id}
                                        className={cn(
                                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border",
                                          getBadgeStyle(badge.rarity)
                                        )}
                                      >
                                        <span className="text-base">{badge.icon}</span>
                                        <span className="text-sm font-medium">{badge.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-500",
                                      student.rank === 1 ? "bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-400 dark:to-yellow-400" :
                                      student.rank === 2 ? "bg-gradient-to-r from-gray-400 to-gray-300 dark:from-gray-300 dark:to-gray-200" :
                                      student.rank === 3 ? "bg-gradient-to-r from-amber-700 to-amber-600 dark:from-amber-600 dark:to-amber-500" :
                                      "bg-teal-500"
                                    )}
                                    style={{ width: `${student.pathProgress}%` }}
                                  />
                                </div>
                                <div className="flex items-center gap-2 min-w-[120px]">
                                  <span className="text-sm text-muted-foreground">تقدم المسار</span>
                                  <span className="text-sm font-medium">{student.pathProgress}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
