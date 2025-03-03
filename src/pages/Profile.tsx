
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Clock, BookOpen, Shield, User, Mail, MapPin, Calendar, BookMarked, FileText } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";

const Profile = () => {
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    location: "San Francisco, CA",
    joined: "January 2023",
    image: "/placeholder.svg",
    bio: "Cybersecurity enthusiast with a passion for ethical hacking and network security. Currently working on developing skills in penetration testing and incident response.",
    completedCourses: 3,
    inProgressCourses: 2,
    certifications: 1,
    studyHours: 86
  };

  const certificationsData = [
    {
      id: "1",
      title: "Network Security Fundamentals",
      date: "March 15, 2023",
      image: "/placeholder.svg"
    }
  ];

  const inProgressCoursesData = [
    {
      id: "1",
      title: "Ethical Hacking",
      progress: 65,
      lastAccessed: "2 days ago"
    },
    {
      id: "2",
      title: "Cloud Security",
      progress: 32,
      lastAccessed: "5 days ago"
    }
  ];

  const completedCoursesData = [
    {
      id: "1",
      title: "Network Security Fundamentals",
      completedDate: "March 10, 2023",
      score: "92%"
    },
    {
      id: "2",
      title: "Web Application Security",
      completedDate: "May 22, 2023",
      score: "88%"
    },
    {
      id: "3",
      title: "Security Awareness Training",
      completedDate: "June 15, 2023",
      score: "95%"
    }
  ];

  const monthlyProgressData = [
    { name: "Jan", hours: 12 },
    { name: "Feb", hours: 18 },
    { name: "Mar", hours: 15 },
    { name: "Apr", hours: 22 },
    { name: "May", hours: 8 },
    { name: "Jun", hours: 11 }
  ];

  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Profile | Cybersecurity Academy</title>
      </Helmet>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userData.image} alt={userData.name} />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
              <p className="text-muted-foreground text-sm mb-4">Student</p>
              <div className="w-full space-y-3 mt-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {userData.joined}</span>
                </div>
              </div>
              <Button className="w-full mt-6" variant="outline">Edit Profile</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{userData.bio}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-cyber-primary/10 rounded-lg p-4 text-center">
                  <BookMarked className="h-5 w-5 mx-auto mb-2 text-cyber-primary" />
                  <div className="text-lg font-bold">{userData.completedCourses}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="bg-cyber-primary/10 rounded-lg p-4 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-cyber-primary" />
                  <div className="text-lg font-bold">{userData.studyHours}</div>
                  <div className="text-xs text-muted-foreground">Study Hours</div>
                </div>
                <div className="bg-cyber-primary/10 rounded-lg p-4 text-center">
                  <BookOpen className="h-5 w-5 mx-auto mb-2 text-cyber-primary" />
                  <div className="text-lg font-bold">{userData.inProgressCourses}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div className="bg-cyber-primary/10 rounded-lg p-4 text-center">
                  <Award className="h-5 w-5 mx-auto mb-2 text-cyber-primary" />
                  <div className="text-lg font-bold">{userData.certifications}</div>
                  <div className="text-xs text-muted-foreground">Certifications</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="progress">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Learning Activity</CardTitle>
                  <CardDescription>Your study hours over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ProgressChart data={monthlyProgressData} />
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inProgressCoursesData.map((course) => (
                        <div key={course.id} className="border-b last:border-0 pb-4 last:pb-0">
                          <p className="font-medium mb-1">{course.title}</p>
                          <div className="h-2 bg-gray-100 rounded-full mb-2">
                            <div 
                              className="h-2 bg-cyber-primary rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{course.progress}% complete</span>
                            <span>Last accessed {course.lastAccessed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Achievement Path</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 border-l space-y-6">
                      <div className="relative">
                        <div className="absolute -left-10 top-0 bg-green-500 rounded-full p-1">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">Security Foundations</p>
                        <p className="text-xs text-muted-foreground">Completed on February 10, 2023</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-10 top-0 bg-cyber-primary rounded-full p-1">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">Network Security</p>
                        <p className="text-xs text-muted-foreground">In progress - 65% complete</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-10 top-0 bg-gray-300 rounded-full p-1">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">Penetration Testing</p>
                        <p className="text-xs text-muted-foreground">Locked - Complete previous path</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-10 top-0 bg-gray-300 rounded-full p-1">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <p className="font-medium">Security+ Certification</p>
                        <p className="text-xs text-muted-foreground">Locked - Complete previous paths</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="courses">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Completed Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedCoursesData.map((course) => (
                      <div key={course.id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-xs text-muted-foreground">Completed on {course.completedDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{course.score}</div>
                          <div className="text-xs text-muted-foreground">Final Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Courses in Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inProgressCoursesData.map((course) => (
                      <div key={course.id} className="border-b last:border-0 pb-4 last:pb-0">
                        <p className="font-medium mb-1">{course.title}</p>
                        <div className="h-2 bg-gray-100 rounded-full mb-2">
                          <div 
                            className="h-2 bg-cyber-primary rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between">
                          <Button size="sm" variant="outline">Resume</Button>
                          <span className="text-xs text-muted-foreground self-center">
                            Last accessed {course.lastAccessed}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {certificationsData.length > 0 ? (
                    <div className="space-y-6">
                      {certificationsData.map((certificate) => (
                        <div key={certificate.id} className="border rounded-lg p-4 flex flex-col md:flex-row items-center">
                          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                            <Award className="h-12 w-12 text-cyber-primary" />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <p className="font-medium">{certificate.title}</p>
                            <p className="text-sm text-muted-foreground mb-4">Issued on {certificate.date}</p>
                            <div className="flex flex-col md:flex-row gap-2">
                              <Button size="sm" variant="outline">View Certificate</Button>
                              <Button size="sm" variant="outline">Share</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="font-medium mb-2">No certificates yet</p>
                      <p className="text-sm text-muted-foreground mb-6">Complete courses to earn certificates</p>
                      <Button variant="outline">Browse Courses</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <input 
                            type="text" 
                            defaultValue={userData.name} 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input 
                            type="email" 
                            defaultValue={userData.email} 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Location</label>
                          <input 
                            type="text" 
                            defaultValue={userData.location} 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Bio</h3>
                      <textarea 
                        defaultValue={userData.bio} 
                        rows={4}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Course updates</label>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">New course releases</label>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm">Certificate reminders</label>
                          <input type="checkbox" defaultChecked className="toggle" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
