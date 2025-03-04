import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { CourseCard } from "../components/CourseCard";
import { ProgressChart } from "../components/ProgressChart";
import { StatCard } from "../components/StatCard";
import { PathTracker } from "../components/PathTracker";
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
} from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { cn } from "../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";

const progressData = [
  { name: "أمن الويب", completed: "15", total: "20" },
  { name: "الدفاع عن الشبكات", completed: "8", total: "15" },
  { name: "القرصنة الأخلاقية", completed: "12", total: "25" },
  { name: "التحليل الجنائي", completed: "5", total: "18" },
  { name: "التشفير", completed: "10", total: "12" },
];

const pathSteps = [
  { id: "1", title: "إكمال مقدمة في الأمن السيبراني", completed: true },
  { id: "2", title: "اجتياز أساسيات أمن الشبكات", completed: true },
  { id: "3", title: "إكمال وحدة أمن تطبيقات الويب", completed: false, current: true },
  { id: "4", title: "اجتياز التقييم العملي للقرصنة الأخلاقية", completed: false },
  { id: "5", title: "إكمال شهادة عمليات الأمن", completed: false },
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

const Dashboard = () => {
  const { setExpanded, setIsAdmin, expanded } = useSidebar();
  
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
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=200&h=200" 
                      alt="Course thumbnail" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1 text-foreground">أمن تطبيقات الويب المتقدم</h3>
                    <p className="text-sm text-muted-foreground mb-2">آخر نشاط: الوحدة 3 - حقن SQL</p>
                    <div className="h-2 bg-muted rounded-full mb-2">
                      <div className="h-2 bg-gradient-to-r from-sky-500 to-green-500 rounded-full" style={{ width: '25%' }} />
                    </div>
                    <Button className="mt-2 bg-gradient-to-r from-sky-500 to-green-500 text-white hover:from-sky-600 hover:to-green-600">متابعة التعلم</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="الدورات المسجلة"
                value="7"
                icon={<BookOpen className="h-5 w-5 text-teal-500" />}
                trend={{ value: "+2", label: "هذا الشهر" }}
              />
              <StatCard
                title="الدورات المكتملة"
                value="3"
                icon={<BookCheck className="h-5 w-5 text-teal-500" />}
                trend={{ value: "+1", label: "هذا الشهر" }}
              />
              <StatCard
                title="ساعات التعلم"
                value="48"
                icon={<Clock className="h-5 w-5 text-teal-500" />}
                trend={{ value: "+12", label: "هذا الأسبوع" }}
              />
              <StatCard
                title="التقييمات المكتملة"
                value="15"
                icon={<FileText className="h-5 w-5 text-teal-500" />}
                trend={{ value: "+5", label: "هذا الأسبوع" }}
              />
            </div>
            
            {/* Current Learning Path */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">مسار التعلم الحالي</h2>
                <Button variant="outline" size="sm" className="text-teal-500 border-teal-500/30 hover:bg-teal-500/10">
                  جميع المسارات <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProgressChart data={progressData} title="نشاطي" />
                </div>
                <PathTracker
                  title="خطواتي القادمة"
                  steps={pathSteps}
                />
              </div>
            </div>
            
            {/* Recommended Courses */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">دوراتي</h2>
                <Button variant="ghost" size="sm" asChild className="hover:bg-[#00C896]/10 hover:text-[#00C896] transition-colors">
                  <Link to="/courses">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-on-scroll">
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

              <div className="lg:col-span-2">
                <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm h-full hover:shadow-lg hover:border-border transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">النشاط الأخير</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: <BookCheck className="h-4 w-4 text-teal-500" />, text: "أكملت الوحدة 3: البرمجة النصية عبر المواقع", time: "قبل ساعتين" },
                      { icon: <FileText className="h-4 w-4 text-teal-500" />, text: "بدأت الاختبار: أساسيات أمن الشبكات", time: "أمس" },
                      { icon: <Zap className="h-4 w-4 text-teal-500" />, text: "حصلت على شارة: خبير حقن SQL", time: "قبل يومين" },
                      { icon: <BarChart className="h-4 w-4 text-teal-500" />, text: "تم تحقيق هدف التقدم الأسبوعي", time: "قبل 3 أيام" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0 hover:bg-muted/30 -mx-6 px-6 py-2 transition-all duration-300 cursor-pointer group">
                        <div className="flex-shrink-0 bg-gradient-to-r from-teal-500/10 to-lime-500/10 dark:from-teal-500/20 dark:to-lime-500/20 rounded-full p-2 group-hover:from-teal-500/20 group-hover:to-lime-500/20 group-hover:scale-110 transition-all duration-300">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-teal-500 transition-colors duration-300">{item.text}</p>
                          <p className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">{item.time}</p>
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

export default Dashboard;
