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
} from "lucide-react";

// Mock data - replace with actual data from your backend
const userData = {
  name: "محمد أمين",
  email: "m.amine@example.com",
  location: "الدار البيضاء، المغرب",
  joinDate: "2024-01-15",
  avatar: "/avatars/user.png", // Replace with actual avatar path
  stats: {
    completedLabs: 12,
    inProgressLabs: 3,
    earnedBadges: 5,
    completedCourses: 4,
  },
  progress: {
    currentPhase: "المرحلة الأساسية",
    phaseProgress: 65,
    totalProgress: 45,
    hoursSpent: 48,
  },
  recentAchievements: [
    {
      id: 1,
      title: "محلل الثغرات",
      date: "2024-03-15",
      icon: Shield,
    },
    {
      id: 2,
      title: "خبير الشبكات",
      date: "2024-02-28",
      icon: Award,
    },
    {
      id: 3,
      title: "صائد الثغرات",
      date: "2024-02-10",
      icon: Trophy,
    },
  ],
};

export const Profile = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-5xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>الملف الشخصي | أكاديمية الأمن السيبراني</title>
            </Helmet>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Profile Info Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>
                        {userData.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{userData.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{userData.progress.currentPhase}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span dir="ltr">{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{userData.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        انضم في {new Date(userData.joinDate).toLocaleDateString('ar-MA')}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-semibold">{userData.stats.completedLabs}</p>
                      <p className="text-xs text-muted-foreground">مختبر مكتمل</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-semibold">{userData.stats.earnedBadges}</p>
                      <p className="text-xs text-muted-foreground">شارة محققة</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress and Stats */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>نظرة عامة على التقدم</CardTitle>
                    <CardDescription>تقدمك في المسار التعليمي</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">التقدم الكلي</span>
                          <span className="font-medium">{userData.progress.totalProgress}%</span>
                        </div>
                        <Progress value={userData.progress.totalProgress} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{userData.progress.currentPhase}</span>
                          <span className="font-medium">{userData.progress.phaseProgress}%</span>
                        </div>
                        <Progress value={userData.progress.phaseProgress} className="h-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{userData.stats.completedCourses}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">دورات مكتملة</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{userData.stats.completedLabs}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">مختبرات منجزة</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{userData.stats.earnedBadges}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">شارات محققة</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{userData.progress.hoursSpent}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">ساعة تعلم</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>آخر الإنجازات</CardTitle>
                    <CardDescription>الشارات والإنجازات المحققة مؤخراً</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userData.recentAchievements.map((achievement) => {
                        const Icon = achievement.icon;
                        return (
                          <div
                            key={achievement.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-[#00C896]/10 text-[#00C896]">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">{achievement.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(achievement.date).toLocaleDateString('ar-MA')}
                                </p>
                              </div>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-[#00C896]" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
