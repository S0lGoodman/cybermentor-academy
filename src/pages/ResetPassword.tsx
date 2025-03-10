import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get URL parameters
  const token = searchParams.get("token") || searchParams.get("code");
  const email = searchParams.get("email");

  // Debug: Log URL parameters
  useEffect(() => {
    console.log("URL parameters:", {
      token,
      email,
      allParams: Object.fromEntries(searchParams.entries())
    });
  }, [searchParams, token, email]);

  // Redirect if no token or email
  useEffect(() => {
    if (!token || !email) {
      console.log("Missing token or email");
      toast({
        title: "Error",
        description: "Invalid reset link. Please request a new one.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [token, email, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!token || !email) {
        throw new Error("Missing required parameters");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // First, verify the token and get a session
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'invite'
      });

      if (verifyError) {
        throw verifyError;
      }

      // Now that we have a session, update the password
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      if (!updateData.user) {
        throw new Error("Failed to update user");
      }

      // Update user metadata
      await supabase.auth.updateUser({
        data: { is_new_user: false }
      });

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', updateData.user.id)
        .single();

      toast({
        title: "Success",
        description: "Your password has been set successfully.",
      });

      // Redirect based on role
      navigate(`/${profile?.role || 'student'}/dashboard`);

    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set password. Please try again.",
        variant: "destructive",
      });
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Set Your Password</h1>
          <p className="text-muted-foreground">
            Please create a secure password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Setting Password..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
} 