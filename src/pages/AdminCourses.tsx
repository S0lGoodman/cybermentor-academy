import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  FileEdit,
  Settings,
  LayoutGrid,
  List
} from "lucide-react";

// Mock course data
const mockCourses = [
  {
    id: "1",
    name: "Ethical Hacking & Penetration Testing",
    status: "published",
    phase: "Level 1",
    activeStudents: 84,
    completedStudents: 40,
    lastUpdated: "2024-03-01",
    rating: 4.9,
    modules: 12,
    labs: 8
  },
  {
    id: "2",
    name: "Network Security Fundamentals",
    status: "published",
    phase: "Level 1",
    activeStudents: 68,
    completedStudents: 30,
    lastUpdated: "2024-02-15",
    rating: 4.7,
    modules: 10,
    labs: 6
  },
  {
    id: "3",
    name: "Secure Coding & Application Security",
    status: "draft",
    phase: "Level 2",
    activeStudents: 0,
    completedStudents: 0,
    lastUpdated: "2024-03-08",
    rating: 0,
    modules: 8,
    labs: 5
  },
  {
    id: "4",
    name: "Cyber Threat Intelligence",
    status: "published",
    phase: "Level 2",
    activeStudents: 45,
    completedStudents: 20,
    lastUpdated: "2024-01-20",
    rating: 4.8,
    modules: 9,
    labs: 4
  },
  {
    id: "5",
    name: "Digital Forensics",
    status: "review",
    phase: "Level 3",
    activeStudents: 0,
    completedStudents: 0,
    lastUpdated: "2024-03-07",
    rating: 0,
    modules: 11,
    labs: 7
  }
];

export const AdminCourses = () => {
  const { expanded } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter courses based on search query and status
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "review":
        return "warning";
      default:
        return "outline";
    }
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
                <h1 className="text-2xl font-bold">Course Management</h1>
                <p className="text-muted-foreground">
                  Create, edit and manage your courses
                </p>
              </div>
              <Button className="bg-cyber-primary hover:bg-cyber-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
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
                        placeholder="Search courses..."
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
                          All Courses
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStatus("published")}>
                          Published
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStatus("draft")}>
                          Drafts
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSelectedStatus("review")}>
                          In Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-r-none",
                          viewMode === "grid" && "bg-muted"
                        )}
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "rounded-l-none border-l",
                          viewMode === "list" && "bg-muted"
                        )}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses List */}
            {viewMode === "list" ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Phase</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{course.name}</div>
                              {course.rating > 0 && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  ⭐ {course.rating}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(course.status)}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{course.phase}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span>{course.activeStudents} active</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <CheckCircle className="h-3 w-3 text-muted-foreground" />
                                <span>{course.completedStudents} completed</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-sm">
                                <BookOpen className="h-3 w-3 text-muted-foreground" />
                                <span>{course.modules} modules</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Settings className="h-3 w-3 text-muted-foreground" />
                                <span>{course.labs} labs</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(course.lastUpdated).toLocaleDateString()}
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
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Course
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Edit Content
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Manage Labs
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Settings
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Course
                                  </DropdownMenuItem>
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{course.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(course.status)}>
                              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{course.phase}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Course
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="h-4 w-4 mr-2" />
                              Edit Content
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Labs
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Students</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span>{course.activeStudents} active</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <CheckCircle className="h-3 w-3 text-muted-foreground" />
                                <span>{course.completedStudents} completed</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Content</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <BookOpen className="h-3 w-3 text-muted-foreground" />
                                <span>{course.modules} modules</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Settings className="h-3 w-3 text-muted-foreground" />
                                <span>{course.labs} labs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          {course.rating > 0 && (
                            <div className="flex items-center gap-1">
                              ⭐ {course.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}; 