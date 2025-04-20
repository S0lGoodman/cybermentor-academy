import { useState, useEffect } from "react";
import { AdminNavbar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { StatCard } from "../components/StatCard";
import { supabaseAdmin } from "@/lib/supabase-admin";
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
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [activeCourses, setActiveCourses] = useState<number>(0);
  const [paymentDue, setPaymentDue] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [courses, setCourses] = useState(initialCourses);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [earningsTrend, setEarningsTrend] = useState<string>("+0%");
  const [studentsTrend, setStudentsTrend] = useState<string>("+0");
  const [coursesTrend, setCoursesTrend] = useState<string>("+0");

  // Function to fetch total students count
  const fetchTotalStudents = async () => {
    try {
      const { data, error, count } = await supabaseAdmin
        .from('students')
        .select('id', { count: 'exact' });

      if (error) {
        console.error('Error fetching total students:', error);
        return;
      }

      // Get new students in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newStudentsCount, error: newStudentsError } = await supabaseAdmin
        .from('students')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (newStudentsError) {
        console.error('Error fetching new students:', newStudentsError);
      } else {
        setStudentsTrend(`+${newStudentsCount || 0}`);
      }

      setTotalStudents(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching total students:', error);
    }
  };

  // Function to fetch active courses count
  const fetchActiveCourses = async () => {
    try {
      const { data, error, count } = await supabaseAdmin
        .from('courses')
        .select('id', { count: 'exact' })
        .eq('status', 'published');

      if (error) {
        console.error('Error fetching active courses:', error);
        return;
      }

      // Get new courses in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: newCoursesCount, error: newCoursesError } = await supabaseAdmin
        .from('courses')
        .select('id', { count: 'exact' })
        .eq('status', 'published')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (newCoursesError) {
        console.error('Error fetching new courses:', newCoursesError);
      } else {
        setCoursesTrend(`+${newCoursesCount || 0}`);
      }

      setActiveCourses(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching active courses:', error);
    }
  };

  // Function to fetch payment due count
  const fetchPaymentDue = async () => {
    try {
      // Count students with payment_due status
      const { data, error, count } = await supabaseAdmin
        .from('students')
        .select('id', { count: 'exact' })
        .eq('status', 'payment_due');

      if (error) {
        console.error('Error fetching payment due from students:', error);

        // Fallback method: Check profiles table
        const { data: profilesData, error: profilesError, count: profilesCount } = await supabaseAdmin
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('status', 'payment_due');

        if (profilesError) {
          console.error('Error fetching payment due from profiles:', profilesError);

          // Second fallback: Count payments with due_soon or overdue status
          const { data: paymentsData, error: paymentsError, count: paymentsCount } = await supabaseAdmin
            .from('payments')
            .select('id', { count: 'exact' })
            .in('payment_status', ['due_soon', 'overdue']);

          if (paymentsError) {
            console.error('Error fetching payment due from payments:', paymentsError);
            return;
          }

          setPaymentDue(paymentsCount || 0);
          return;
        }

        setPaymentDue(profilesCount || 0);
        return;
      }

      setPaymentDue(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching payment due:', error);
    }
  };

  // Function to fetch total earnings
  const fetchTotalEarnings = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('payments')
        .select('amount')
        .eq('payment_status', 'paid');

      if (error) {
        console.error('Error fetching total earnings:', error);
        return;
      }

      // Calculate total earnings
      const total = data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
      setTotalEarnings(total);

      // Calculate earnings trend (last 30 days vs previous 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      // Last 30 days earnings
      const { data: last30DaysData, error: last30DaysError } = await supabaseAdmin
        .from('payments')
        .select('amount')
        .eq('payment_status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Previous 30 days earnings
      const { data: previous30DaysData, error: previous30DaysError } = await supabaseAdmin
        .from('payments')
        .select('amount')
        .eq('payment_status', 'paid')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (!last30DaysError && !previous30DaysError) {
        const last30DaysTotal = last30DaysData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
        const previous30DaysTotal = previous30DaysData?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 1; // Avoid division by zero

        const percentChange = Math.round((last30DaysTotal - previous30DaysTotal) / previous30DaysTotal * 100);
        setEarningsTrend(`${percentChange >= 0 ? '+' : ''}${percentChange}%`);
      }
    } catch (error) {
      console.error('Unexpected error fetching total earnings:', error);
    }
  };

  // Function to fetch real course data
  const fetchCourseData = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select('id, name, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      // For each course, get active students count
      const coursesWithStudents = await Promise.all(data.map(async (course) => {
        // Get active students for this course
        const { data: activeStudents, error: activeStudentsError, count: activeStudentsCount } = await supabaseAdmin
          .from('user_course_progress')
          .select('user_id', { count: 'exact' })
          .eq('course_id', course.id)
          .lt('progress', 100); // Not completed yet

        // Get completed students for this course
        const { data: completedStudents, error: completedStudentsError, count: completedStudentsCount } = await supabaseAdmin
          .from('user_course_progress')
          .select('user_id', { count: 'exact' })
          .eq('course_id', course.id)
          .eq('progress', 100); // Completed

        if (activeStudentsError) {
          console.error(`Error fetching active students for course ${course.id}:`, activeStudentsError);
        }

        if (completedStudentsError) {
          console.error(`Error fetching completed students for course ${course.id}:`, completedStudentsError);
        }

        // Get average rating for this course
        const { data: ratings, error: ratingsError } = await supabaseAdmin
          .from('course_ratings')
          .select('rating')
          .eq('course_id', course.id);

        let averageRating = 0;
        if (!ratingsError && ratings && ratings.length > 0) {
          averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        }

        return {
          id: course.id,
          name: course.name,
          rating: averageRating || 4.5, // Default if no ratings
          activeStudents: activeStudentsCount || 0,
          completedStudents: completedStudentsCount || 0
        };
      }));

      setCourses(coursesWithStudents);
    } catch (error) {
      console.error('Unexpected error fetching course data:', error);
    }
  };

  useEffect(() => {
    // Only set isAdmin, don't force sidebar state
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

    // Fetch real data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchTotalStudents(),
          fetchActiveCourses(),
          fetchPaymentDue(),
          fetchTotalEarnings(),
          fetchCourseData()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Simulate real-time updates for activity feed only
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

      // Clear activity message after 3 seconds
      setTimeout(() => setRecentActivity(null), 3000);
    }, 4000);

    // Set up refresh interval for real data (every 5 minutes)
    const dataRefreshInterval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);

    return () => {
      observer.disconnect();
      clearInterval(activityInterval);
      clearInterval(dataRefreshInterval);
    };
  }, [setIsAdmin]);

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
                value={isLoading ? "Loading..." : `${totalEarnings} MAD`}
                icon={<DollarSign className="h-5 w-5 text-green-500" />}
                trend={{ value: earningsTrend, label: "vs last month" }}
              />
              <StatCard
                title="Total Students"
                value={isLoading ? "Loading..." : totalStudents.toString()}
                icon={<Users className="h-5 w-5 text-cyber-primary" />}
                trend={{ value: studentsTrend, label: "new students" }}
              />
              <StatCard
                title="Active Courses"
                value={isLoading ? "Loading..." : activeCourses.toString()}
                icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                trend={{ value: coursesTrend, label: "new courses" }}
              />
              <StatCard
                title="Payment Due"
                value={isLoading ? "Loading..." : paymentDue.toString()}
                icon={<AlertCircle className="h-5 w-5 text-red-500" />}
                trend={{ value: paymentDue > 0 ? `${paymentDue}` : "0", label: "payments" }}
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
