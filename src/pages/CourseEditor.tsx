import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import MDEditor from '@uiw/react-md-editor';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Video, FileText, GripVertical, Trash2, Edit2, BrainCircuit, Beaker } from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Textarea } from "../components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

const contentTypes = ["video", "text", "quiz", "lab"] as const;

const contentSchema = z.object({
  title: z.string().min(3, "Content title must be at least 3 characters"),
  type: z.enum(contentTypes),
  content: z.string().min(1, "Content is required"),
});

type ContentFormValues = z.infer<typeof contentSchema>;

interface Content {
  id: string;
  title: string;
  type: typeof contentTypes[number];
  content: string;
  order: number;
  course_id: string;
}

const SortableContentCard = ({ content, onEdit, onDelete }: {
  content: Content;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: content.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getContentIcon = (type: typeof contentTypes[number]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "text":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <BrainCircuit className="h-4 w-4" />;
      case "lab":
        return <Beaker className="h-4 w-4" />;
    }
  };

  const getContentBadge = (type: typeof contentTypes[number]) => {
    const variants: Record<typeof contentTypes[number], { color: string; label: string }> = {
      video: { color: "bg-blue-500", label: "Video" },
      text: { color: "bg-green-500", label: "Written" },
      quiz: { color: "bg-purple-500", label: "Quiz" },
      lab: { color: "bg-orange-500", label: "Lab" },
    };
    const { color, label } = variants[type];
    return <Badge className={`${color} text-white`}>{label}</Badge>;
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-4">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="cursor-move" {...attributes} {...listeners}>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              {getContentIcon(content.type)}
              <span>{content.title}</span>
              {getContentBadge(content.type)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

const ContentForm = ({ form, onSubmit, selectedContent }: {
  form: UseFormReturn<ContentFormValues>;
  onSubmit: (values: ContentFormValues) => void;
  selectedContent: Content | null;
}) => {
  const [markdownValue, setMarkdownValue] = useState(form.getValues("content") || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMarkdownEditorOpen, setIsMarkdownEditorOpen] = useState(false);
  const contentType = form.watch("type");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // First verify authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;
      if (!session) {
        throw new Error('Not authenticated');
      }

      console.log('Auth status:', {
        isAuthenticated: !!session,
        user: session.user.id,
        email: session.user.email
      });

      // Generate file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      console.log('Uploading file:', fileName);

      // Simple direct upload
      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          name: uploadError.name,
          statusCode: uploadError?.statusCode
        });
        throw uploadError;
      }

      console.log('Upload success:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);
      
      form.setValue("content", publicUrl);
      toast.success('Video uploaded successfully');
    } catch (error: any) {
      console.error('Full error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue("content", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Written Content</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  {contentType === "video" ? (
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading video... {uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {field.value && !isUploading && (
                        <div className="mt-2">
                          <video
                            src={field.value}
                            controls
                            className="max-w-full h-auto rounded-lg border"
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 5GB. Supported formats: MP4, WebM, MOV.
                      </p>
                    </div>
                  ) : contentType === "text" ? (
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsMarkdownEditorOpen(true)}
                      >
                        {field.value ? 'Edit Content' : 'Add Content'}
                      </Button>
                      {field.value && (
                        <div className="mt-4 p-4 border rounded-lg">
                          <div data-color-mode="dark">
                            <MDEditor.Markdown source={field.value} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Textarea {...field} className="min-h-[200px]" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {selectedContent ? 'Update Content' : 'Add Content'}
          </Button>
        </form>
      </Form>

      <Dialog open={isMarkdownEditorOpen} onOpenChange={setIsMarkdownEditorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Use markdown to format your content
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div data-color-mode="dark" className="h-full">
              <MDEditor
                value={markdownValue}
                onChange={(value) => {
                  setMarkdownValue(value || "");
                  form.setValue("content", value || "");
                }}
                height="calc(70vh)"
                preview="live"
                visibleDragbar={true}
                hideToolbar={false}
                enableScroll={true}
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsMarkdownEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsMarkdownEditorOpen(false)}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CourseEditor = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { setExpanded, setIsAdmin } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const contentForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      type: "text",
      content: "",
    },
  });

  useEffect(() => {
    setExpanded(true);
    setIsAdmin(true);
    fetchCourseData();
  }, [setExpanded, setIsAdmin]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch contents
      const { data: contentsData, error: contentsError } = await supabase
        .from('contents')
        .select('*')
        .eq('course_id', courseId)
        .order('order');

      if (contentsError) throw contentsError;
      setContents(contentsData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleContentDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    try {
      const oldIndex = contents.findIndex(c => c.id === active.id);
      const newIndex = contents.findIndex(c => c.id === over.id);

      const reorderedContents = arrayMove([...contents], oldIndex, newIndex);
      const updatedContents = reorderedContents.map((content, index) => ({
        ...content,
        order: (index + 1) * 1000
      }));

      setContents(updatedContents);

      for (const content of updatedContents) {
        const { error } = await supabase
          .from('contents')
          .update({ order: content.order })
          .eq('id', content.id);

        if (error) throw error;
      }

      toast.success('Content order updated');
    } catch (error) {
      console.error('Error updating content order:', error);
      toast.error('Failed to save content order');
      fetchCourseData();
    }
  };

  const handleAddContent = async (values: ContentFormValues) => {
    try {
      const highestOrder = contents.reduce((max, c) => Math.max(max, c.order), 0);
      const newOrder = highestOrder + 1000;

      const { data, error } = await supabase
        .from('contents')
        .insert([{
          title: values.title,
          type: values.type,
          content: values.content,
          order: newOrder,
          course_id: courseId,
        }])
        .select()
        .single();

      if (error) throw error;

      setContents([...contents, data]);
      contentForm.reset();
      setIsContentDialogOpen(false);
      toast.success('Content added successfully');
    } catch (error: any) {
      console.error('Error adding content:', error);
      toast.error(error?.message || 'Failed to add content');
    }
  };

  const handleEditContent = async (values: ContentFormValues) => {
    if (!selectedContent) return;

    try {
      const { error } = await supabase
        .from('contents')
        .update({
          title: values.title,
          type: values.type,
          content: values.content
        })
        .eq('id', selectedContent.id);

      if (error) throw error;

      setContents(contents.map(c => 
        c.id === selectedContent.id ? { ...c, ...values } : c
      ));
      contentForm.reset();
      setSelectedContent(null);
      setIsContentDialogOpen(false);
      toast.success('Content updated successfully');
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast.error(error?.message || 'Failed to update content');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      setContents(contents.filter(c => c.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  // Add content type counts calculation
  const getContentCounts = () => {
    const counts = {
      video: contents.filter(c => c.type === 'video').length,
      text: contents.filter(c => c.type === 'text').length,
      quiz: contents.filter(c => c.type === 'quiz').length,
      lab: contents.filter(c => c.type === 'lab').length,
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6 ml-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/courses')}
                  className="mb-4"
                >
                  Back to Courses
                </Button>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold">{course.name}</h1>
                  <Button
                    variant={course.status === 'published' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={async () => {
                      try {
                        const newStatus = course.status === 'published' ? 'draft' : 'published';
                        const { error } = await supabase
                          .from('courses')
                          .update({ status: newStatus })
                          .eq('id', courseId);
                        
                        if (error) throw error;
                        
                        setCourse({ ...course, status: newStatus });
                        toast.success(`Course ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
                      } catch (error) {
                        console.error('Error updating course status:', error);
                        toast.error('Failed to update course status');
                      }
                    }}
                  >
                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                </div>
                <div className="flex gap-2 mb-4">
                  {Object.entries(getContentCounts()).map(([type, count]) => (
                    count > 0 && (
                      <Badge key={type} variant="secondary" className="capitalize">
                        {count} {type === 'text' ? 'Written' : type}{count !== 1 ? 's' : ''}
                      </Badge>
                    )
                  ))}
                </div>
                <p className="text-muted-foreground">
                  Edit course content
                </p>
              </div>
              
              <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedContent ? 'Edit Content' : 'Add New Content'}
                    </DialogTitle>
                    <DialogDescription>
                      Fill in the content details below
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex-1 min-h-0 overflow-y-auto">
                    <ContentForm
                      form={contentForm}
                      onSubmit={selectedContent ? handleEditContent : handleAddContent}
                      selectedContent={selectedContent}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleContentDragEnd}
            >
              <SortableContext
                items={contents.map(content => content.id)}
                strategy={verticalListSortingStrategy}
              >
                {contents
                  .sort((a, b) => a.order - b.order)
                  .map((content) => (
                    <SortableContentCard
                      key={content.id}
                      content={content}
                      onEdit={() => {
                        setSelectedContent(content);
                        contentForm.reset(content);
                        setIsContentDialogOpen(true);
                      }}
                      onDelete={() => handleDeleteContent(content.id)}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseEditor; 