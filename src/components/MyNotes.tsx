import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Note {
  id: string;
  courseTitle: string;
  lessonTitle: string;
  content: string;
  date: string;
}

// Mock data - this would come from your backend
const mockNotes: Note[] = [
  {
    id: "1",
    courseTitle: "مقدمة في الشبكات",
    lessonTitle: "مقدمة عن الشبكات والبروتوكولات",
    content: "النقاط الرئيسية من الدرس:\n- تعريف الشبكة\n- أنواع الشبكات\n- البروتوكولات الأساسية",
    date: "٢٠ فبراير ٢٠٢٤"
  },
  // Add more mock notes...
];

const MyNotes = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Group notes by course
  const groupedNotes = mockNotes.reduce((acc, note) => {
    if (!acc[note.courseTitle]) {
      acc[note.courseTitle] = [];
    }
    acc[note.courseTitle].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          ملاحظاتي
        </CardTitle>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث في الملاحظات..."
            className="pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6">
            {Object.entries(groupedNotes).map(([courseTitle, notes]) => (
              <div key={courseTitle}>
                <h3 className="font-semibold mb-3">{courseTitle}</h3>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{note.lessonTitle}</h4>
                        <span className="text-xs text-muted-foreground">{note.date}</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{note.content}</p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MyNotes; 