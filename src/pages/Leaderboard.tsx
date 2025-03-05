import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Award, Trophy, Medal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

// Mock data - In a real app, this would come from an API
const allStudents = [
  { 
    id: 1,
    name: "Sarah Mohammed", 
    points: 2500, 
    rank: 1, 
    avatar: "https://i.pravatar.cc/150?img=1",
    badges: 8,
    level: "المستوى المتقدم",
    completedCourses: 12,
    topBadges: [
      { id: 1, name: "خبير SQL", icon: "🛡️", rarity: "legendary" },
      { id: 2, name: "محلل شبكات", icon: "🌐", rarity: "epic" },
    ]
  },
  { 
    id: 2,
    name: "Ahmed Khalid", 
    points: 2350, 
    rank: 2, 
    avatar: "https://i.pravatar.cc/150?img=2",
    badges: 7,
    level: "المستوى المتقدم",
    completedCourses: 10,
    topBadges: [
      { id: 1, name: "مطور آمن", icon: "💻", rarity: "epic" },
      { id: 2, name: "محلل تشفير", icon: "🔐", rarity: "rare" },
    ]
  },
  { 
    id: 3,
    name: "Fatima Ali", 
    points: 2200, 
    rank: 3, 
    avatar: "https://i.pravatar.cc/150?img=3",
    badges: 6,
    level: "المستوى المتوسط",
    completedCourses: 8,
    topBadges: [
      { id: 1, name: "صائد الثغرات", icon: "🎯", rarity: "rare" },
      { id: 2, name: "حامي الشبكة", icon: "🛡️", rarity: "rare" },
    ]
  },
  { 
    id: 4,
    name: "Omar Hassan", 
    points: 2100, 
    rank: 4, 
    avatar: "https://i.pravatar.cc/150?img=4",
    badges: 5,
    level: "المستوى المتوسط",
    completedCourses: 7,
    topBadges: [
      { id: 1, name: "محلل شبكات", icon: "🌐", rarity: "rare" },
      { id: 2, name: "مطور آمن", icon: "💻", rarity: "rare" },
    ]
  },
  { 
    id: 5,
    name: "Nour Aldeen", 
    points: 1950, 
    rank: 5, 
    avatar: "https://i.pravatar.cc/150?img=5",
    badges: 4,
    level: "المستوى المتوسط",
    completedCourses: 6,
    topBadges: [
      { id: 1, name: "مبتدئ واعد", icon: "⭐", rarity: "common" },
      { id: 2, name: "متعلم نشط", icon: "📚", rarity: "common" },
    ]
  },
  { 
    id: 6,
    name: "Layla Kareem", 
    points: 1800, 
    rank: 6, 
    avatar: "https://i.pravatar.cc/150?img=6",
    badges: 3,
    level: "المستوى المبتدئ",
    completedCourses: 5,
    topBadges: [
      { id: 1, name: "مستكشف", icon: "🔍", rarity: "common" },
      { id: 2, name: "متعاون", icon: "🤝", rarity: "common" },
    ]
  },
  { 
    id: 7,
    name: "John Smith", 
    points: 1750, 
    rank: 7, 
    avatar: "https://i.pravatar.cc/150?img=7",
    badges: 3,
    level: "المستوى المبتدئ",
    completedCourses: 4,
    topBadges: [
      { id: 1, name: "مبتدئ واعد", icon: "⭐", rarity: "common" },
      { id: 2, name: "متعلم نشط", icon: "📚", rarity: "common" },
    ]
  },
  { 
    id: 8,
    name: "Emma Wilson", 
    points: 1700, 
    rank: 8, 
    avatar: "https://i.pravatar.cc/150?img=8",
    badges: 3,
    level: "المستوى المبتدئ",
    completedCourses: 4,
    topBadges: [
      { id: 1, name: "مستكشف", icon: "🔍", rarity: "common" },
      { id: 2, name: "متعاون", icon: "🤝", rarity: "common" },
    ]
  },
  { 
    id: 9,
    name: "Michael Chen", 
    points: 1650, 
    rank: 9, 
    avatar: "https://i.pravatar.cc/150?img=9",
    badges: 2,
    level: "المستوى المبتدئ",
    completedCourses: 3,
    topBadges: [
      { id: 1, name: "مبتدئ واعد", icon: "⭐", rarity: "common" },
      { id: 2, name: "متعلم نشط", icon: "📚", rarity: "common" },
    ]
  },
  { 
    id: 10,
    name: "Sofia Garcia", 
    points: 1600, 
    rank: 10, 
    avatar: "https://i.pravatar.cc/150?img=10",
    badges: 2,
    level: "المستوى المبتدئ",
    completedCourses: 3,
    topBadges: [
      { id: 1, name: "مستكشف", icon: "🔍", rarity: "common" },
      { id: 2, name: "متعاون", icon: "🤝", rarity: "common" },
    ]
  },
  { 
    id: 11,
    name: "David Kim", 
    points: 1550, 
    rank: 11, 
    avatar: "https://i.pravatar.cc/150?img=11",
    badges: 2,
    level: "المستوى المبتدئ",
    completedCourses: 2,
    topBadges: [
      { id: 1, name: "مبتدئ واعد", icon: "⭐", rarity: "common" },
      { id: 2, name: "متعلم نشط", icon: "📚", rarity: "common" },
    ]
  },
  { 
    id: 12,
    name: "Isabella Martinez", 
    points: 1500, 
    rank: 12, 
    avatar: "https://i.pravatar.cc/150?img=12",
    badges: 2,
    level: "المستوى المبتدئ",
    completedCourses: 2,
    topBadges: [
      { id: 1, name: "مستكشف", icon: "🔍", rarity: "common" },
      { id: 2, name: "متعاون", icon: "🤝", rarity: "common" },
    ]
  }
];

const getBadgeColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "text-amber-500";
    case "epic":
      return "text-purple-500";
    case "rare":
      return "text-blue-500";
    default:
      return "text-gray-500";
  }
};

export const Leaderboard = () => {
  const { expanded } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students based on search query
  const filteredStudents = allStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Get top 3 students for the podium
  const topThree = allStudents.slice(0, 3);

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="لوحة المتصدرين" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <Helmet>
              <title>لوحة المتصدرين | أكاديمية الأمن السيبراني</title>
            </Helmet>

            {/* Podium Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">المتصدرون الثلاثة الأوائل</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* Second Place */}
                <div
                  className={cn(
                    "bg-card p-6 rounded-xl border border-border/50 shadow-sm text-center",
                    "transform hover:scale-105 transition-transform duration-300",
                    "relative"
                  )}
                >
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2">
                    <div className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #2
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto border-2 border-gray-400">
                      <AvatarImage src={topThree[1].avatar} />
                      <AvatarFallback>{topThree[1].name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <Medal className="absolute -top-2 -right-2 h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2">{topThree[1].name}</h3>
                  <p className="text-teal-500 font-semibold">{topThree[1].points} نقطة</p>
                  <p className="text-sm text-muted-foreground mt-2">{topThree[1].level}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    {topThree[1].topBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* First Place */}
                <div
                  className={cn(
                    "bg-card p-6 rounded-xl border border-border/50 shadow-sm text-center",
                    "transform hover:scale-105 transition-transform duration-300",
                    "bg-gradient-to-b from-amber-500/10 to-yellow-500/10",
                    "relative -mt-8"
                  )}
                >
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2">
                    <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-lg font-bold">
                      #1
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-yellow-500">
                      <AvatarImage src={topThree[0].avatar} />
                      <AvatarFallback>{topThree[0].name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <Trophy className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-2">{topThree[0].name}</h3>
                  <p className="text-teal-500 font-semibold text-lg">{topThree[0].points} نقطة</p>
                  <p className="text-sm text-muted-foreground mt-2">{topThree[0].level}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    {topThree[0].topBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Third Place */}
                <div
                  className={cn(
                    "bg-card p-6 rounded-xl border border-border/50 shadow-sm text-center",
                    "transform hover:scale-105 transition-transform duration-300",
                    "relative"
                  )}
                >
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2">
                    <div className="bg-amber-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                      #3
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto border-2 border-amber-700">
                      <AvatarImage src={topThree[2].avatar} />
                      <AvatarFallback>{topThree[2].name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <Medal className="absolute -top-2 -right-2 h-6 w-6 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2">{topThree[2].name}</h3>
                  <p className="text-teal-500 font-semibold">{topThree[2].points} نقطة</p>
                  <p className="text-sm text-muted-foreground mt-2">{topThree[2].level}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    {topThree[2].topBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search and List Section */}
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن طالب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="divide-y divide-border">
                  {paginatedStudents.filter(student => student.rank > 3).map((student) => (
                    <div
                      key={student.id}
                      className={cn(
                        "flex items-center gap-4 p-4 transition-all duration-300",
                        "hover:bg-muted/30"
                      )}
                    >
                      <div className="flex-shrink-0 w-8 text-lg font-semibold text-muted-foreground">
                        #{student.rank}
                      </div>
                      <Avatar className="h-12 w-12 border-2 border-teal-500/20">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{student.name}</p>
                          <p className="text-sm font-semibold text-teal-500">{student.points} نقطة</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Award className="h-3.5 w-3.5" />
                              <span>{student.badges} شارات</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>{student.completedCourses} دورات مكتملة</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.level}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {student.topBadges.map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50"
                            >
                              <span className="text-sm">{badge.icon}</span>
                              <span className="text-xs font-medium">{badge.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard; 