import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Student, StudentFilters, BulkAction, StudentStatus } from "@/types/student";
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
      interface DbStudent {
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        created_at: string;
        updated_at: string;
        role: string;
        status?: string;
      }

      interface AuthUser {
        id: string;
        last_sign_in_at: string | null;
        user_metadata: Record<string, any> | null;
      }

      // First get all student profiles
      let query = supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }

      if (filters.dateRange?.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }

      const { data: profilesData, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Get auth data using the admin API
      const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

      if (authError) throw authError;

      // Create a map of user IDs to their auth data
      const authDataMap = new Map<string, AuthUser>(
        (authUsers || []).map(user => [
          user.id,
          {
            id: user.id,
            last_sign_in_at: user.last_sign_in_at,
            user_metadata: user.user_metadata
          }
        ])
      );

      // Transform the data to match our Student type
      const transformedData: Student[] = (profilesData as DbStudent[]).map(profile => {
        const authUser = authDataMap.get(profile.id);
        const isPending = !authUser?.last_sign_in_at;
        
        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.name || 'N/A',
          created_at: profile.created_at,
          last_active: authUser?.last_sign_in_at || profile.updated_at,
          status: isPending ? 'pending' : 'active',
          progress: 0,
          enrolled_courses: 0,
          role: profile.role,
          user_metadata: authUser?.user_metadata || undefined
        };
      });

      setStudents(transformedData);
    } catch (error: any) {
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
      switch (action) {
        case 'suspend':
          await supabaseAdmin
            .from('profiles')
            .update({
              status: 'suspended',
              suspended_until: new Date(Date.now() + metadata.duration * 24 * 60 * 60 * 1000).toISOString(),
              suspension_reason: metadata.reason
            })
            .eq('id', studentId);
          break;

        case 'activate':
          await supabaseAdmin
            .from('profiles')
            .update({
              status: 'active',
              suspended_until: null,
              suspension_reason: null
            })
            .eq('id', studentId);
          break;

        case 'delete':
          await supabaseAdmin.auth.admin.deleteUser(studentId);
          break;

        case 'reset_password':
          await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: students.find(s => s.id === studentId)?.email || ''
          });
          break;

        case 'send_email':
          // Implement email sending logic
          console.log('Sending email:', metadata);
          break;
      }

      toast({
        title: "Success",
        description: "Action completed successfully",
      });

      fetchStudents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
      case 'pending':
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