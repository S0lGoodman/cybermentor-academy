import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./lib/theme-provider";
import { SidebarProvider } from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { AdminCourses } from "./pages/AdminCourses";
import { CourseDetails } from "./pages/CourseDetails";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Labs } from "./pages/Labs";
import { Achievements } from "./pages/Achievements";
import { Settings } from "./pages/Settings";
import { AdminSettings } from "./pages/AdminSettings";
import { Leaderboard } from "./pages/Leaderboard";
import Students from "./pages/Students";
import { api, trpcClient } from "./utils/api";
import { ResetPassword } from "@/pages/ResetPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  // Get initial theme from localStorage or default to dark
  const initialTheme = localStorage.getItem("vite-ui-theme") || "dark";

  // Add initial theme class to prevent flash
  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
  }, [initialTheme]);

  return (
    <AuthProvider>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ThemeProvider defaultTheme={initialTheme as "light" | "dark"} storageKey="vite-ui-theme">
              <SidebarProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <ProtectedRoute isAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/students" 
                      element={
                        <ProtectedRoute isAdmin>
                          <Students />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/courses" 
                      element={
                        <ProtectedRoute isAdmin>
                          <AdminCourses />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/courses/:courseId" 
                      element={
                        <ProtectedRoute isAdmin>
                          <CourseDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/profile" 
                      element={
                        <ProtectedRoute isAdmin>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/labs" 
                      element={
                        <ProtectedRoute isAdmin>
                          <Labs />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/achievements" 
                      element={
                        <ProtectedRoute isAdmin>
                          <Achievements />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/settings" 
                      element={
                        <ProtectedRoute isAdmin>
                          <AdminSettings />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Student Routes */}
                    <Route path="/student" element={<Navigate to="/student/dashboard" />} />
                    <Route 
                      path="/student/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/courses" 
                      element={
                        <ProtectedRoute>
                          <Courses />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/courses/:phaseId" 
                      element={
                        <ProtectedRoute>
                          <Courses />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/courses/:phaseId/:courseSlug" 
                      element={
                        <ProtectedRoute>
                          <CourseDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/labs" 
                      element={
                        <ProtectedRoute>
                          <Labs />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/achievements" 
                      element={
                        <ProtectedRoute>
                          <Achievements />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/leaderboard" 
                      element={
                        <ProtectedRoute>
                          <Leaderboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/student/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Reset Password Route */}
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* 404 Route */}
                    <Route path="*" element={<Navigate to="/login" />} />
                  </Routes>
                </BrowserRouter>
              </SidebarProvider>
            </ThemeProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </api.Provider>
    </AuthProvider>
  );
};

export default App;
