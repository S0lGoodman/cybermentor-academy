import React from "react";
import { Helmet } from "react-helmet";
import { AdminNavbar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { useSidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, KeyRound } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const AdminSettings = () => {
  const { expanded } = useSidebar();

  return (
    <div className="min-h-screen flex">
      <AdminNavbar />
      <div className={cn("flex-1", !expanded && "overflow-hidden")}>
        <Navbar title="" />
        <main className="p-6">
          <div className={cn("max-w-4xl mx-auto", !expanded && "ml-16")}>
            <Helmet>
              <title>Admin Settings | CyberMentor Academy</title>
            </Helmet>

            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Admin Settings</h1>
              <p className="text-muted-foreground">Manage your admin account</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Account</CardTitle>
                  <CardDescription>Update your admin account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 pb-6">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-2 border-[#00C896]/20 transition-all duration-300 group-hover:border-[#00C896]/50">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Change Photo
                      </label>
                      <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex gap-2">
                      <Input type="email" placeholder="admin@cybermentor.com" />
                      <Button variant="secondary">
                        <Mail className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="flex gap-2">
                      <Input type="password" placeholder="••••••••" />
                      <Button variant="secondary">
                        <KeyRound className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </div>
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