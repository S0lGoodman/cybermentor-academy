import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  BarChart, 
  CheckCircle, 
  BookOpen, 
  FileText, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Beaker, 
  CheckCircle2, 
  LockIcon,
  Home,
  ChevronLeft as ChevronLeftIcon,
  GraduationCap
} from "lucide-react";
import StatCard from "@/components/StatCard";
import PathTracker from "@/components/PathTracker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { marked } from 'marked';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSidebar } from "@/components/Sidebar";

// Import course data
import { learningPath, coursesData } from "@/data/courses";

// Mock course data structure
interface ContentItem {
  id: string;
  title: string;
  duration: string;
  type: "video" | "text" | "lab" | "quiz";
  completed: boolean;
  locked: boolean;
  description?: string;
  writtenContent?: string;
}

interface Section {
  id: string;
  title: string;
  items: ContentItem[];
}

// Mock data for a course
const courseSections: Section[] = [
  {
    id: "section-1",
    title: "مقدمة في الشبكات",
    items: [
      {
        id: "1-1",
        title: "مقدمة عن الشبكات والبروتوكولات",
        duration: "10min",
        type: "video",
        completed: true,
        locked: false,
        description: "تعلم المفاهيم الأساسية للشبكات وكيفية عملها",
        writtenContent: `
# مقدمة في الشبكات والبروتوكولات

## المفاهيم الأساسية
- تعريف الشبكة: مجموعة من الأجهزة المتصلة ببعضها البعض
- أنواع الشبكات: LAN, WAN, MAN
- مكونات الشبكة الأساسية

## البروتوكولات الشائعة
- TCP/IP
- HTTP/HTTPS
- DNS
- DHCP

## أمن الشبكات
- أهمية حماية الشبكات
- التهديدات الشائعة
- طرق الحماية الأساسية
`
      },
      {
        id: "1-2",
        title: "نموذج OSI",
        duration: "15min",
        type: "text",
        completed: false,
        locked: false,
        description: "فهم طبقات نموذج OSI وكيفية تفاعلها"
      },
      {
        id: "1-3",
        title: "[LAB] تحليل حزم البيانات",
        duration: "30min",
        type: "lab",
        completed: false,
        locked: false,
        description: "تطبيق عملي على تحليل حزم البيانات باستخدام Wireshark"
      }
    ]
  },
  {
    id: "section-2",
    title: "بروتوكولات TCP/IP",
    items: [
      {
        id: "2-1",
        title: "مقدمة في TCP/IP",
        duration: "12min",
        type: "video",
        completed: false,
        locked: true,
        description: "فهم أساسيات بروتوكول TCP/IP وكيفية عمله"
      },
      {
        id: "2-2",
        title: "تحليل المنافذ والخدمات",
        duration: "20min",
        type: "text",
        completed: false,
        locked: true,
        description: "تعلم كيفية تحليل المنافذ المفتوحة والخدمات المشغلة"
      },
      {
        id: "2-3",
        title: "[LAB] فحص المنافذ المفتوحة",
        duration: "45min",
        type: "lab",
        completed: false,
        locked: true,
        description: "تطبيق عملي على فحص المنافذ المفتوحة باستخدام Nmap"
      }
    ]
  }
];

const course = {
  id: "network-security",
  title: "Network Security Fundamentals",
  description: "Learn the basics of securing networks, identifying vulnerabilities, and preventing intrusions. This comprehensive course provides hands-on experience with industry-standard tools and techniques.",
  duration: "4 weeks",
  level: "Beginner",
  enrolledStudents: 245,
  rating: 4.8,
  progress: 0,
  image: "/placeholder.svg",
  instructor: "Dr. Sarah Chen",
  instructorRole: "Senior Security Specialist",
  instructorImage: "/placeholder.svg",
  updated: "May 2023"
};

const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "video":
      return <PlayCircle className="w-4 h-4" />;
    case "text":
      return <FileText className="w-4 h-4" />;
    case "lab":
      return <Beaker className="w-4 h-4" />;
    case "quiz":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return null;
  }
};

