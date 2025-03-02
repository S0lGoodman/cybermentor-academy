
import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, BarChart, CheckCircle, BookOpen, FileText, Play } from "lucide-react";
import StatCard from "@/components/StatCard";
import PathTracker from "@/components/PathTracker";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Mock course data - in a real app, this would come from an API
  const course = {
    id,
    title: "Network Security Fundamentals",
    description: "Learn the basics of securing networks, identifying vulnerabilities, and preventing intrusions. This comprehensive course provides hands-on experience with industry-standard tools and techniques.",
    modules: 8,
    duration: "4 weeks",
    level: "Beginner",
    enrolledStudents: 245,
    rating: 4.8,
    progress: 0,
    image: "/placeholder.svg",
    instructor: "Dr. Sarah Chen",
    instructorRole: "Senior Security Specialist",
    instructorImage: "/placeholder.svg",
    updated: "May 2023"
  };

  const modulesData = [
    { id: "1", title: "Introduction to Network Security", duration: "45 min", completed: false, current: true },
    { id: "2", title: "Network Protocols and Vulnerabilities", duration: "1 hr 15 min", completed: false },
    { id: "3", title: "Firewall Configurations", duration: "1 hr 30 min", completed: false },
    { id: "4", title: "Intrusion Detection Systems", duration: "1 hr", completed: false },
    { id: "5", title: "Virtual Private Networks", duration: "1 hr 15 min", completed: false },
    { id: "6", title: "Security Policies and Compliance", duration: "50 min", completed: false },
    { id: "7", title: "Incident Response", duration: "1 hr 20 min", completed: false },
    { id: "8", title: "Final Assessment", duration: "2 hr", completed: false }
  ];

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>{course.title} | Cybersecurity Academy</title>
      </Helmet>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover rounded-lg md:col-span-1"
                />
                <div className="md:col-span-2">
                  <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{course.enrolledStudents} students</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <img 
                      src={course.instructorImage} 
                      alt={course.instructor} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground">{course.instructorRole}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button className="flex-1">Enroll Now</Button>
                <Button variant="outline" className="flex-1">Add to Wishlist</Button>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="content">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modulesData.map((module, index) => (
                      <div key={module.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              {module.completed ? 
                                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                <Play className="h-5 w-5 text-muted-foreground" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{index + 1}. {module.title}</p>
                              <p className="text-sm text-muted-foreground">{module.duration}</p>
                            </div>
                          </div>
                          {module.current && (
                            <Button size="sm" variant="outline">
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Network Security Cheatsheet</p>
                        <p className="text-sm text-muted-foreground">PDF, 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Lab Environment Setup Guide</p>
                        <p className="text-sm text-muted-foreground">PDF, 1.8 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-lg">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Security Tools Reference</p>
                        <p className="text-sm text-muted-foreground">PDF, 3.2 MB</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          <span className="font-medium">JD</span>
                        </div>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-muted-foreground">2 months ago</p>
                        </div>
                      </div>
                      <p>This course provided an excellent foundation in network security concepts. The labs were practical and informative.</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                          <span className="font-medium">AS</span>
                        </div>
                        <div>
                          <p className="font-medium">Alice Smith</p>
                          <p className="text-sm text-muted-foreground">1 month ago</p>
                        </div>
                      </div>
                      <p>The instructor explains complex topics in a clear, easy-to-understand manner. I particularly enjoyed the section on intrusion detection systems.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <StatCard
            title="Your Progress"
            value="0%"
            description="Just started"
            icon={<BookOpen className="h-5 w-5 text-cyber-primary" />}
          />
          
          <PathTracker
            title="Learning Path"
            steps={[
              { id: "foundations", title: "Security Foundations", completed: true },
              { id: "network", title: "Network Security", completed: false, current: true },
              { id: "pentesting", title: "Penetration Testing", completed: false },
              { id: "incident", title: "Incident Response", completed: false },
              { id: "certification", title: "Security+ Certification", completed: false }
            ]}
          />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Certificate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Complete this course to earn a certificate of completion</p>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <Award className="h-16 w-16 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
