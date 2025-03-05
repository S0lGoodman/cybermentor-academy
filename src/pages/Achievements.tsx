import React from "react";
import { Helmet } from "react-helmet";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  Award,
  Shield,
  BookOpen,
  Target,
  Zap,
  Code,
  Server,
  Users,
  Network,
  Bug,
  FileSearch,
  Database,
  ShieldAlert,
  Fingerprint,
  Webhook,
  Wifi,
  Binary,
  Laptop,
} from "lucide-react";
import { ShareAchievement } from "@/components/ShareAchievement";

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  total: number;
  acquired: number;
  achievedDate?: string;
  requiredProgress?: string;
  points: number;
}

// Mock data for badges
const badges: Badge[] = [
  {
    id: 1,
    title: "المبتدئ في الأمن السيبراني",
    description: "أكمل المستوى الأول من المسار التعليمي",
    icon: Shield,
    progress: 100,
    total: 1205,
    acquired: 1205,
    achievedDate: "2024-03-15",
    points: 100
  },
  {
    id: 2,
    title: "محلل الشبكات",
    description: "أكمل جميع دورات أمن الشبكات",
    icon: Server,
    progress: 100,
    total: 856,
    acquired: 856,
    achievedDate: "2024-03-20",
    points: 300
  },
  {
    id: 3,
    title: "مختبر الويب",
    description: "أكمل 5 مختبرات في أمن تطبيقات الويب",
    icon: Code,
    progress: 60,
    total: 432,
    acquired: 0,
    requiredProgress: "3/5 مختبرات",
    points: 200
  },
  {
    id: 4,
    title: "المتقدم في الأمن السيبراني",
    description: "أكمل المستوى الثاني من المسار التعليمي",
    icon: Target,
    progress: 45,
    total: 245,
    acquired: 0,
    requiredProgress: "45% مكتمل",
    points: 500
  },
  {
    id: 5,
    title: "الخبير في القرصنة الأخلاقية",
    description: "أكمل جميع دورات القرصنة الأخلاقية",
    icon: Zap,
    progress: 30,
    total: 123,
    acquired: 0,
    requiredProgress: "30% مكتمل",
    points: 400
  },
  {
    id: 6,
    title: "صائد الثغرات",
    description: "اكتشف 10 ثغرات أمنية في تحديات المنصة",
    icon: Bug,
    progress: 40,
    total: 98,
    acquired: 0,
    requiredProgress: "4/10 ثغرات",
    points: 300
  },
  {
    id: 7,
    title: "محلل التهديدات",
    description: "أكمل دورة تحليل التهديدات السيبرانية",
    icon: FileSearch,
    progress: 100,
    total: 342,
    acquired: 342,
    achievedDate: "2024-03-01",
    points: 250
  },
  {
    id: 8,
    title: "خبير قواعد البيانات",
    description: "أكمل جميع تحديات حماية قواعد البيانات",
    icon: Database,
    progress: 75,
    total: 156,
    acquired: 156,
    requiredProgress: "75% مكتمل",
    points: 200
  },
  {
    id: 9,
    title: "محترف الشبكات اللاسلكية",
    description: "أكمل دورة أمن الشبكات اللاسلكية",
    icon: Wifi,
    progress: 100,
    total: 445,
    acquired: 445,
    achievedDate: "2024-02-15",
    points: 250
  },
  {
    id: 10,
    title: "محلل البرمجيات الخبيثة",
    description: "أكمل تحديات تحليل البرمجيات الخبيثة",
    icon: Binary,
    progress: 20,
    total: 89,
    acquired: 0,
    requiredProgress: "20% مكتمل",
    points: 350
  },
  {
    id: 11,
    title: "خبير التشفير",
    description: "أكمل جميع تحديات التشفير وفك الشفرات",
    icon: Fingerprint,
    progress: 55,
    total: 234,
    acquired: 0,
    requiredProgress: "55% مكتمل",
    points: 400
  },
  {
    id: 12,
    title: "محترف الهندسة العكسية",
    description: "أكمل دورة الهندسة العكسية للبرمجيات",
    icon: Webhook,
    progress: 15,
    total: 67,
    acquired: 0,
    requiredProgress: "15% مكتمل",
    points: 450
  }
];

const AchievementCard = ({ badge }: { badge: Badge }) => {
  const Icon = badge.icon;
  const isAchieved = badge.progress === 100;

  return (
    <div className="group perspective">
      <div className="relative transition-all duration-500 preserve-3d group-hover:rotate-y-180">
        {/* Front of the card */}
        <Card className={cn(
          "relative backface-hidden",
          isAchieved ? "border-[#00C896]/30" : "opacity-75"
        )}>
          <CardHeader className="flex flex-row items-center justify-center text-center p-6">
            <div className={cn(
              "p-4 rounded-xl",
              isAchieved ? "bg-[#00C896]/10 text-[#00C896]" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-12 h-12" />
            </div>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <h3 className="font-semibold mb-1">{badge.title}</h3>
            <div className="flex items-center justify-center gap-2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isAchieved ? "bg-[#00C896]/10 text-[#00C896]" : "bg-muted text-muted-foreground"
              )}>
                {badge.points} نقطة
              </span>
            </div>
            {!isAchieved && (
              <Lock className="w-5 h-5 text-muted-foreground/50 absolute top-4 left-4" />
            )}
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card className={cn(
          "absolute inset-0 rotate-y-180 backface-hidden",
          isAchieved ? "border-[#00C896]/30" : "opacity-75"
        )}>
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {badge.title}
              </CardTitle>
              {isAchieved && (
                <ShareAchievement
                  achievement={{
                    title: badge.title,
                    description: badge.description,
                    icon: badge.icon,
                    date: badge.achievedDate || new Date().toISOString(),
                    points: badge.points,
                  }}
                />
              )}
            </div>
            <CardDescription>
              {badge.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAchieved ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#00C896]">
                    <Award className="w-4 h-4" />
                    <span>تم الحصول عليها في {new Date(badge.achievedDate).toLocaleDateString('ar-MA')}</span>
                  </div>
                  <span className="text-sm bg-[#00C896]/10 text-[#00C896] px-2 py-0.5 rounded-full">
                    {badge.points} نقطة
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>حصل عليها {badge.acquired} متعلم</span>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Progress value={badge.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {badge.requiredProgress}
                    </p>
                    <span className="text-sm bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {badge.points} نقطة
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                  <Users className="w-4 h-4" />
                  <span>حصل عليها {badge.acquired} متعلم</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const Achievements = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>الإنجازات | أكاديمية الأمن السيبراني</title>
            </Helmet>

            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">الإنجازات</h1>
              <p className="text-muted-foreground">اكتشف إنجازاتك وشاراتك في رحلة التعلم</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <AchievementCard key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 