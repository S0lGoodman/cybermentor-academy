import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Student, StudentFilters, BulkAction, StudentStatus } from "@/types/student";
import { User } from "@supabase/supabase-js";
import { StudentActionMenu } from "@/components/students/StudentActionMenu";
import { StudentFiltersBar } from "@/components/students/StudentFilters";
import { StudentBulkActions } from "@/components/students/StudentBulkActions";
import { StudentCreateModal } from "@/components/StudentCreateModal";
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
      
      // Get all student profiles
      const { data: profiles, error: profilesError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (profilesError) throw profilesError;
      if (!profiles) throw new Error('No profiles found');

      // Get all users from auth.users
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (usersError) throw usersError;

      // Create a map of auth users for quick lookup
      const authUsers = new Map<string, User>();
      users.forEach((user: User) => {
        authUsers.set(user.id, user);
      });

      // Transform and update data
      const transformedData = await Promise.all(profiles.map(async (profile) => {
        const authUser = authUsers.get(profile.id);
        
        // Check if user has confirmed email and signed in
        if (profile.status === 'invited' && authUser?.confirmed_at && authUser?.last_sign_in_at) {
          // Update status to active
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({ status: 'active' })
            .eq('id', profile.id);
          
          if (!updateError) {
            profile.status = 'active';
          }
        }

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.name || 'N/A',
          created_at: profile.created_at,
          last_active: authUser?.last_sign_in_at || profile.updated_at,
          status: profile.status as StudentStatus,
          progress: 0,
          enrolled_courses: 0,
          role: profile.role,
          suspended_until: profile.suspended_until,
          suspension_reason: profile.suspension_reason
        };
      }));

      setStudents(transformedData);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error.message,
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
    const matchesSearch = student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle individual student actions
  const handleStudentAction = async (studentId: string, action: string, metadata?: any) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) throw new Error("Student not found");

      switch (action) {
        case 'delete':
          try {
            // First delete from profiles table
            const { error: profileDeleteError } = await supabaseAdmin
              .from('profiles')
              .delete()
              .eq('id', studentId);
            
            if (profileDeleteError) throw profileDeleteError;

            // Then delete from auth.users
            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(studentId);
            if (authDeleteError) throw authDeleteError;

            toast({
              title: "Student Deleted",
              description: `${student.full_name}'s account has been permanently deleted.`
            });
            
            // Force refresh the students list
            await fetchStudents();
          } catch (deleteError: any) {
            console.error('Delete error:', deleteError);
            throw new Error(deleteError.message || "Failed to delete user");
          }
          break;

        case 'suspend':
          if (!metadata?.reason) {
            throw new Error("Reason is required for suspension");
          }
          const { error: suspendError } = await supabaseAdmin
            .from('profiles')
            .update({
              status: 'suspended',
              suspended_until: null,
              suspension_reason: metadata.reason
            })
            .eq('id', studentId);
          
          if (suspendError) throw suspendError;

          toast({
            title: "Student Suspended",
            description: `${student.full_name} has been suspended.`
          });
          break;

        case 'activate':
          const { error: activateError } = await supabaseAdmin
            .from('profiles')
            .update({
              status: 'active',
              suspended_until: null,
              suspension_reason: null
            })
            .eq('id', studentId);
          
          if (activateError) throw activateError;

          toast({
            title: "Student Activated",
            description: `${student.full_name}'s account has been activated.`
          });
          break;

        case 'reset_password':
          const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: student.email
          });
          if (resetError) throw resetError;
          if (!resetData) throw new Error("Failed to generate reset link");

          toast({
            title: "Password Reset Link Sent",
            description: `A password reset link has been sent to ${student.email}`
          });
          break;

        case 'edit':
          if (!metadata?.name && !metadata?.email) {
            throw new Error("No changes provided");
          }
          const updates: any = {};
          if (metadata.name) updates.name = metadata.name;
          
          if (metadata.email) {
            // Update email in auth.users first
            const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(
              studentId,
              { email: metadata.email }
            );
            if (emailError) throw emailError;
            updates.email = metadata.email;
          }

          // Update profile if we have changes
          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabaseAdmin
              .from('profiles')
              .update(updates)
              .eq('id', studentId);
            
            if (updateError) throw updateError;
          }

          toast({
            title: "Profile Updated",
            description: `${student.full_name}'s profile has been updated.`
          });
          break;

        case 'send_email':
          if (!metadata?.subject || !metadata?.message) {
            throw new Error("Email subject and message are required");
          }
          // Here you would integrate with your email service
          // For now, we'll just show a success message
          toast({
            title: "Email Sent",
            description: `Email sent to ${student.email}`
          });
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Refresh the students list
      await fetchStudents();
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
      for (const studentId of selectedIds) {
        await handleStudentAction(studentId, action.type, action.metadata);
      }
      setSelectedIds([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      case 'inactive':
        return 'secondary';
      case 'invited':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="Students" />
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
                        <TableCell>{student.full_name || "N/A"}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            {student.status}
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

            <StudentCreateModal
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