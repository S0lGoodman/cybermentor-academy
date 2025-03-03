
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";
import { FileText, Clock, Users, Award } from "lucide-react";

const coursesData = [
  {
    id: "1",
    title: "Network Security Fundamentals",
    description: "Learn the basics of securing networks and preventing intrusions",
    duration: "4 weeks",
    level: "Beginner",
    enrolledStudents: 245,
    progress: 0,
    image: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Ethical Hacking",
    description: "Master the techniques used by ethical hackers to secure systems",
    duration: "8 weeks",
    level: "Intermediate",
    enrolledStudents: 189,
    progress: 0,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Cloud Security",
    description: "Learn how to secure cloud infrastructure and applications",
    duration: "6 weeks",
    level: "Intermediate",
    enrolledStudents: 156,
    progress: 0,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Security Incident Response",
    description: "Develop skills to effectively respond to security incidents",
    duration: "5 weeks",
    level: "Advanced",
    enrolledStudents: 112,
    progress: 0,
    image: "/placeholder.svg"
  }
];

const Courses = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Courses | Cybersecurity Academy</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">دورات الأمن السيبراني</h1>
        <div className="flex items-center space-x-2">
          <select className="border rounded-md px-3 py-2 bg-white text-sm">
            <option>جميع المستويات</option>
            <option>مبتدئ</option>
            <option>متوسط</option>
            <option>متقدم</option>
          </select>
          <select className="border rounded-md px-3 py-2 bg-white text-sm">
            <option>الأكثر شعبية</option>
            <option>الأحدث</option>
            <option>أ-ي</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {coursesData.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">ساعات الدورة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">186</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الطلاب المسجلين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">1,245</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الشهادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Courses;
