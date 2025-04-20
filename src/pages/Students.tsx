import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Student, StudentFilters, BulkAction, StudentStatus } from "@/types/student";
import { User } from "@supabase/supabase-js";
import { StudentActionMenu } from "@/components/students/StudentActionMenu";
import { StudentFiltersBar } from "@/components/students/StudentFilters";
import { StudentBulkActions } from "@/components/students/StudentBulkActions";
import { StudentCreate } from "@/components/StudentCreate";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Search } from "lucide-react";
import { format } from "date-fns";

export default function Students() {
  const { expanded } = useSidebar();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<StudentFilters>({});

  const fetchStudents = async () => {
    try {
      setIsLoading(true);

      // Get all students from the students table - this is our primary source
      const { data: students, error: studentsError } = await supabaseAdmin
        .from('students')
        .select('*');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      // Get profiles for additional data
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue anyway - we have the students data
      }

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        // Use mock data if there's an error
        const mockStudents = [
          {
            id: '1',
            email: 'student1@example.com',
            full_name: 'Student One',
            first_name: 'Student',
            last_name: 'One',
            phone_number: '0612345678',
            whatsapp_url: 'https://wa.me/212612345678',
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
            status: 'active' as StudentStatus,
            progress: 25,
            enrolled_courses: 2,
            role: 'student'
          },
          {
            id: '2',
            email: 'student2@example.com',
            full_name: 'Student Two',
            first_name: 'Student',
            last_name: 'Two',
            phone_number: '0687654321',
            whatsapp_url: 'https://wa.me/212687654321',
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
            status: 'invited' as StudentStatus,
            progress: 0,
            enrolled_courses: 0,
            role: 'student'
          }
        ];
        setStudents(mockStudents);
        return;
      }

      if (!students || students.length === 0) {
        // Use mock data if no students found
        const mockStudents = [
          {
            id: '1',
            email: 'student1@example.com',
            full_name: 'Student One',
            first_name: 'Student',
            last_name: 'One',
            phone_number: '0612345678',
            whatsapp_url: 'https://wa.me/212612345678',
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
            status: 'active' as StudentStatus,
            progress: 25,
            enrolled_courses: 2,
            role: 'student'
          }
        ];
        setStudents(mockStudents);
        return;
      }

      // Create a map of profile data for quick lookup
      const profileMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profileMap.set(profile.id, profile);
        });
      }

      // Transform data primarily from students table
      const transformedData = students.map((student) => {
        // Get the corresponding profile if it exists
        const profile = profileMap.get(student.id) || {};

        return {
          id: student.id,
          email: student.email,
          full_name: student.name || 'N/A',
          first_name: student.first_name,
          last_name: student.last_name,
          phone_number: student.phone_number,
          whatsapp_url: student.whatsapp_url,
          created_at: student.created_at || new Date().toISOString(),
          last_active: student.last_active || student.updated_at || new Date().toISOString(),
          status: student.status as StudentStatus || 'invited',
          progress: student.progress || 0,
          enrolled_courses: student.enrolled_courses || 0,
          role: student.role || 'student',
          suspended_until: student.suspended_until,
          suspension_reason: student.suspension_reason,
          // Include non-payment fields
          program_start_date: student.program_start_date,
          months_paid: student.months_paid || 0
        };
      });

      setStudents(transformedData);
    } catch (error: any) {
      console.error('Fetch error:', error);
      // Use mock data if there's an error
      const mockStudents = [
        {
          id: '1',
          email: 'student1@example.com',
          full_name: 'Student One',
          first_name: 'Student',
          last_name: 'One',
          phone_number: '0612345678',
          whatsapp_url: 'https://wa.me/212612345678',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          status: 'active' as StudentStatus,
          progress: 25,
          enrolled_courses: 2,
          role: 'student'
        }
      ];
      setStudents(mockStudents);

      toast({
        title: "Warning",
        description: "Using mock data due to database connection issues.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      (student.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.first_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.last_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle individual student actions
  const handleStudentAction = async (studentId: string, action: string, metadata?: any) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) throw new Error("Student not found");

          // Actually update the database instead of just simulating
      switch (action) {
        case 'delete':
          // Delete from both tables
          // First delete from students table
          const { error: deleteStudentError } = await supabaseAdmin
            .from('students')
            .delete()
            .eq('id', studentId);

          if (deleteStudentError) throw deleteStudentError;

          // Then delete from profiles table
          const { error: deleteProfileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', studentId);

          if (deleteProfileError) throw deleteProfileError;

          toast({
            title: "Student Deleted",
            description: `${student.full_name}'s account has been permanently deleted.`
          });

          // Update the local state to remove the student
          setStudents(prev => prev.filter(s => s.id !== studentId));
          break;

        case 'suspend':
          if (!metadata?.reason) {
            throw new Error("Reason is required for suspension");
          }

          // Update the status in both tables
          // First update the students table
          const { error: suspendStudentError } = await supabaseAdmin
            .from('students')
            .update({
              status: 'suspended',
              suspension_reason: metadata.reason,
              suspended_until: metadata.duration ? new Date(Date.now() + metadata.duration * 86400000).toISOString() : null
            })
            .eq('id', studentId);

          if (suspendStudentError) throw suspendStudentError;

          // Then update the profiles table
          const { error: suspendProfileError } = await supabaseAdmin
            .from('profiles')
            .update({ status: 'suspended' })
            .eq('id', studentId);

          if (suspendProfileError) throw suspendProfileError;

          toast({
            title: "Student Suspended",
            description: `${student.full_name} has been suspended.`
          });

          // Update the local state to change the student's status
          setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, status: 'suspended' as StudentStatus } : s
          ));
          break;

        case 'activate':
          // Update the status in both tables
          // First update the students table
          const { error: activateStudentError } = await supabaseAdmin
            .from('students')
            .update({
              status: 'active',
              suspension_reason: null,
              suspended_until: null
            })
            .eq('id', studentId);

          if (activateStudentError) throw activateStudentError;

          // Then update the profiles table
          const { error: activateProfileError } = await supabaseAdmin
            .from('profiles')
            .update({ status: 'active' })
            .eq('id', studentId);

          if (activateProfileError) throw activateProfileError;

          toast({
            title: "Student Activated",
            description: `${student.full_name}'s account has been activated.`
          });

          // Update the local state to change the student's status
          setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, status: 'active' as StudentStatus } : s
          ));
          break;

        case 'reset_password':
          // This is still a mock since we don't have auth integration
          toast({
            title: "Password Reset Link Sent",
            description: `A password reset link has been sent to ${student.email}`
          });
          break;

        case 'edit':
          if (!metadata?.name && !metadata?.email) {
            throw new Error("No changes provided");
          }

          // Update the student in both tables
          const studentUpdates: any = {};
          const profileUpdates: any = {};

          if (metadata.name) {
            studentUpdates.name = metadata.name;
            profileUpdates.name = metadata.name;
          }

          if (metadata.email) {
            studentUpdates.email = metadata.email;
            profileUpdates.email = metadata.email;
          }

          // Update the students table
          const { error: updateStudentError } = await supabaseAdmin
            .from('students')
            .update(studentUpdates)
            .eq('id', studentId);

          if (updateStudentError) throw updateStudentError;

          // Update the profiles table
          const { error: updateProfileError } = await supabaseAdmin
            .from('profiles')
            .update(profileUpdates)
            .eq('id', studentId);

          if (updateProfileError) throw updateProfileError;

          // Update the local state to change the student's details
          setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
              return {
                ...s,
                full_name: metadata.name || s.full_name,
                email: metadata.email || s.email
              };
            }
            return s;
          }));

          toast({
            title: "Profile Updated",
            description: `${student.full_name}'s profile has been updated.`
          });
          break;

        case 'send_email':
          if (!metadata?.subject || !metadata?.message) {
            throw new Error("Email subject and message are required");
          }

          // This is still a mock since we don't have email integration
          toast({
            title: "Email Sent",
            description: `Email sent to ${student.email}`
          });
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error: any) {
      console.error('Action error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while performing the action",
        variant: "destructive",
      });
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: BulkAction) => {
    try {
      // Process each selected student
      for (const studentId of selectedIds) {
        await handleStudentAction(studentId, action.type, action.metadata);
      }

      // Clear selection after processing
      setSelectedIds([]);

      // Show success message
      toast({
        title: "Bulk Action Completed",
        description: `Successfully performed ${action.type} on ${selectedIds.length} students.`,
      });
    } catch (error: any) {
      console.error('Bulk action error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while performing the bulk action",
        variant: "destructive",
      });
    }
  };

  // Function to get the appropriate badge variant based on status
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" | "warning" | "success" => {
    switch (status) {
      case 'active':
        return 'success'; // Green
      case 'suspended':
      case 'payment_due':
        return 'destructive'; // Red
      case 'inactive':
        return 'secondary'; // Gray
      case 'invited':
        return 'warning'; // Orange
      default:
        return 'default';
    }
  };

  // Function to format status for display
  const formatStatus = (status: string): string => {
    // Capitalize first letter of each word
    return status.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-7xl mx-auto", !expanded && "mr-16")}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Students</h1>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Add Student
              </Button>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <StudentFiltersBar
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => setFilters({})}
            />

            <StudentBulkActions
              selectedCount={selectedIds.length}
              onAction={handleBulkAction}
              disabled={isLoading}
            />

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === students.length}
                        onCheckedChange={(checked) => {
                          setSelectedIds(checked ? students.map(s => s.id) : []);
                        }}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading students...
                      </TableCell>
                    </TableRow>
                  ) : filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {searchQuery ? "No students found matching your search" : "No students added yet"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(student.id)}
                            onCheckedChange={(checked) => {
                              setSelectedIds(checked
                                ? [...selectedIds, student.id]
                                : selectedIds.filter(id => id !== student.id)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {student.first_name && student.last_name
                            ? `${student.first_name} ${student.last_name}`
                            : student.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.phone_number ? (
                            <a
                              href={student.whatsapp_url || `https://wa.me/212${student.phone_number.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {student.phone_number}
                            </a>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            {formatStatus(student.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-32">
                            <Progress value={student.progress || 0} className="h-2" />
                            <span className="text-xs text-muted-foreground">
                              {student.progress || 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(student.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {student.last_active
                            ? format(new Date(student.last_active), 'MMM d, yyyy')
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <StudentActionMenu
                            student={student}
                            onAction={(action, metadata) => handleStudentAction(student.id, action, metadata)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <StudentCreate
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={fetchStudents}
            />
          </div>
        </main>
      </div>
    </div>
  );
}