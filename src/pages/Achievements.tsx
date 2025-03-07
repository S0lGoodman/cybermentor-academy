import React, { useState } from "react";
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
  Filter,
  Search,
  Share2,
} from "lucide-react";
import { ShareAchievement } from "@/components/ShareAchievement";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

interface Achievement {
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
  rarity: Rarity;
  color: string;
  glowColor: string;
}

// Mock data for badges with rarity and colors
const achievements: Achievement[] = [
  {
    id: 1,
    title: "المبتدئ في الأمن السيبراني",
    description: "أكمل المستوى الأول من المسار التعليمي",
    icon: Shield,
    progress: 100,
    total: 1205,
    acquired: 1205,
    achievedDate: "2024-03-15",
    points: 100,
    rarity: "Common",
    color: "#4CAF50",
    glowColor: "rgba(76, 175, 80, 0.3)"
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
    points: 300,
    rarity: "Uncommon",
    color: "#2196F3",
    glowColor: "rgba(33, 150, 243, 0.3)"
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
    points: 200,
    rarity: "Rare",
    color: "#9C27B0",
    glowColor: "rgba(156, 39, 176, 0.3)"
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
    points: 500,
    rarity: "Epic",
    color: "#FF9800",
    glowColor: "rgba(255, 152, 0, 0.3)"
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
    points: 400,
    rarity: "Legendary",
    color: "#FF5722",
    glowColor: "rgba(255, 87, 34, 0.3)"
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
    points: 300,
    rarity: "Epic",
    color: "#FF9800",
    glowColor: "rgba(255, 152, 0, 0.3)"
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
    points: 250,
    rarity: "Epic",
    color: "#FF9800",
    glowColor: "rgba(255, 152, 0, 0.3)"
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
    points: 200,
    rarity: "Legendary",
    color: "#FF5722",
    glowColor: "rgba(255, 87, 34, 0.3)"
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
    points: 250,
    rarity: "Uncommon",
    color: "#2196F3",
    glowColor: "rgba(33, 150, 243, 0.3)"
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
    points: 350,
    rarity: "Rare",
    color: "#9C27B0",
    glowColor: "rgba(156, 39, 176, 0.3)"
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
    points: 400,
    rarity: "Epic",
    color: "#FF9800",
    glowColor: "rgba(255, 152, 0, 0.3)"
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
    points: 450,
    rarity: "Legendary",
    color: "#FF5722",
    glowColor: "rgba(255, 87, 34, 0.3)"
  }
];

const rarityColors = {
  Common: "bg-green-500",
  Uncommon: "bg-blue-500",
  Rare: "bg-purple-500",
  Epic: "bg-orange-500",
  Legendary: "bg-red-500",
};

const rarityLabels = {
  Common: "عادي",
  Uncommon: "غير شائع",
  Rare: "نادر",
  Epic: "أسطوري",
  Legendary: "خارق",
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const Icon = achievement.icon;
  const isAchieved = achievement.progress === 100;

  const handleShare = () => {
    const shareText = `لقد حصلت على شارة "${achievement.title}" في أكاديمية الأمن السيبراني! 🎉\n${achievement.description}\nحصل عليها ${achievement.acquired} متدرب`;
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="group perspective">
      <div className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-500",
        isAchieved ? "hover:scale-105" : "opacity-75 grayscale",
        "bg-card border"
      )}
      style={{
        boxShadow: isAchieved ? `0 0 20px ${achievement.glowColor}` : "none",
        borderColor: isAchieved ? achievement.color : "hsl(var(--border))",
      }}>
        {/* Share Button - Only show for achieved badges */}
        {isAchieved && (
          <button
            onClick={handleShare}
            className="absolute top-3 left-3 p-2 rounded-full bg-[#00C896]/10 text-[#00C896] opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#00C896]/20 z-10"
            title="مشاركة الشارة"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={cn(
              "p-4 rounded-full transition-all duration-500 group-hover:scale-110",
              isAchieved ? "text-white" : "text-muted-foreground"
            )}
            style={{
              backgroundColor: isAchieved ? achievement.color : "hsl(var(--muted))",
            }}>
              <Icon className="w-12 h-12 transition-transform duration-500 group-hover:rotate-12" />
            </div>
          </div>
          
          <div className="text-center transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]">
            <h3 className="font-bold text-lg mb-2 text-foreground transition-colors duration-300 group-hover:text-[#00C896]">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 transition-colors duration-300 group-hover:text-foreground">{achievement.description}</p>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge 
                className={cn(
                  "px-2 py-1",
                  rarityColors[achievement.rarity]
                )}
              >
                {rarityLabels[achievement.rarity]}
              </Badge>
              <Badge variant="outline">
                {achievement.points} نقطة
              </Badge>
            </div>

            {!isAchieved && achievement.requiredProgress && (
              <div className="text-sm text-muted-foreground">
                {achievement.requiredProgress}
              </div>
            )}

            {isAchieved && (
              <div className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                حصل عليها {achievement.acquired} متدرب
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Achievements = () => {
  const { expanded } = useSidebar();
  const [statusFilter, setStatusFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState("all");

  const filteredAchievements = achievements.filter(achievement => {
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "acquired" && achievement.progress === 100) ||
                         (statusFilter === "unacquired" && achievement.progress < 100);
    const matchesRarity = rarityFilter === "all" || achievement.rarity.toLowerCase() === rarityFilter;
    
    return matchesStatus && matchesRarity;
  });

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>الإنجازات | أكاديمية الأمن السيبراني</title>
            </Helmet>

            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">الإنجازات</h1>
              <p className="text-muted-foreground">
                اكتشف وتتبع إنجازاتك في رحلة التعلم
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="حالة الإنجاز" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الإنجازات</SelectItem>
                  <SelectItem value="acquired">المكتسبة</SelectItem>
                  <SelectItem value="unacquired">غير المكتسبة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الندرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="common">عادي</SelectItem>
                  <SelectItem value="uncommon">غير شائع</SelectItem>
                  <SelectItem value="rare">نادر</SelectItem>
                  <SelectItem value="epic">أسطوري</SelectItem>
                  <SelectItem value="legendary">خارق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 