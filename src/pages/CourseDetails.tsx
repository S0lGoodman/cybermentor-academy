import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Removed unused Tabs imports
import {
  Clock, // Keep unused icons for now, might be needed later
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
  GraduationCap,
  Loader2
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { marked } from 'marked';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSidebar } from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get user

// --- Define Interfaces for fetched data ---
interface ContentItem {
  id: string;
  title: string;
  duration: string | null;
  type: "video" | "text" | "lab" | "quiz";
  completed: boolean;
  locked: boolean; // Logic for locking needs implementation
  description?: string | null;
  content_url?: string | null; // Keep for potential other uses, but video uses 'content'
  content?: string | null; // Added for clarity, holds the full video URL
  written_content?: string | null;
  order: number;
  // module_id is removed as there's no modules table
}

// Removed Module interface

interface CourseDetailsData {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  slug: string;
  thumbnail_url?: string | null;
  // Changed from modules: Module[] to contentItems: ContentItem[]
  contentItems: ContentItem[];
}
// --- End Interfaces ---


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
  const { phaseId, courseSlug } = useParams<{ phaseId: string; courseSlug: string }>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); // Changed ref type
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);

  const [courseDetails, setCourseDetails] = useState<CourseDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, boolean>>({});
  const [noteText, setNoteText] = useState(""); // State for note text
  const [isNoteLoading, setIsNoteLoading] = useState(false); // State for loading note
  const [isNoteSaving, setIsNoteSaving] = useState(false); // State for saving note
  const { user } = useAuth(); // Get user from context

  // --- Fetch Course Details Function (Revised) ---
  const fetchCourseDetails = async () => {
    if (!courseSlug) {
      setError("Course slug not found in URL.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`Fetching details for course slug: ${courseSlug}`);

    try {
      // 1. Fetch Course Info
      console.log("Step 1: Fetching course info...");
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id, name, description, phase, slug, thumbnail_url')
        .eq('slug', courseSlug)
        .single();

      if (courseError) throw new Error(`Failed to fetch course: ${courseError.message}`);
      if (!courseData) throw new Error("Course not found.");
      console.log("Step 1 Success: Fetched Course Data:", courseData);

      // 2. Fetch Content Items for the course (No modules table involved)
      console.log(`Step 2: Fetching contents for course ID: ${courseData.id}...`);
      const { data: contentsData, error: contentsError } = await supabase
        .from('contents')
        .select('*') // Select all content fields
        .eq('course_id', courseData.id)
        .order('order', { ascending: true }); // Order directly by content order

      if (contentsError) throw new Error(`Failed to fetch course content: ${contentsError.message}`);
      console.log("Step 2 Success: Fetched Contents Data:", contentsData);

      // 3. Fetch User Progress
      console.log("Step 3: Fetching user progress...");
      const contentIds = contentsData?.map(c => c.id) || [];
      let fetchedUserProgress: Record<string, boolean> = {};
      if (contentIds.length > 0) {
         // Use the user from useAuth context if available, otherwise try fetching
         const currentUser = user || (await supabase.auth.getUser()).data.user;
         if (currentUser) {
            console.log(`Fetching progress for user ${currentUser.id} and ${contentIds.length} content items...`);
            const { data: progressData, error: progressError } = await supabase
              .from('progress_tracking') // Corrected table name based on schema image
              .select('content_id, completed')
              .eq('user_id', currentUser.id)
              .in('content_id', contentIds);

            if (progressError) console.warn("Could not fetch user progress:", progressError.message);
            else if (progressData) {
               fetchedUserProgress = progressData.reduce((acc, item) => {
                  acc[item.content_id] = item.completed;
                  return acc;
               }, {} as Record<string, boolean>);
               console.log("Step 3 Success: Fetched User Progress:", fetchedUserProgress);
            } else console.log("Step 3: No progress data found.");
         } else console.warn("Step 3: User not logged in.");
      } else console.log("Step 3: No content items found.");
      setUserProgress(fetchedUserProgress);

      // 4. Structure the data (Simpler: just map contents)
      console.log("Step 4: Structuring fetched data...");
      const structuredContentItems: ContentItem[] = (contentsData || []).map(content => ({
        id: content.id,
        title: content.title || 'Unnamed Content',
        duration: content.duration,
        type: content.type as ContentItem['type'],
        completed: fetchedUserProgress[content.id] || false,
        locked: false, // TODO: Implement locking logic
        description: content.description,
        content_url: content.content_url, // Keep mapping if needed elsewhere
        content: content.content, // Map the content field holding the URL
        written_content: content.written_content,
        order: content.order ?? 0,
        // module_id is removed
      }));
      console.log("Step 4 Success: Structured Content Items:", structuredContentItems);

      setCourseDetails({
        id: courseData.id,
        name: courseData.name,
        description: courseData.description,
        phase: courseData.phase,
        slug: courseData.slug,
        thumbnail_url: courseData.thumbnail_url,
        contentItems: structuredContentItems, // Assign the flat list
      });
      console.log("Successfully set courseDetails state.");

    } catch (err: any) {
      console.error("Error during fetchCourseDetails execution:", err);
      setError(err.message || "An unexpected error occurred.");
      toast.error("Failed to load course details. Check console.");
    } finally {
      setLoading(false);
      console.log("Finished fetchCourseDetails attempt.");
    }
  };
  // --- End Fetch Function ---

  useEffect(() => {
    fetchCourseDetails();
  }, [courseSlug]);

  // --- Update calculations and logic ---
  const contentItems = courseDetails?.contentItems || []; // Use flat list

  const totalItems = contentItems.length;
  const completedItems = contentItems.filter(item => item.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const currentItem = contentItems.find(item => item.id === currentItemId);

  // Set initial content item
  useEffect(() => {
    if (!loading && !error && !currentItemId && contentItems.length > 0) {
      console.log("Setting initial content item:", contentItems[0].id);
      setCurrentItemId(contentItems[0].id);
    } else if (!loading && !error && contentItems.length === 0) {
       console.log("No content items found for this course.");
    }
  }, [loading, error, currentItemId, contentItems]);

  // Save last accessed content
  useEffect(() => {
    if (currentItem && courseDetails) {
      const lastContent = {
        courseId: courseDetails.id,
        courseTitle: courseDetails.name,
        courseImage: courseDetails.thumbnail_url || "/placeholder.svg",
        lastUnit: currentItem.title,
        progress: progress,
        phaseId: phaseId,
        slug: courseDetails.slug
      };
      localStorage.setItem('lastLearningContent', JSON.stringify(lastContent));
    }
  }, [currentItem, courseDetails, progress, phaseId]);

  // Load/Save video progress (remains mostly the same)
  useEffect(() => {
    if (currentItem?.type === 'video') {
      const savedProgress = localStorage.getItem(`video-progress-${currentItemId}`);
      if (savedProgress) {
        setSavedTime(parseFloat(savedProgress));
        setShowResumePrompt(true);
      } else {
         setShowResumePrompt(false);
         setSavedTime(0);
      }
    } else {
       setShowResumePrompt(false);
    }
  }, [currentItemId, currentItem?.type]);


  // --- Fetch Note Function ---
  const fetchNote = async (contentId: string) => {
    if (!user || !contentId) {
      setNoteText(""); // Clear note if no user/contentId
      return;
    }
    setIsNoteLoading(true);
    setNoteText(""); // Clear previous note while loading
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('note_text')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116: row not found (expected if no note yet)
        console.error("Error fetching note:", error);
        toast.error("حدث خطأ أثناء جلب الملاحظة.");
      } else {
        setNoteText(data?.note_text || ""); // Set note text or empty string if not found
      }
    } catch (err) {
      console.error("Unexpected error fetching note:", err);
      toast.error("حدث خطأ غير متوقع أثناء جلب الملاحظة.");
    } finally {
      setIsNoteLoading(false);
    }
  };

  // Fetch note when current item changes
  useEffect(() => {
    if (currentItemId && user) { // Ensure user is available too
      fetchNote(currentItemId);
    } else {
      setNoteText(""); // Clear note text if no item is selected or user logs out
    }
  }, [currentItemId, user]); // Depend on user as well


  // --- Updated Video Progress Handling ---
  const handleTimeUpdate = () => {
    if (videoRef.current && currentItemId) {
      localStorage.setItem(`video-progress-${currentItemId}`, videoRef.current.currentTime.toString());
    }
  };

  // Attach timeupdate listener
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && currentItem?.type === 'video') {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      // Set initial time if resuming
      if (showResumePrompt && savedTime > 0) {
         // Attempt to set currentTime once metadata is loaded
         const setInitialTime = () => {
            if (videoElement.readyState >= 1) { // HAVE_METADATA or higher
               videoElement.currentTime = savedTime;
            }
         };
         if (videoElement.readyState >= 1) {
            setInitialTime();
         } else {
            videoElement.addEventListener('loadedmetadata', setInitialTime, { once: true });
         }
      }

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [currentItemId, currentItem?.type, showResumePrompt, savedTime]); // Added dependencies


  const handleResume = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime; // Directly set currentTime
      videoRef.current.play(); // Optionally start playing
    }
    setShowResumePrompt(false);
  };
  // --- End Updated Video Progress Handling ---


  // --- Save Note Function ---
  const handleSaveNote = async () => {
    if (!user || !currentItemId) {
      toast.error("لا يمكن حفظ الملاحظة. المستخدم غير مسجل أو لم يتم تحديد عنصر.");
      return;
    }
    setIsNoteSaving(true);
    try {
      const { error } = await supabase
        .from('user_notes')
        .upsert({
          user_id: user.id,
          content_id: currentItemId,
          note_text: noteText,
          // created_at is handled by default value
          updated_at: new Date().toISOString(), // Explicitly set updated_at for upsert
        }, {
          onConflict: 'user_id, content_id' // Specify conflict target for upsert
        });

      if (error) {
        throw error;
      }
      toast.success("تم حفظ الملاحظة بنجاح!");
    } catch (err: any) {
      console.error("Error saving note:", err);
      toast.error(`فشل حفظ الملاحظة: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsNoteSaving(false);
    }
  };
  // --- End Save Note Function ---


  // Removed currentModule calculation

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#00C896]" />
        <p className="ml-4 text-muted-foreground">جاري تحميل محتوى الدورة...</p>
      </div>
    );
  }

  if (error || !courseDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6" dir="rtl">
        <h2 className="text-xl font-semibold text-destructive mb-4">فشل تحميل الدورة</h2>
        <p className="text-muted-foreground mb-6">{error || "تعذر العثور على تفاصيل الدورة."}</p>
        <Button asChild variant="outline">
          <Link to="/student/courses">العودة إلى الدورات</Link>
        </Button>
      </div>
    );
  }
  // --- End Loading and Error States ---

  return (
    <div className="min-h-screen flex bg-background" dir="rtl">
      {/* Course Content Sidebar (Revised for flat list) */}
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
            {contentItems.length === 0 && !loading && (
               <p className="text-muted-foreground p-4 text-center">لم يتم العثور على محتوى لهذه الدورة بعد.</p>
            )}
            {/* Render flat list of items */}
            <div className="space-y-1">
              {contentItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => !item.locked && setCurrentItemId(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded text-sm text-start",
                    currentItemId === item.id && "bg-[#00C896]/10 text-[#00C896]",
                    item.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-[#00C896]/10 hover:text-[#00C896]"
                  )}
                  disabled={item.locked}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ContentTypeIcon type={item.type} />
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.locked && <LockIcon className="w-4 h-4" />}
                    {item.completed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {item.duration && <span className="text-xs text-muted-foreground">{item.duration}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area (remains largely the same, uses currentItem) */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Breadcrumb Navigation */}
        <div className="h-12 border-b bg-background/95 backdrop-blur flex items-center px-4">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/student/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Home className="w-4 h-4" /> <span>لوحة التحكم</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <Link to="/student/courses" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <GraduationCap className="w-4 h-4" /> <span>الدورات</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <Link to={`/student/courses/${phaseId}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <GraduationCap className="w-4 h-4" /> <span>{courseDetails.phase || phaseId}</span>
            </Link>
            <ChevronLeftIcon className="w-4 h-4 mx-1" />
            <span className="text-foreground font-medium">{courseDetails.name}</span>
          </nav>
        </div>

        <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
          <Button variant="ghost" size="icon" className="hover:bg-[#00C896]/10 hover:text-[#00C896]" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <div className="flex items-center gap-4">
            {currentItem && (
              <Badge variant="outline" className="text-xs capitalize">
                محتوى {currentItem.type === 'video' ? 'فيديو' : currentItem.type === 'text' ? 'نصي' : currentItem.type === 'lab' ? 'معمل' : 'اختبار'}
              </Badge>
            )}
            <Button variant="outline" size="sm" className="hover:bg-[#00C896]/10 hover:text-[#00C896]">
              السابق {/* TODO: Implement Previous logic */}
            </Button>
            <Button size="sm" className="bg-[#00C896] hover:bg-[#00C896]/90 text-white">
              التالي / وضع علامة كمكتمل {/* TODO: Implement Next logic */}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            <Helmet>
              <title>{currentItem?.title || courseDetails.name} | CyberMentor Academy</title>
            </Helmet>

            {/* Content Display Area */}
            {!currentItem ? (
               <div className="text-center py-10 text-muted-foreground">
                  الرجاء تحديد عنصر من قائمة محتوى الدورة للبدء.
               </div>
            ) : currentItem.type === 'video' ? (
              <>
                <h1 className="text-2xl font-bold mb-4">{currentItem.title}</h1>
                <div className="relative">
                  <div className="aspect-video rounded-lg mb-6 overflow-hidden bg-muted">
                    {/* Check the correct field holding the URL */}
                    {currentItem.content ? (
                       <video
                         ref={videoRef}
                         className="w-full h-full"
                         // Use the 'content' field directly as it contains the full URL from the DB
                         src={currentItem.content || ''}
                         title={currentItem.title}
                         controls // Add browser controls
                         playsInline // Good practice for mobile
                       />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-muted-foreground">رابط الفيديو غير متوفر.</div>
                    )}
                  </div>
                  {/* Check the correct field for the resume prompt */}
                  {showResumePrompt && currentItem.content && (
                    <div className="absolute top-4 right-4 bg-background/95 p-4 rounded-lg shadow-lg border flex items-center gap-4 z-10">
                      <p className="text-sm">استئناف من {Math.floor(savedTime / 60)}:{Math.floor(savedTime % 60).toString().padStart(2, '0')}؟</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-[#00C896] hover:bg-[#00C896]/90 text-white" onClick={handleResume}>استئناف</Button>
                        <Button size="sm" variant="outline" className="hover:bg-[#00C896]/10 hover:text-[#00C896]" onClick={() => setShowResumePrompt(false)}>إعادة البدء</Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div className="flex justify-end mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="bg-background hover:bg-[#00C896] hover:text-white transition-colors">
                        <FileText className="w-4 h-4 ml-2" /> عرض كل الملاحظات {/* Adjusted margin for RTL */}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader><DialogTitle>ملاحظاتك على - {currentItem?.title || 'العنصر الحالي'}</DialogTitle></DialogHeader>
                      {/* Display the fetched note for the current item */}
                      <ScrollArea className="max-h-[60vh] p-1"> {/* Added ScrollArea */}
                        <Card className="p-4 min-h-[100px]">
                          {isNoteLoading ? (
                            <div className="flex items-center justify-center h-full">
                              <Loader2 className="h-6 w-6 animate-spin text-[#00C896]" />
                            </div>
                          ) : noteText ? (
                            <p className="whitespace-pre-wrap">{noteText}</p>
                          ) : (
                            <p className="text-muted-foreground text-center">لا توجد ملاحظات محفوظة لهذا العنصر.</p>
                          )}
                        </Card>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Removed Tabs component as only Notes remain */}
                <Card className="mb-6"> {/* Added mb-6 here */}
                  <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5" /> ملاحظاتك</CardTitle></CardHeader>
                  <CardContent>
                    <div className="min-h-[200px] border rounded-lg p-4 relative">
                      {/* Loading indicator */}
                      {isNoteLoading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
                          <Loader2 className="h-6 w-6 animate-spin text-[#00C896]" />
                        </div>
                      )}
                      <textarea
                        className="w-full h-full min-h-[180px] bg-transparent resize-none focus:outline-none disabled:opacity-50"
                        placeholder="اكتب ملاحظاتك هنا..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        disabled={isNoteLoading || isNoteSaving} // Disable while loading/saving
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-[#00C896]/10 hover:text-[#00C896] disabled:opacity-50 min-w-[100px]" // Added min-width
                        onClick={handleSaveNote} // Attach save handler
                        disabled={isNoteLoading || isNoteSaving} // Disable while loading/saving
                      >
                        {isNoteSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          "حفظ الملاحظات"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : currentItem.type === 'lab' ? (
              <Card className="p-6 mb-6">
                <div className="flex items-center gap-2 mb-4"><Beaker className="w-5 h-5" /><h1 className="text-2xl font-bold">معمل: {currentItem.title}</h1></div>
                <div className="prose max-w-none dark:prose-invert">
                  {currentItem.written_content ? (
                     <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: marked(currentItem.written_content, { gfm: true, breaks: true }) }} />
                  ) : ( <p className="text-muted-foreground">تعليمات المعمل غير متوفرة.</p> )}
                  {currentItem.content_url && (
                     <Button asChild className="mt-4"><a href={currentItem.content_url} target="_blank" rel="noopener noreferrer">الذهاب إلى بيئة المعمل</a></Button>
                  )}
                </div>
              </Card>
            ) : currentItem.type === 'text' ? (
               <Card className="p-6 mb-6">
                 <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5" /><h1 className="text-2xl font-bold">{currentItem.title}</h1></div>
                 <div className="prose max-w-none dark:prose-invert">
                   {currentItem.written_content ? (
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: marked(currentItem.written_content, { gfm: true, breaks: true }) }} />
                   ) : ( <p className="text-muted-foreground">المحتوى النصي غير متوفر.</p> )}
                 </div>
               </Card>
            ) : currentItem.type === 'quiz' ? (
               <Card className="p-6 mb-6">
                 <div className="flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5" /><h1 className="text-2xl font-bold">اختبار: {currentItem.title}</h1></div>
                 <div className="prose max-w-none dark:prose-invert">
                   <p className="text-muted-foreground">سيظهر محتوى الاختبار هنا...</p> {/* TODO: Implement Quiz display */}
                   {currentItem.content_url && (
                      <Button asChild className="mt-4"><a href={currentItem.content_url} target="_blank" rel="noopener noreferrer">بدء الاختبار</a></Button>
                   )}
                 </div>
               </Card>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};
