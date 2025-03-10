import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  phase: z.string().min(1, "Please select a phase"),
  duration: z.string().min(1, "Please enter the course duration"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  prerequisites: z.string().optional(),
  thumbnail: z.instanceof(File).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreate?: (data: CourseFormData) => void;
}

export function CourseCreateModal({ open, onOpenChange, onCourseCreate }: CourseCreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      phase: "",
      difficulty: "",
    }
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      // Here you would typically make an API call to create the course
      console.log("Creating course:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the parent handler
      onCourseCreate?.(data);
      
      // Show success message
      toast.success("Course created successfully!");
      
      // Reset form and close modal
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  // Update the select fields using setValue
  const handlePhaseChange = (value: string) => {
    setValue("phase", value, { shouldValidate: true });
  };

  const handleDifficultyChange = (value: string) => {
    setValue("difficulty", value, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Add a new course to your curriculum. Fill in the course details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="Enter course name"
                {...register("name")}
                className="mt-1.5"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                {...register("description")}
                className="mt-1.5"
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phase">Phase</Label>
                <Select onValueChange={handlePhaseChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level1">Level 1</SelectItem>
                    <SelectItem value="level2">Level 2</SelectItem>
                    <SelectItem value="level3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
                {errors.phase && (
                  <p className="text-sm text-red-500 mt-1">{errors.phase.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.difficulty && (
                  <p className="text-sm text-red-500 mt-1">{errors.difficulty.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 6 weeks"
                {...register("duration")}
                className="mt-1.5"
              />
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
              <Textarea
                id="prerequisites"
                placeholder="Enter course prerequisites"
                {...register("prerequisites")}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="thumbnail">Course Thumbnail (Optional)</Label>
              <Input
                id="thumbnail"
                type="file"
                accept="image/*"
                {...register("thumbnail")}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 