import React from "react";
import { Helmet } from "react-helmet";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Beaker, Lock, Terminal, Globe, Shield, Database, Wifi, Server,
  Clock, CheckCircle2, AlertTriangle, Network, Bug
} from "lucide-react";

interface Lab {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "سهل" | "متوسط" | "متقدم" | "خبير";
  duration: string;
  points: number;
  status: "مغلق" | "متاح" | "مكتمل" | "قيد التقدم";
  progress?: number;
  completedBy: number;
  icon: React.ElementType;
}

const labs: Lab[] = [
  {
    id: 1,
    title: "اختراق موقع ويب تدريبي",
    description: "تعلم كيفية اكتشاف واستغلال ثغرات SQL Injection في تطبيقات الويب",
    category: "أمن تطبيقات الويب",
    difficulty: "سهل",
    duration: "45 دقيقة",
    points: 100,
    status: "مكتمل",
    completedBy: 1234,
    icon: Globe
  },
  {
    id: 2,
    title: "تحليل البرمجيات الخبيثة",
    description: "تحليل عينة من برمجية خبيثة وتحديد سلوكها وطرق الحماية منها",
    category: "التحليل الجنائي",
    difficulty: "متقدم",
    duration: "120 دقيقة",
    points: 300,
    status: "متاح",
    completedBy: 456,
    icon: Bug
  },
  {
    id: 3,
    title: "اختبار اختراق شبكة محلية",
    description: "تعلم كيفية اكتشاف نقاط الضعف في الشبكات المحلية",
    category: "أمن الشبكات",
    difficulty: "متوسط",
    duration: "90 دقيقة",
    points: 200,
    status: "قيد التقدم",
    progress: 45,
    completedBy: 789,
    icon: Network
  },
  {
    id: 4,
    title: "حماية قاعدة بيانات",
    description: "تطبيق أفضل ممارسات الأمان على قاعدة بيانات PostgreSQL",
    category: "أمن قواعد البيانات",
    difficulty: "متوسط",
    duration: "60 دقيقة",
    points: 150,
    status: "مغلق",
    completedBy: 321,
    icon: Database
  },
  {
    id: 5,
    title: "اختراق شبكة لاسلكية",
    description: "تعلم كيفية اختبار أمان شبكات WiFi واكتشاف نقاط الضعف",
    category: "أمن الشبكات اللاسلكية",
    difficulty: "متقدم",
    duration: "150 دقيقة",
    points: 250,
    status: "متاح",
    completedBy: 567,
    icon: Wifi
  },
  {
    id: 6,
    title: "تحليل هجمات متقدمة",
    description: "دراسة وتحليل هجمات APT واستراتيجيات الحماية منها",
    category: "تحليل التهديدات",
    difficulty: "خبير",
    duration: "180 دقيقة",
    points: 400,
    status: "مغلق",
    completedBy: 123,
    icon: Shield
  },
  {
    id: 7,
    title: "اختبار اختراق خادم ويب",
    description: "تعلم كيفية اكتشاف واستغلال ثغرات في خوادم الويب",
    category: "أمن الخوادم",
    difficulty: "متقدم",
    duration: "120 دقيقة",
    points: 300,
    status: "متاح",
    completedBy: 432,
    icon: Server
  },
  {
    id: 8,
    title: "برمجة شل كود",
    description: "تعلم كيفية تطوير وتحليل شل كود لأغراض اختبار الاختراق",
    category: "البرمجة الأمنية",
    difficulty: "خبير",
    duration: "150 دقيقة",
    points: 350,
    status: "مغلق",
    completedBy: 234,
    icon: Terminal
  }
];

const difficultyColors = {
  "سهل": "bg-green-500/10 text-green-500",
  "متوسط": "bg-yellow-500/10 text-yellow-500",
  "متقدم": "bg-orange-500/10 text-orange-500",
  "خبير": "bg-red-500/10 text-red-500"
};

const statusIcons = {
  "مغلق": Lock,
  "متاح": Beaker,
  "مكتمل": CheckCircle2,
  "قيد التقدم": Clock
};

const statusColors = {
  "مغلق": "bg-muted text-muted-foreground",
  "متاح": "bg-blue-500/10 text-blue-500",
  "مكتمل": "bg-[#00C896]/10 text-[#00C896]",
  "قيد التقدم": "bg-yellow-500/10 text-yellow-500"
};

export const Labs = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>المختبرات | أكاديمية الأمن السيبراني</title>
            </Helmet>

            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">المختبرات</h1>
              <p className="text-muted-foreground">اكتشف مختبراتنا التفاعلية في مجال الأمن السيبراني</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab) => {
                const StatusIcon = statusIcons[lab.status];
                const LabIcon = lab.icon;
                
                return (
                  <Card key={lab.id} className={cn(
                    "bg-background/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300",
                    lab.status === "مكتمل" ? "border-[#00C896] border-2" : "border"
                  )}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={cn(
                          "p-3 rounded-xl",
                          lab.status === "مكتمل" ? "bg-[#00C896]/10 text-[#00C896]" : "bg-muted/50 text-muted-foreground"
                        )}>
                          <LabIcon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className={cn("ml-2", difficultyColors[lab.difficulty])}>
                          {lab.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-4">{lab.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{lab.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{lab.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                            <span>{lab.points} نقطة</span>
                          </div>
                        </div>
                        
                        {lab.status === "قيد التقدم" && lab.progress && (
                          <div className="space-y-2">
                            <Progress value={lab.progress} className="h-2" />
                            <p className="text-sm text-muted-foreground text-center">
                              {lab.progress}% مكتمل
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge className={cn(statusColors[lab.status])}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {lab.status}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-[#00C896]/10 hover:text-[#00C896]"
                            disabled={lab.status === "مغلق"}
                          >
                            {lab.status === "مكتمل" ? "إعادة المحاولة" : "ابدأ المختبر"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 