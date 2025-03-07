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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Clock,
  GraduationCap,
  Award,
  Shield,
  CheckCircle2,
  Flame,
  Flag,
  Terminal,
  Share2,
  Globe,
  Monitor,
  Network,
  Users,
  Bug,
  Sword,
  Server,
  FileSearch,
  Wifi,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - replace with actual data from your backend
const userData = {
  name: "محمد أمين",
  tag: "[0x9][MAGE]",
  country: "MA",
  avatar: "https://github.com/shadcn.png",
  stats: {
    rank: 6,
    rankPercentile: "أفضل 5%",
    badges: 4,
    streak: 7,
    completedRooms: 2,
    completedLabs: 2,
    completedCourses: 2,
  },
  badges: [
    {
      id: 1,
      title: "المبتدئ في الأمن السيبراني",
      description: "أكمل المستوى الأول من المسار التعليمي",
      icon: Shield,
      color: "#4CAF50",
      glowColor: "rgba(76, 175, 80, 0.3)",
    },
    {
      id: 2,
      title: "محلل الشبكات",
      description: "أكمل جميع دورات أمن الشبكات",
      icon: Server,
      color: "#2196F3",
      glowColor: "rgba(33, 150, 243, 0.3)",
    },
    {
      id: 7,
      title: "محلل التهديدات",
      description: "أكمل دورة تحليل التهديدات السيبرانية",
      icon: FileSearch,
      color: "#FF9800",
      glowColor: "rgba(255, 152, 0, 0.3)",
    },
    {
      id: 9,
      title: "محترف الشبكات اللاسلكية",
      description: "أكمل دورة أمن الشبكات اللاسلكية",
      icon: Wifi,
      color: "#2196F3",
      glowColor: "rgba(33, 150, 243, 0.3)",
    }
  ],
};

const StatCard = ({ icon: Icon, label, value, subValue }: { icon: any, label: string, value: string | number, subValue?: string }) => (
  <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1">
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3 rounded-full bg-[#00C896]/10 transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-6 h-6 text-[#00C896] transition-all duration-300 group-hover:rotate-12" />
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-foreground transition-colors duration-200 group-hover:text-[#00C896]">{value}</h3>
          <p className="text-sm text-muted-foreground">{label}</p>
          {subValue && (
            <p className="text-xs text-[#00C896] transition-all duration-200 group-hover:scale-105">{subValue}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const BadgeCard = ({ badge }: { badge: any }) => {
  const Icon = badge.icon;
  
  const handleShare = () => {
    const shareText = `لقد حصلت على شارة "${badge.title}" في أكاديمية الأمن السيبراني! 🎉\n${badge.description}`;
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="group perspective">
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-card border"
        style={{
          boxShadow: `0 0 20px ${badge.glowColor}`,
          borderColor: badge.color,
          transform: "translateZ(0)",
        }}
      >
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-3 left-3 p-2 rounded-full bg-[#00C896]/10 text-[#00C896] opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#00C896]/20"
          title="مشاركة الشارة"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className="p-4 rounded-full text-white transition-all duration-500 group-hover:scale-110"
              style={{ backgroundColor: badge.color }}
            >
              <Icon className="w-12 h-12 transition-transform duration-500 group-hover:rotate-12" />
            </div>
          </div>
          <div className="text-center transition-all duration-300 group-hover:transform group-hover:translate-y-[-2px]">
            <h3 className="font-bold text-lg mb-2 text-foreground transition-colors duration-300 group-hover:text-[#00C896]">{badge.title}</h3>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{badge.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Profile = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>{userData.name} | أكاديمية الأمن السيبراني</title>
            </Helmet>

            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 border-2 border-[#00C896]/20 transition-all duration-300 hover:scale-105 hover:border-[#00C896]/50 hover:shadow-lg hover:shadow-[#00C896]/20">
                  <AvatarImage src={userData.avatar} alt={userData.name} className="transition-transform duration-300 hover:scale-110" />
                  <AvatarFallback className="transition-all duration-300 hover:bg-[#00C896]/10">{userData.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold transition-colors duration-300 hover:text-[#00C896]">{userData.name}</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 group">
              <StatCard
                icon={Trophy}
                label="الترتيب"
                value={userData.stats.rank}
                subValue={userData.stats.rankPercentile}
              />
              <StatCard
                icon={Award}
                label="الشارات"
                value={userData.stats.badges}
              />
              <StatCard
                icon={Flame}
                label="التتبع"
                value={userData.stats.streak}
              />
              <StatCard
                icon={Flag}
                label="المختبرات المكتملة"
                value={userData.stats.completedLabs}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="w-full bg-transparent border-b border-border flex justify-end">
                <TabsTrigger 
                  value="labs" 
                  className="relative px-4 py-2 -mb-[2px] rounded-none bg-transparent transition-all duration-200 hover:text-[#00C896] data-[state=active]:text-[#00C896] data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-[#00C896] before:transform before:scale-x-0 before:transition-transform before:duration-200 data-[state=active]:before:scale-x-100 hover:before:scale-x-100"
                >
                  المختبرات المكتملة
                </TabsTrigger>
                <TabsTrigger 
                  value="courses" 
                  className="relative px-4 py-2 -mb-[2px] rounded-none bg-transparent transition-all duration-200 hover:text-[#00C896] data-[state=active]:text-[#00C896] data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-[#00C896] before:transform before:scale-x-0 before:transition-transform before:duration-200 data-[state=active]:before:scale-x-100 hover:before:scale-x-100"
                >
                  الدورات المكتملة
                </TabsTrigger>
                <TabsTrigger 
                  value="badges" 
                  className="relative px-4 py-2 -mb-[2px] rounded-none bg-transparent transition-all duration-200 hover:text-[#00C896] data-[state=active]:text-[#00C896] data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-[#00C896] before:transform before:scale-x-0 before:transition-transform before:duration-200 data-[state=active]:before:scale-x-100 hover:before:scale-x-100"
                >
                  الشارات
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="relative px-4 py-2 -mb-[2px] rounded-none bg-transparent transition-all duration-200 hover:text-[#00C896] data-[state=active]:text-[#00C896] data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-[#00C896] before:transform before:scale-x-0 before:transition-transform before:duration-200 data-[state=active]:before:scale-x-100 hover:before:scale-x-100"
                >
                  نظرة عامة
                </TabsTrigger>
              </TabsList>

              <TabsContent 
                value="overview" 
                className="transition-all duration-200 transform"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>الدورات المكتملة</CardTitle>
                      <CardDescription>عدد الدورات التي أكملتها</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <BookOpen className="w-8 h-8 text-[#00C896]" />
                        <span className="text-3xl font-bold">{userData.stats.completedCourses}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>المختبرات المكتملة</CardTitle>
                      <CardDescription>عدد المختبرات التي أنجزتها</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Flag className="w-8 h-8 text-[#00C896]" />
                        <span className="text-3xl font-bold">{userData.stats.completedLabs}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>الشارات المكتسبة</CardTitle>
                      <CardDescription>عدد الشارات التي حصلت عليها</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Award className="w-8 h-8 text-[#00C896]" />
                        <span className="text-3xl font-bold">{userData.stats.badges}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="badges" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {userData.badges.map((badge) => (
                    <BadgeCard key={badge.id} badge={badge} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">قائمة الدورات المكتملة ستظهر هنا</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="labs">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">قائمة المختبرات المكتملة ستظهر هنا</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
