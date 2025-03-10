import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function ProtectedRoute({ children, isAdmin }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
      setCheckingRole(false);
    };

    checkUserRole();
  }, [user]);

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

  // Check role-based access
  if (isAdmin && userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && userRole !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 