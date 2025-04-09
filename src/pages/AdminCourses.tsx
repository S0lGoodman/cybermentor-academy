import { useState, useEffect } from "react";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Upload, Video, Edit2, Trash2, GripVertical, FileText } from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { slugify } from "@/lib/utils";
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
import { useNavigate } from "react-router-dom";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import ReactMarkdown from "react-markdown";

const phases = [
  "المستوى الأول: المبادئ الأساسية",
  "المستوى الثاني: المواضيع المتوسطة",
  "المستوى الثالث: المواضيع المتقدمة",
  "الامتحان النهائي والشهادة"
] as const;

const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phase: z.enum(phases),
  slug: z.string(),
  thumbnail: z.instanceof(File).optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Course extends z.infer<typeof courseSchema> {
  id: string;
  status: "draft" | "published";
  order: number;
  thumbnail_url?: string;
}

interface LevelDescription {
  phase: string;
  description: string;
  learning_objectives: string;
}

interface ContentCounts {
  video: number;
  text: number;
  quiz: number;
  lab: number;
}

const SortableCourseCard = ({ course, onEdit, onDelete, onStatusToggle, contentCounts }: {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onStatusToggle: (courseId: string, currentStatus: 'draft' | 'published') => Promise<void>;
  contentCounts: Record<string, ContentCounts>;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const navigate = useNavigate();

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-4">
        <CardHeader className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="ml-8">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-medium">{course.name}</CardTitle>
              <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className={course.status === 'published' ? 'bg-[#00C896] hover:bg-[#00C896]/90' : ''}>
                {course.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              {contentCounts[course.id] && Object.entries(contentCounts[course.id] as ContentCounts).map(([type, count]) => (
                count > 0 && (
                  <Badge key={type} variant="outline" className="capitalize hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]">
                    {count} {type === 'text' ? 'Written' : type}{count !== 1 ? 's' : ''}
                  </Badge>
                )
              ))}
            </div>
            <CardDescription className="mt-1.5 whitespace-pre-wrap text-muted-foreground">
              {course.learning_objectives}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(course)}
              className="hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
              className="hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
            >
              <FileText className="h-4 w-4 mr-1" />
              Edit Content
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(course.id)}
              className="hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              variant={course.status === 'published' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onStatusToggle(course.id, course.status)}
              className={course.status === 'published'
                ? "bg-red-500 hover:bg-red-500/90 text-white"
                : "bg-[#00C896] hover:bg-[#00C896]/90 text-white"}
            >
              {course.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const AdminCourses = () => {
  const { setExpanded, setIsAdmin } = useSidebar();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<typeof phases[number]>(phases[0]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [contentCounts, setContentCounts] = useState<Record<string, ContentCounts>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [levelDescriptions, setLevelDescriptions] = useState<LevelDescription[]>([]);
  const [editingLevel, setEditingLevel] = useState<LevelDescription | null>(null);
  const [levelDialogOpen, setLevelDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      phase: selectedPhase,
      slug: ""
    },
  });

  useEffect(() => {
    // Only set isAdmin, don't force sidebar state
    setIsAdmin(true);
    fetchCourses();
    fetchLevelDescriptions();
  }, [setIsAdmin]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order');

      if (error) throw error;

      // Fetch content counts for each course
      const coursesWithCounts = await Promise.all((data || []).map(async (course) => {
        const { data: contents } = await supabase
          .from('contents')
          .select('type')
          .eq('course_id', course.id);

        const counts = {
          video: contents?.filter(c => c.type === 'video').length || 0,
          text: contents?.filter(c => c.type === 'text').length || 0,
          quiz: contents?.filter(c => c.type === 'quiz').length || 0,
          lab: contents?.filter(c => c.type === 'lab').length || 0,
        };

        setContentCounts(prev => ({
          ...prev,
          [course.id]: counts
        }));

        return course;
      }));

      setCourses(coursesWithCounts || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchLevelDescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('level_descriptions')
        .select('*')
        .order('phase');

      if (error) throw error;
      setLevelDescriptions(data || []);
    } catch (error) {
      console.error('Error fetching level descriptions:', error);
      toast.error('Failed to fetch level descriptions');
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = courses.findIndex((course) => course.id === active.id);
    const newIndex = courses.findIndex((course) => course.id === over.id);

    const reorderedCourses = arrayMove(courses, oldIndex, newIndex);
    setCourses(reorderedCourses);

    // Update orders in database
    try {
      const updates = reorderedCourses.map((course, index) => ({
        id: course.id,
        order: index
      }));

      const { error } = await supabase
        .from('courses')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating course orders:', error);
      toast.error('Failed to save course order');
      fetchCourses(); // Revert to original order
    }
  };

  const handleVideoUpload = async (courseId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${courseId}/intro-video.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(filePath);

      await supabase
        .from('courses')
        .update({ video_url: publicUrl })
        .eq('id', courseId);

      toast.success('Video uploaded successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    }
  };

  const onSubmit = async (values: CourseFormValues) => {
    try {
      const slug = slugify(values.name);
      const dataWithSlug = { ...values, slug };
      let thumbnail_url = undefined;

      // Handle thumbnail upload if provided
      if (values.thumbnail) {
        try {
          const fileExt = values.thumbnail.name.split('.').pop();
          const filePath = `${slug}/thumbnail.${fileExt}`;

          // First, try to remove any existing file with the same name
          try {
            await supabase.storage
              .from('course-thumbnails')
              .remove([filePath]);
          } catch (error) {
            // Ignore deletion errors as the file might not exist
            console.log('No existing thumbnail to delete');
          }

          // Upload the new thumbnail
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('course-thumbnails')
            .upload(filePath, values.thumbnail, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) {
            console.error('Error uploading thumbnail:', uploadError);
            throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('course-thumbnails')
            .getPublicUrl(filePath);

          thumbnail_url = publicUrl;
        } catch (uploadError: any) {
          console.error('Error handling thumbnail:', uploadError);
          toast.error(`Thumbnail upload failed: ${uploadError.message}`);
          return;
        }
      }

      if (selectedCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            ...dataWithSlug,
            thumbnail_url: thumbnail_url || selectedCourse.thumbnail_url
          })
          .eq('id', selectedCourse.id);

        if (error) {
          console.error('Error updating course:', error);
          toast.error(`Failed to update course: ${error.message}`);
          return;
        }
      } else {
        // Get the highest order number for the selected phase
        const { data: existingCourses } = await supabase
          .from('courses')
          .select('order')
          .eq('phase', values.phase)
          .order('order', { ascending: false })
          .limit(1);

        const newOrder = existingCourses && existingCourses.length > 0
          ? (existingCourses[0].order + 1)
          : 0;

        const { error } = await supabase
          .from('courses')
          .insert([{
            ...dataWithSlug,
            status: 'draft',
            order: newOrder,
            thumbnail_url
          }])
          .select();

        if (error) {
          console.error('Error creating course:', error);
          toast.error(`Failed to create course: ${error.message}`);
          return;
        }
      }

      form.reset();
      setSelectedCourse(null);
      fetchCourses();
      toast.success(selectedCourse ? 'Course updated successfully' : 'Course created successfully');
    } catch (error: any) {
      console.error('Unexpected error saving course:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    form.reset({
      name: course.name,
      description: course.description,
      phase: course.phase,
      slug: course.slug,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedCourse(null);
    form.reset({
      name: "",
      description: "",
      phase: selectedPhase,
      slug: ""
    });
    setDialogOpen(false);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleStatusToggle = async (courseId: string, currentStatus: 'draft' | 'published') => {
    try {
      const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;
      toast.success(`Course ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const handleLevelEdit = (level: LevelDescription) => {
    setEditingLevel(level);
    setLevelDialogOpen(true);
  };

  const handleLevelUpdate = async (values: LevelDescription) => {
    try {
      const { error } = await supabase
        .from('level_descriptions')
        .update({
          description: values.description,
          learning_objectives: values.learning_objectives
        })
        .eq('phase', values.phase);

      if (error) throw error;
      toast.success('Level description updated successfully');
      fetchLevelDescriptions();
      setLevelDialogOpen(false);
      setEditingLevel(null);
    } catch (error) {
      console.error('Error updating level description:', error);
      toast.error('Failed to update level description');
    }
  };

  const filteredCourses = courses
    .filter(course => course.phase === selectedPhase)
    .filter(course => selectedStatus === 'all' || course.status === selectedStatus);

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6 ml-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Course Management</h1>
                <p className="text-muted-foreground">
                  Create and manage pathway courses
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Level Descriptions
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                      <DialogTitle>Edit Level Descriptions</DialogTitle>
                      <DialogDescription>
                        Manage descriptions and learning objectives for each level
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {levelDescriptions.map((level) => (
                        <Card key={level.phase}>
                          <CardHeader>
                            <CardTitle>{level.phase}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Learning Objectives</h4>
                                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                                  {level.learning_objectives}
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleLevelEdit(level)}
                              >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
                      <DialogTitle>{selectedCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
                      <DialogDescription>
                        Fill in the course details below
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Enter a brief description of the course..."
                                  className="min-h-[100px] resize-y"
                                  dir="rtl"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phase</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select phase" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="المستوى الأول: المبادئ الأساسية">Level 1: Fundamentals</SelectItem>
                                  <SelectItem value="المستوى الثاني: المواضيع المتوسطة">Level 2: Intermediate</SelectItem>
                                  <SelectItem value="المستوى الثالث: المواضيع المتقدمة">Level 3: Advanced</SelectItem>
                                  <SelectItem value="الامتحان النهائي والشهادة">Final Exam</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="thumbnail"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel>Course Thumbnail</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  {selectedCourse?.thumbnail_url && (
                                    <div className="relative w-full h-48 overflow-hidden rounded-lg">
                                      <img
                                        src={selectedCourse.thumbnail_url}
                                        alt="Current thumbnail"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        onChange(file);
                                      }
                                    }}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full">
                          {selectedCourse ? 'Update Course' : 'Create Course'}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex space-x-2">
                {phases.map((phase) => (
                  <Button
                    key={phase}
                    variant={selectedPhase === phase ? "default" : "outline"}
                    onClick={() => setSelectedPhase(phase)}
                    className={`flex-1 ${
                      selectedPhase === phase
                        ? "bg-[#00C896] hover:bg-[#00C896]/90 text-white border-[#00C896]"
                        : "hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
                    }`}
                  >
                    {phase === "المستوى الأول: المبادئ الأساسية" && "Level 1: Fundamentals"}
                    {phase === "المستوى الثاني: المواضيع المتوسطة" && "Level 2: Intermediate"}
                    {phase === "المستوى الثالث: المواضيع المتقدمة" && "Level 3: Advanced"}
                    {phase === "الامتحان النهائي والشهادة" && "Final Exam"}
                  </Button>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={selectedStatus === 'all' ? "default" : "outline"}
                  onClick={() => setSelectedStatus('all')}
                  className={`${
                    selectedStatus === 'all'
                      ? "bg-[#00C896] hover:bg-[#00C896]/90 text-white border-[#00C896]"
                      : "hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
                  }`}
                >
                  All Courses
                </Button>
                <Button
                  variant={selectedStatus === 'published' ? "default" : "outline"}
                  onClick={() => setSelectedStatus('published')}
                  className={`${
                    selectedStatus === 'published'
                      ? "bg-[#00C896] hover:bg-[#00C896]/90 text-white border-[#00C896]"
                      : "hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
                  }`}
                >
                  Published
                </Button>
                <Button
                  variant={selectedStatus === 'draft' ? "default" : "outline"}
                  onClick={() => setSelectedStatus('draft')}
                  className={`${
                    selectedStatus === 'draft'
                      ? "bg-[#00C896] hover:bg-[#00C896]/90 text-white border-[#00C896]"
                      : "hover:bg-[#00C896]/10 hover:text-[#00C896] hover:border-[#00C896]"
                  }`}
                >
                  Unpublished
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredCourses.map(course => course.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredCourses.map((course) => (
                    <SortableCourseCard
                      key={course.id}
                      course={course}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusToggle={handleStatusToggle}
                      contentCounts={contentCounts}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};