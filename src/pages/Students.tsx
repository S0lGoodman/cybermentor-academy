import { useState, useEffect } from "react";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useSidebar } from "../components/Sidebar";
import { cn } from "../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Ban,
  CheckCircle,
  Download,
  Filter,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockStudents = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    joinDate: "2024-01-15",
    status: "active",
    paymentStatus: "paid",
    progress: 75,
    coursesEnrolled: 3,
    lastActive: "2024-03-08T10:30:00",
  },
  {
    id: "2",
    name: "Sara Amrani",
    email: "sara.amrani@example.com",
    joinDate: "2024-02-01",
    status: "active",
    paymentStatus: "due",
    progress: 45,
    coursesEnrolled: 2,
    lastActive: "2024-03-07T16:45:00",
  },
  {
    id: "3",
    name: "Youssef Alami",
    email: "youssef.alami@example.com",
    joinDate: "2024-01-20",
    status: "suspended",
    paymentStatus: "overdue",
    progress: 30,
    coursesEnrolled: 4,
    lastActive: "2024-03-05T09:15:00",
  },
  // Add more mock students here
];

// Simulate random activity changes
const getRandomActivity = () => {
  const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
  return {
    ...randomStudent,
    lastActive: new Date().toISOString()
  };
};

export const Students = () => {
  const { expanded } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeCount, setActiveCount] = useState(mockStudents.filter(s => s.status === "active").length);
  const [recentlyActive, setRecentlyActive] = useState<string | null>(null);

  // Simulate real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      const activeStudent = getRandomActivity();
      setRecentlyActive(activeStudent.name);
      
      // Clear the recently active status after 2 seconds
      setTimeout(() => setRecentlyActive(null), 2000);
      
      // Randomly update active count to simulate real-time changes
      if (Math.random() > 0.7) {
        setActiveCount(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newCount = prev + change;
          // Ensure count stays within reasonable bounds
          return Math.min(Math.max(newCount, mockStudents.length - 3), mockStudents.length);
        });
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter students based on search query and status
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (studentId: string, newStatus: string) => {
    // Implement status change logic here
    console.log(`Changing status of student ${studentId} to ${newStatus}`);
  };

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6 ml-16">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Students Management</h1>
                <p className="text-muted-foreground">
                  Manage and monitor student accounts
                  {recentlyActive && (
                    <span className="ml-2 text-[#00C896] animate-fade-in">
                      • {recentlyActive} is online
                    </span>
                  )}
                </p>
              </div>
              <Button className="bg-cyber-primary hover:bg-cyber-primary/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#00C896]">{mockStudents.length}</div>
                  <p className="text-xs text-[#00C896] mt-1">
                    +2 this month
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1 relative overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Live Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#00C896]">
                    <span className="inline-flex items-center">
                      {activeCount}
                      <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </span>
                  </div>
                  <p className="text-xs text-[#00C896] mt-1">
                    {((activeCount / mockStudents.length) * 100).toFixed(0)}% of total
                  </p>
                  {/* Activity indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00C896] to-transparent opacity-25 animate-slide" />
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Payment Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#00C896]">
                    {mockStudents.filter(s => s.paymentStatus === "due" || s.paymentStatus === "overdue").length}
                  </div>
                  <p className="text-xs text-[#00C896] mt-1">
                    Requires attention
                  </p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10 hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold transition-colors duration-200 group-hover:text-[#00C896]">
                    {(mockStudents.reduce((acc, student) => acc + student.progress, 0) / mockStudents.length).toFixed(0)}%
                  </div>
                  <p className="text-xs text-[#00C896] mt-1">
                    Across all courses
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                      <Input
                        type="search"
                        placeholder="Search by name or email..."
                        className="pl-8 bg-background"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[120px]">
                          <Filter className="h-4 w-4 mr-2" />
                          Status
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                          All Students
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStatus("active")}>
                          Active Only
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStatus("suspended")}>
                          Suspended
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.name}</span>
                              <span className="text-sm text-muted-foreground">{student.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === "active" ? "outline" : "destructive"}>
                            {student.status === "active" ? "Active" : "Suspended"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            student.paymentStatus === "paid" ? "default" :
                            student.paymentStatus === "due" ? "secondary" :
                            "destructive"
                          }>
                            {student.paymentStatus === "paid" ? "Paid" :
                             student.paymentStatus === "due" ? "Due Soon" :
                             "Overdue"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-cyber-primary h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(student.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {student.status === "active" ? (
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleStatusChange(student.id, "suspended")}>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600" onClick={() => handleStatusChange(student.id, "active")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate Account
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}; 