import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function ProtectedRoute({ children, isAdmin }: ProtectedRouteProps) {
  const { user, loading, checkSuspension } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      if (user) {
        try {
          // First check for suspension
          const isSuspended = await checkSuspension();
          if (mounted && isSuspended) {
            setCheckingRole(false);
            return;
          }

          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user role:', error);
          }

          if (mounted) {
            setUserRole(profile?.role || null);
          }
        } catch (error) {
          console.error('Error checking access:', error);
        }
      }
      if (mounted) {
        setCheckingRole(false);
      }
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [user, checkSuspension]);

  // Show loading state while checking authentication
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin routes, only redirect if we're sure the user is not an admin
  if (isAdmin && userRole && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // For student routes, only redirect if we're sure the user is not a student
  if (!isAdmin && userRole && userRole !== 'student') {
    return <Navigate to="/" replace />;
  }

  // If we're still checking the role or the role matches, render the children
  return <>{children}</>;
} 