export const CourseDetails = () => {
  const { expanded } = useSidebar();
  const { phaseId, courseSlug } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);

  // Find the current course using the slug
  const currentCourse = coursesData.find(course => 
    (course.slug === courseSlug || course.id === courseSlug) && course.phaseId === phaseId
  );

  // Find the current phase
  const currentPhase = learningPath.find(phase => phase.id === phaseId);

  // Get course sections from the current course
  const courseSections = currentCourse?.content || [];

  // Calculate total progress
  const totalItems = courseSections.reduce((acc, section) => 
    acc + section.items.length, 0
  );
  const completedItems = courseSections.reduce(
    (acc, section) => acc + section.items.filter(item => item.completed).length,
    0
  );
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Find current content item
  const currentItem = courseSections
    .flatMap(section => section.items)
    .find(item => item.id === currentItemId);

  // Set initial content item if not set
  useEffect(() => {
    if (!currentItemId && courseSections.length > 0 && courseSections[0].items.length > 0) {
      setCurrentItemId(courseSections[0].items[0].id);
    }
  }, [currentItemId, courseSections]);

  // Save last accessed content
  useEffect(() => {
    if (currentItem && currentCourse) {
      const lastContent = {
        courseId: currentCourse.id,
        courseTitle: currentCourse.title,
        courseImage: currentCourse.image,
        lastUnit: currentItem.title,
        progress: currentCourse.progress,
        phaseId: currentCourse.phaseId,
        slug: currentCourse.slug
      };
      localStorage.setItem('lastLearningContent', JSON.stringify(lastContent));
    }
  }, [currentItem, currentCourse]);

  // Load saved progress when video changes
  useEffect(() => {
    if (currentItem?.type === 'video') {
      const savedProgress = localStorage.getItem(`video-progress-${currentItemId}`);
      if (savedProgress) {
        setSavedTime(parseFloat(savedProgress));
        setShowResumePrompt(true);
      }
    }
  }, [currentItemId]);

  // Save video progress
  const handleVideoMessage = (event: MessageEvent) => {
    if (event.origin !== "https://www.youtube.com") return;
    
    try {
      const data = JSON.parse(event.data);
      if (data.event === "onStateChange" && data.info === 2) { // 2 is paused state
        localStorage.setItem(`video-progress-${currentItemId}`, data.currentTime.toString());
      }
    } catch (e) {
      // Ignore parsing errors from other messages
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleVideoMessage);
    return () => window.removeEventListener('message', handleVideoMessage);
  }, [currentItemId]);

  // Resume video from saved position
  const handleResume = () => {
    if (videoRef.current && videoRef.current.contentWindow) {
      videoRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [savedTime, true]
        }),
        '*'
      );
    }
    setShowResumePrompt(false);
  };

  // Find current section
  const currentSection = courseSections.find(section =>
    section.items.some(item => item.id === currentItemId)
  );

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Course Content Sidebar */}
      <div 
        className={cn(
          "h-screen bg-muted/30 border-l flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
        )}
      >
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">محتوى الدورة</h2>
          <Progress value={progress} className="h-2 bg-muted [&>div]:bg-[#00C896]" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedItems} من {totalItems} مكتمل ({Math.round(progress)}%)
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {courseSections.map((section) => (
              <div key={section.id} className="mb-6">
                <h3 className="font-medium mb-2">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.locked && setCurrentItemId(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2 rounded text-sm text-start",
                        currentItemId === item.id && "bg-[#00C896]/10 text-[#00C896]",
                        item.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00C896]/10 hover:text-[#00C896]"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <ContentTypeIcon type={item.type} />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.locked && <LockIcon className="w-4 h-4" />}
                        {item.completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        <span className="text-xs text-muted-foreground">{item.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Breadcrumb Navigation */}
        <div className="h-12 border-b bg-background/95 backdrop-blur flex items-center px-4">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link 
              to="/student/dashboard" 
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <Link 
              to="/student/courses"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>الدورات</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <Link 
              to={`/student/courses/${phaseId}`}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{currentPhase?.phase}</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <span className="text-foreground font-medium">{currentCourse?.title}</span>
          </nav>
        </div>

        <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-[#00C896]/10 hover:text-[#00C896]"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              {currentItem?.type === 'video' ? 'فيديو تعليمي' : 
               currentItem?.type === 'lab' ? 'تطبيق عملي' : 
               currentItem?.type === 'text' ? 'محتوى نصي' : 'اختبار'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-[#00C896]/10 hover:text-[#00C896]"
            >
              السابق
            </Button>
            <Button 
              size="sm" 
              className="bg-[#00C896] hover:bg-[#00C896]/90 text-white"
            >
              التالي
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            <Helmet>
              <title>{currentItem?.title || course.title} | أكاديمية الأمن السيبراني</title>
            </Helmet>

            {/* Content Display Area */}
            {currentItem?.type === 'video' ? (
              <>
                <div className="relative">
                  <div className="aspect-video rounded-lg mb-6 overflow-hidden">
                    <iframe
                      ref={videoRef}
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1&origin=${window.location.origin}&autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={currentItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {showResumePrompt && (
                    <div className="absolute top-4 right-4 bg-background/95 p-4 rounded-lg shadow-lg border flex items-center gap-4">
                      <p className="text-sm">هل تريد متابعة المشاهدة من حيث توقفت؟ ({Math.floor(savedTime / 60)}:{Math.floor(savedTime % 60).toString().padStart(2, '0')})</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#00C896] hover:bg-[#00C896]/90 text-white"
                          onClick={handleResume}
                        >
                          متابعة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-[#00C896]/10 hover:text-[#00C896]"
                          onClick={() => setShowResumePrompt(false)}
                        >
                          البدء من جديد
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="bg-background hover:bg-[#00C896] hover:text-white transition-colors"
                      >
                        <FileText className="w-4 h-4 ml-2" />
                        عرض جميع الملاحظات
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>جميع الملاحظات - {currentItem.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Here we would map through all saved notes */}
                        <Card className="p-4">
                          <p className="text-sm text-muted-foreground mb-2">٢٠ فبراير ٢٠٢٤</p>
                          <p>هنا ستظهر الملاحظات المحفوظة...</p>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Tabs defaultValue="written" className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                      value="written" 
                      className="data-[state=active]:bg-[#00C896] data-[state=active]:text-white"
                    >
                      النسخة المكتوبة
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notes"
                      className="data-[state=active]:bg-[#00C896] data-[state=active]:text-white"
                    >
                      الملاحظات
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="written">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none dark:prose-invert rtl
                          prose-headings:mb-4 prose-headings:mt-6 
                          prose-h1:text-2xl prose-h1:font-bold
                          prose-h2:text-xl prose-h2:font-semibold
                          prose-p:my-4 
                          prose-ul:my-4 prose-ul:list-disc prose-ul:pr-6
                          prose-li:my-2
                          prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          [&>*:first-child]:mt-0"
                        >
                          {currentItem.writtenContent ? (
                            <div 
                              className="whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{ 
                                __html: marked(currentItem.writtenContent, {
                                  gfm: true,
                                  breaks: true
                                })
                              }} 
                            />
                          ) : (
                            <p className="text-muted-foreground text-center py-8">
                              النسخة المكتوبة غير متوفرة لهذا المحتوى
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          ملاحظاتك
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="min-h-[200px] border rounded-lg p-4">
                          <textarea 
                            className="w-full h-full min-h-[180px] bg-transparent resize-none focus:outline-none"
                            placeholder="اكتب ملاحظاتك هنا..."
                          />
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-[#00C896]/10 hover:text-[#00C896]"
                          >
                            حفظ الملاحظات
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : currentItem?.type === 'lab' ? (
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Beaker className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">تطبيق عملي</h2>
                </div>
                <div className="prose max-w-none">
                  {/* Lab content would go here */}
                </div>
              </Card>
            ) : (
              <Card className="p-6 mb-6">
                <div className="prose max-w-none">
                  {/* Text content would go here */}
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
