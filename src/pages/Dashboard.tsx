
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
  { name: "Web Security", completed: 15, total: 20 },
  { name: "Network Defense", completed: 8, total: 15 },
  { name: "Ethical Hacking", completed: 12, total: 25 },
  { name: "Forensics", completed: 5, total: 18 },
  { name: "Cryptography", completed: 10, total: 12 },
];

const pathSteps = [
  { id: "1", title: "Complete Introduction to Cybersecurity", completed: true },
  { id: "2", title: "Pass Network Security Fundamentals", completed: true },
  { id: "3", title: "Complete Web Application Security module", completed: false, current: true },
  { id: "4", title: "Pass Ethical Hacking Practical Assessment", completed: false },
  { id: "5", title: "Complete Security Operations certification", completed: false },
];

const recommendedCourses = [
  {
    id: "course-1",
    title: "Advanced Web Application Security",
    description: "Learn about XSS, CSRF, SQL Injection, and other advanced web application vulnerabilities.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400",
    progress: 25,
    level: "Intermediate" as const,
    duration: "8 hours",
  },
  {
    id: "course-2",
    title: "Network Defense Strategies",
    description: "Master the tools and techniques needed to protect networks from sophisticated attacks.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&h=400",
    progress: 0,
    level: "Advanced" as const,
    duration: "12 hours",
  },
  {
    id: "course-3",
    title: "Security Operations Center",
    description: "Learn the essential skills for working in a Security Operations Center (SOC).",
    image: "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?auto=format&fit=crop&w=600&h=400",
    level: "Intermediate" as const,
    duration: "10 hours",
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
    <div className="min-h-screen flex">
      <AdminNavbar />
      
      <div className="flex-1">
        <Navbar title="Dashboard" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome & Stats */}
            <div className="mb-8 animate-on-scroll">
              <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-muted-foreground">Track your progress and continue your learning journey.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="Courses Enrolled"
                value="7"
                icon={<BookOpen className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 2, isPositive: true }}
              />
              <StatCard
                title="Certifications"
                value="2"
                icon={<Award className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 1, isPositive: true }}
              />
              <StatCard
                title="Learning Hours"
                value="48"
                icon={<Clock className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Assessments Completed"
                value="15"
                icon={<FileText className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 5, isPositive: true }}
              />
            </div>
            
            {/* Current Learning Path */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Current Learning Path</h2>
                <Button variant="outline" size="sm" className="text-cyber-primary border-cyber-primary/30">
                  All Learning Paths <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProgressChart data={progressData} title="Network Security Specialist Path" />
                </div>
                <PathTracker
                  title="Your Next Steps"
                  steps={pathSteps}
                />
              </div>
            </div>
            
            {/* Recommended Courses */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recommended for You</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/courses">
                    View All Courses <ChevronRight className="ml-1 h-4 w-4" />
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
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
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
                  <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
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
