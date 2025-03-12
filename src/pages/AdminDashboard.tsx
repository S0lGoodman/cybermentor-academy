import { useState, useEffect } from "react";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { StatCard } from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Users,
  BookOpen,
  Award,
  DollarSign,
  UserPlus,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Search,
  Ban,
  Clock,
  ShieldAlert,
  Shield as ShieldIcon,
  Code
} from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";

// Mock data for live updates
const mockStudents = [
  { id: "1", name: "Emma Davis" },
  { id: "2", name: "John Smith" },
  { id: "3", name: "Olivia Wilson" },
  { id: "4", name: "Michael Brown" },
  { id: "5", name: "Sophie Miller" },
];

// Initial course data
const initialCourses = [
  { 
    id: "1",
    name: "Ethical Hacking & Penetration Testing", 
    rating: 4.9, 
    activeStudents: 84,
    completedStudents: 40
  },
  { 
    id: "2",
    name: "Network Security Fundamentals", 
    rating: 4.7, 
    activeStudents: 68,
    completedStudents: 30
  },
  { 
    id: "3",
    name: "Secure Coding & Application Security", 
    rating: 4.6, 
    activeStudents: 56,
    completedStudents: 20
  },
  { 
    id: "4",
    name: "Cyber Threat Intelligence", 
    rating: 4.8, 
    activeStudents: 45,
    completedStudents: 20
  },
  { 
    id: "5",
    name: "Digital Forensics", 
    rating: 4.5, 
    activeStudents: 42,
    completedStudents: 15
  },
];

// Function to simulate random activity
const getRandomActivity = () => {
  const activities = [
    "started a new course",
    "completed a lab",
    "submitted an assignment",
    "earned a badge",
    "joined a live session"
  ];
  const student = mockStudents[Math.floor(Math.random() * mockStudents.length)];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  return { student, activity };
};

