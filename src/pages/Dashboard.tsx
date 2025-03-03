
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/StatCard";
import { PathTracker } from "@/components/PathTracker";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Award,
  Clock,
  FileText,
  ChevronRight,
  BarChart,
  BookCheck,
  Zap,
} from "lucide-react";
import { useSidebar } from "@/components/Sidebar";

const progressData = [
  { name: "أمن الويب", completed: 15, total: 20 },
  { name: "الدفاع عن الشبكات", completed: 8, total: 15 },
  { name: "القرصنة الأخلاقية", completed: 12, total: 25 },
  { name: "التحليل الجنائي", completed: 5, total: 18 },
  { name: "التشفير", completed: 10, total: 12 },
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
    id: "course-1",
    title: "أمن تطبيقات الويب المتقدم",
    description: "تعلم عن XSS و CSRF وحقن SQL وثغرات تطبيقات الويب المتقدمة الأخرى.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400",
    progress: 25,
    level: "متوسط" as const,
    duration: "8 ساعات",
  },
  {
    id: "course-2",
    title: "استراتيجيات الدفاع عن الشبكات",
    description: "إتقان الأدوات والتقنيات اللازمة لحماية الشبكات من الهجمات المتطورة.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&h=400",
    progress: 0,
    level: "متقدم" as const,
    duration: "12 ساعة",
  },
  {
    id: "course-3",
    title: "مركز عمليات الأمن",
    description: "تعلم المهارات الأساسية للعمل في مركز عمليات الأمن (SOC).",
    image: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=600&h=400",
    level: "متوسط" as const,
    duration: "10 ساعات",
    locked: true,
  },
];

const Dashboard = () => {
  const { setExpanded, setIsAdmin } = useSidebar();
  
  useEffect(() => {
    setExpanded(true);
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
      
      <div className="flex-1">
        <Navbar title="لوحة التحكم" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome & Stats */}
            <div className="mb-8 animate-on-scroll">
              <h1 className="text-2xl font-bold mb-2">مرحباً بعودتك، جون!</h1>
              <p className="text-muted-foreground">تتبع تقدمك وواصل رحلة تعلمك.</p>
            </div>
            
            {/* Continue Learning Section */}
            <div className="mb-8 animate-on-scroll">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">متابعة التعلم</h2>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=200&h=200" 
                      alt="Course thumbnail" 
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">أمن تطبيقات الويب المتقدم</h3>
                    <p className="text-sm text-muted-foreground mb-2">آخر نشاط: الوحدة 3 - حقن SQL</p>
                    <div className="h-2 bg-slate-100 rounded-full mb-2">
                      <div className="h-2 bg-cyber-primary rounded-full" style={{ width: '25%' }} />
                    </div>
                    <Button className="mt-2">متابعة التعلم</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="الدورات المسجلة"
                value="7"
                icon={<BookOpen className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 2, isPositive: true }}
              />
              <StatCard
                title="الدورات المكتملة"
                value="3"
                icon={<BookCheck className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 1, isPositive: true }}
              />
              <StatCard
                title="ساعات التعلم"
                value="48"
                icon={<Clock className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="التقييمات المكتملة"
                value="15"
                icon={<FileText className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 5, isPositive: true }}
              />
            </div>
            
            {/* Current Learning Path */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">مسار التعلم الحالي</h2>
                <Button variant="outline" size="sm" className="text-cyber-primary border-cyber-primary/30">
                  جميع المسارات <ChevronRight className="mr-1 h-4 w-4" />
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
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/courses">
                    عرض جميع الدورات <ChevronRight className="mr-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            </div>
            
            {/* Recent Activity & Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-on-scroll">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">النشاط الأخير</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: <BookCheck className="h-4 w-4" />, text: "Completed Module 3: Cross-Site Scripting", time: "2 hours ago" },
                    { icon: <FileText className="h-4 w-4" />, text: "Started Quiz: Network Security Fundamentals", time: "Yesterday" },
                    { icon: <Zap className="h-4 w-4" />, text: "Earned Badge: SQL Injection Expert", time: "2 days ago" },
                    { icon: <BarChart className="h-4 w-4" />, text: "Weekly progress goal achieved", time: "3 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className="flex-shrink-0 bg-cyber-primary/10 rounded-full p-2">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">المواعيد النهائية القادمة</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { title: "Ethical Hacking Assessment", date: "Tomorrow, 11:59 PM", urgent: true },
                    { title: "Certificate Exam: Network Security", date: "May 15, 2024", urgent: false },
                    { title: "Group Project Submission", date: "May 18, 2024", urgent: false },
                    { title: "Live Workshop: Incident Response", date: "May 22, 2024", urgent: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                      <div className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full ${item.urgent ? "bg-red-500" : "bg-yellow-400"}`} />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
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
