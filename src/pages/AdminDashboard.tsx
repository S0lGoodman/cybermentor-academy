
import React, { useEffect } from "react";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { ProgressChart } from "@/components/ProgressChart";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Award,
  Shield,
  UserPlus,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import { useSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const activityData = [
  { name: "Students", completed: 45, total: 50 },
  { name: "Courses", completed: 12, total: 20 },
  { name: "Modules", completed: 75, total: 120 },
  { name: "Assessments", completed: 150, total: 200 },
  { name: "Certifications", completed: 30, total: 40 },
];

const AdminDashboard = () => {
  const { setExpanded, setIsAdmin } = useSidebar();
  
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
    
    return () => {
      observer.disconnect();
    };
  }, [setExpanded, setIsAdmin]);

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      
      <div className="flex-1">
        <Navbar title="Admin Dashboard" />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Admin Stats Overview */}
            <div className="mb-8 animate-on-scroll">
              <h1 className="text-2xl font-bold mb-2">Admin Overview</h1>
              <p className="text-muted-foreground">Manage students, courses, and platform performance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-on-scroll">
              <StatCard
                title="Total Students"
                value="485"
                icon={<Users className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Active Courses"
                value="24"
                icon={<BookOpen className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 3, isPositive: true }}
              />
              <StatCard
                title="Certifications Issued"
                value="138"
                icon={<Award className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: 7, isPositive: true }}
              />
              <StatCard
                title="Security Alerts"
                value="3"
                icon={<Shield className="h-5 w-5 text-red-500" />}
                trend={{ value: 2, isPositive: false }}
              />
            </div>
            
            {/* Platform Activity */}
            <div className="mb-8 animate-on-scroll">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Platform Activity</h2>
                <Button variant="outline" size="sm">
                  View Detailed Reports
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProgressChart data={activityData} title="Platform Usage" />
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Recent Enrollments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Alex Johnson", course: "Advanced Penetration Testing", time: "2 hours ago" },
                        { name: "Maria Garcia", course: "Network Security Fundamentals", time: "Yesterday" },
                        { name: "James Wilson", course: "Cyber Threat Intelligence", time: "2 days ago" },
                        { name: "Sarah Ahmed", course: "Secure Coding Practices", time: "3 days ago" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{item.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.course}</p>
                            <p className="text-xs text-muted-foreground/70">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-4">
                      View All Enrollments
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
                    {[
                      { name: "Ethical Hacking & Penetration Testing", rating: 4.9, students: 124, trend: "up", completion: 87 },
                      { name: "Network Security Fundamentals", rating: 4.7, students: 98, trend: "up", completion: 92 },
                      { name: "Secure Coding & Application Security", rating: 4.6, students: 76, trend: "down", completion: 78 },
                      { name: "Cyber Threat Intelligence", rating: 4.8, students: 65, trend: "up", completion: 83 },
                      { name: "Digital Forensics", rating: 4.5, students: 57, trend: "down", completion: 75 },
                    ].map((course, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-sm truncate max-w-xs">{course.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center">
                                <span className="text-xs font-medium mr-1">⭐ {course.rating}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs font-medium">{course.students}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={course.trend === "up" ? "text-green-500 border-green-200" : "text-red-500 border-red-200"}
                              >
                                {course.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                                {course.trend === "up" ? "+5%" : "-3%"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">Completion</span>
                            <p className="font-medium">{course.completion}%</p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                          <div 
                            className="bg-cyber-primary h-2 rounded-full" 
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-on-scroll">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" /> Add New Student
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" /> Create New Course
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Award className="h-4 w-4 mr-2" /> Issue Certification
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" /> Security Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Multiple failed login attempts", level: "High", status: "Unresolved", icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
                      { title: "Course content update required", level: "Medium", status: "In Progress", icon: <BookOpen className="h-4 w-4 text-amber-500" /> },
                      { title: "Student payment issue resolved", level: "Low", status: "Resolved", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
                      { title: "New security patch available", level: "Medium", status: "Pending", icon: <Shield className="h-4 w-4 text-amber-500" /> },
                    ].map((alert, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="mt-0.5">
                          {alert.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{alert.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={
                                alert.status === "Resolved" ? "text-green-500 border-green-200" :
                                alert.status === "In Progress" ? "text-amber-500 border-amber-200" :
                                "text-red-500 border-red-200"
                              }
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={
                                alert.level === "High" ? "bg-red-100 text-red-800" :
                                alert.level === "Medium" ? "bg-amber-100 text-amber-800" : 
                                "bg-green-100 text-green-800"
                              }
                            >
                              {alert.level}
                            </Badge>
                            <span className="text-xs text-muted-foreground">2 hours ago</span>
                          </div>
                        </div>
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

export default AdminDashboard;