export const AdminDashboard = () => {
  const { setExpanded, setIsAdmin } = useSidebar();
  const [totalEarnings, setTotalEarnings] = useState(15000);
  const [totalStudents, setTotalStudents] = useState(10);
  const [activeCourses, setActiveCourses] = useState(24);
  const [paymentDue, setPaymentDue] = useState(12);
  const [recentActivity, setRecentActivity] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [courses, setCourses] = useState(initialCourses);
  
  useEffect(() => {
    setExpanded(true);
    setIsAdmin(true);
    
    // Setup animation observations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    // Simulate real-time updates
    const activityInterval = setInterval(() => {
      const { student, activity } = getRandomActivity();
      setRecentActivity(`${student.name} ${activity}`);
      
      // Update active users
      setActiveUsers(prev => {
        const newActive = [...prev];
        if (Math.random() > 0.5 && !newActive.includes(student.name)) {
          newActive.push(student.name);
        } else {
          const index = newActive.indexOf(student.name);
          if (index > -1) {
            newActive.splice(index, 1);
          }
        }
        return newActive.slice(-3); // Keep only last 3 active users
      });
      
      // Update course active students
      setCourses(prevCourses => {
        return prevCourses.map(course => {
          if (Math.random() > 0.7) {
            const change = Math.random() > 0.5 ? 1 : -1;
            const newCount = Math.max(0, course.activeStudents + change);
            return {
              ...course,
              activeStudents: newCount
            };
          }
          return course;
        });
      });
      
      // Random stats updates
      if (Math.random() > 0.8) {
        setTotalEarnings(prev => prev + Math.floor(Math.random() * 500));
      }
      if (Math.random() > 0.9) {
        setTotalStudents(prev => prev + 1);
      }
      if (Math.random() > 0.85) {
        setActiveCourses(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
      if (Math.random() > 0.7) {
        setPaymentDue(prev => Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
      
      // Clear activity message after 3 seconds
      setTimeout(() => setRecentActivity(null), 3000);
    }, 4000);
    
    return () => {
      observer.disconnect();
      clearInterval(activityInterval);
    };
  }, [setExpanded, setIsAdmin]);

  const handleAccessToggle = (studentId: string, currentStatus: boolean) => {
    // Add logic to toggle student access
    console.log(`Toggling access for student ${studentId} to ${!currentStatus}`);
  };

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="p-6 ml-16">
          <div className="max-w-7xl mx-auto">
            {/* Admin Stats Overview */}
            <div className="mb-8 animate-on-scroll">
              <h1 className="text-2xl font-bold mb-2">Admin Overview</h1>
              <p className="text-muted-foreground">
                Manage students, courses, and platform performance
                {recentActivity && (
                  <span className="ml-2 text-[#00C896] animate-fade-in">
                    • {recentActivity}
                  </span>
                )}
              </p>
              {activeUsers.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {activeUsers.length} student{activeUsers.length > 1 ? 's' : ''} online now
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="Total Earnings"
                value={`${totalEarnings} MAD`}
                icon={<DollarSign className="h-5 w-5 text-green-500" />}
                trend={{ value: "+15%", label: "vs last month" }}
              />
              <StatCard
                title="Total Students"
                value={totalStudents.toString()}
                icon={<Users className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: "+2", label: "new students" }}
              />
              <StatCard
                title="Active Courses"
                value={activeCourses.toString()}
                icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                trend={{ value: "+5", label: "new courses" }}
              />
              <StatCard
                title="Payment Due"
                value={paymentDue.toString()}
                icon={<AlertCircle className="h-5 w-5 text-red-500" />}
                trend={{ value: "-2", label: "vs last week" }}
              />
            </div>
            
            {/* Quick Actions Section */}
            <div className="mb-8 animate-on-scroll">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" /> Add New Student
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" /> Create New Course
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Code className="h-4 w-4 mr-2" /> Add Lab
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Award className="h-4 w-4 mr-2" /> Issue Certification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Student Performance & Course Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-on-scroll">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Top Performing Students</CardTitle>
                    <Button variant="outline" size="sm" className="h-8">
                      <Search className="h-3.5 w-3.5 mr-1" /> 
                      Find Student
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Completion</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Emma Davis", score: 98, completion: 92, trend: "up" },
                        { name: "John Smith", score: 96, completion: 89, trend: "up" },
                        { name: "Olivia Wilson", score: 95, completion: 87, trend: "down" },
                        { name: "Michael Brown", score: 93, completion: 86, trend: "up" },
                        { name: "Sophie Miller", score: 92, completion: 84, trend: "down" },
                      ].map((student, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm">{student.score}%</span>
                              {student.trend === "up" ? 
                                <ChevronUp className="h-4 w-4 text-green-500" /> : 
                                <ChevronDown className="h-4 w-4 text-red-500" />
                              }
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div 
                                className="bg-cyber-primary h-2 rounded-full" 
                                style={{ width: `${student.completion}%` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="h-7 text-xs">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Course Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course, i) => (
                      <div key={i} className="border rounded-lg p-4 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#00C896]/10">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-sm truncate max-w-xs">{course.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center">
                                <span className="text-xs font-medium mr-1">⭐ {course.rating}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 mr-1 text-[#00C896]" />
                                  <span className="text-xs font-medium">{course.activeStudents} active</span>
                                  <span className="ml-2 h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <span className="text-xs text-muted-foreground">•</span>
                                <div className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span className="text-xs font-medium">{course.completedStudents} completed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Activity indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00C896] to-transparent opacity-25 animate-slide" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-on-scroll">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">Support Tickets</CardTitle>
                    <Button variant="outline" size="sm" className="h-8">
                      <Search className="h-3.5 w-3.5 mr-1" /> 
                      Search Tickets
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        id: "TK-001",
                        student: "Ahmed Hassan",
                        subject: "Cannot access lab environment",
                        priority: "high",
                        status: "open",
                        time: "30 mins ago"
                      },
                      { 
                        id: "TK-002",
                        student: "Sara Amrani",
                        subject: "Payment issue with monthly subscription",
                        priority: "medium",
                        status: "in-progress",
                        time: "2 hours ago"
                      },
                      { 
                        id: "TK-003",
                        student: "Youssef Alami",
                        subject: "Certificate not generated after course completion",
                        priority: "low",
                        status: "resolved",
                        time: "1 day ago"
                      },
                    ].map((ticket, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">#{ticket.id}</span>
                            <Badge variant={
                              ticket.priority === "high" ? "destructive" :
                              ticket.priority === "medium" ? "secondary" :
                              "outline"
                            }>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </Badge>
                            <Badge variant={
                              ticket.status === "open" ? "destructive" :
                              ticket.status === "in-progress" ? "secondary" :
                              "default"
                            }>
                              {ticket.status === "in-progress" ? "In Progress" : 
                               ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">{ticket.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{ticket.student}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{ticket.time}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-7 text-xs shrink-0">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
