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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Upload, Video, Edit2, Trash2 } from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { slugify } from "@/lib/utils";

// Form validation schema
const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phase: z.enum([
    "المستوى الأول: المبادئ الأساسية",
    "المستوى الثاني: المواضيع المتوسطة",
    "المستوى الثالث: المواضيع المتقدمة",
    "الامتحان النهائي والشهادة"
  ]),
  order: z.number().min(0, "Order must be a positive number"),
  slug: z.string(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Course extends CourseFormValues {
  id: string;
  status: "draft" | "active";
  video_url?: string;
}

export const AdminCourses = () => {
  const { setExpanded, setIsAdmin } = useSidebar();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      phase: "المستوى الأول: المبادئ الأساسية",
      order: 0,
      slug: ""
    },
  });

  useEffect(() => {
    setExpanded(true);
    setIsAdmin(true);
    fetchCourses();
  }, [setExpanded, setIsAdmin]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('phase')
        .order('order');

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (courseId: string, file: File) => {
    try {
      setUploading(true);
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
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: CourseFormValues) => {
    try {
      // Generate slug from name
      const slug = slugify(values.name);
      const dataWithSlug = { ...values, slug };

      if (isEditing && selectedCourse) {
        const { data, error } = await supabase
          .from('courses')
          .update(dataWithSlug)
          .eq('id', selectedCourse.id);

        if (error) {
          console.error('Error updating course:', error);
          toast.error(`Failed to update course: ${error.message}`);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert([{ ...dataWithSlug, status: 'draft' }])
          .select();

        if (error) {
          console.error('Error creating course:', error);
          toast.error(`Failed to create course: ${error.message}`);
          return;
        }
      }

      form.reset();
      setIsEditing(false);
      setSelectedCourse(null);
      fetchCourses();
      toast.success(isEditing ? 'Course updated successfully' : 'Course created successfully');
    } catch (error) {
      console.error('Unexpected error saving course:', error);
      toast.error('An unexpected error occurred while saving the course');
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    form.reset({
      name: course.name,
      description: course.description,
      phase: course.phase,
      order: course.order,
      slug: course.slug,
    });
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

  const handleStatusToggle = async (courseId: string, currentStatus: 'draft' | 'active') => {
    try {
      const newStatus = currentStatus === 'draft' ? 'active' : 'draft';
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;
      toast.success(`Course ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

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
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</DialogTitle>
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
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
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  value={field.value || 0}
                                  onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        {isEditing ? 'Update Course' : 'Create Course'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">Active Courses</TabsTrigger>
                <TabsTrigger value="draft">Draft Courses</TabsTrigger>
              </TabsList>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <TabsContent value="active">
                    <div className="grid gap-6">
                      {[
                        "المستوى الأول: المبادئ الأساسية",
                        "المستوى الثاني: المواضيع المتوسطة",
                        "المستوى الثالث: المواضيع المتقدمة",
                        "الامتحان النهائي والشهادة"
                      ].map((phase) => {
                        const phaseCourses = courses.filter(
                          course => course.status === 'active' && course.phase === phase
                        );
                        
                        if (phaseCourses.length === 0) return null;
                        
                        return (
                          <div key={phase}>
                            <h2 className="text-lg font-semibold mb-4">
                              {phase === "المستوى الأول: المبادئ الأساسية" && "Level 1: Fundamentals"}
                              {phase === "المستوى الثاني: المواضيع المتوسطة" && "Level 2: Intermediate"}
                              {phase === "المستوى الثالث: المواضيع المتقدمة" && "Level 3: Advanced"}
                              {phase === "الامتحان النهائي والشهادة" && "Final Exam"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {phaseCourses.map(course => (
                                <CourseCard
                                  key={course.id}
                                  course={course}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onVideoUpload={handleVideoUpload}
                                  onStatusToggle={handleStatusToggle}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="draft">
                    <div className="grid gap-6">
                      {[
                        "المستوى الأول: المبادئ الأساسية",
                        "المستوى الثاني: المواضيع المتوسطة",
                        "المستوى الثالث: المواضيع المتقدمة",
                        "الامتحان النهائي والشهادة"
                      ].map((phase) => {
                        const phaseCourses = courses.filter(
                          course => course.status === 'draft' && course.phase === phase
                        );
                        
                        if (phaseCourses.length === 0) return null;
                        
                        return (
                          <div key={phase}>
                            <h2 className="text-lg font-semibold mb-4">
                              {phase === "المستوى الأول: المبادئ الأساسية" && "Level 1: Fundamentals"}
                              {phase === "المستوى الثاني: المواضيع المتوسطة" && "Level 2: Intermediate"}
                              {phase === "المستوى الثالث: المواضيع المتقدمة" && "Level 3: Advanced"}
                              {phase === "الامتحان النهائي والشهادة" && "Final Exam"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {phaseCourses.map(course => (
                                <CourseCard
                                  key={course.id}
                                  course={course}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onVideoUpload={handleVideoUpload}
                                  onStatusToggle={handleStatusToggle}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onVideoUpload,
  onStatusToggle,
}: {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onVideoUpload: (courseId: string, file: File) => Promise<void>;
  onStatusToggle: (courseId: string, currentStatus: 'draft' | 'active') => Promise<void>;
}) => {
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onVideoUpload(course.id, file);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-medium">{course.name}</CardTitle>
              <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                {course.status}
              </Badge>
            </div>
            <CardDescription className="mt-1.5">
              {course.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>📊 Phase {course.phase}</span>
              <span>🔢 Order: {course.order}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(course)}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(course.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id={`video-${course.id}`}
              />
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <label htmlFor={`video-${course.id}`}>
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Video
                </label>
              </Button>
            </div>
            <Button
              variant={course.status === 'active' ? 'destructive' : 'default'}
              size="sm"
              onClick={() => onStatusToggle(course.id, course.status)}
            >
              {course.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
          
          {course.video_url && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>Video uploaded</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 