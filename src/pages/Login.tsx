import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useSidebar } from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "../components/ui/alert";
import { supabase } from "../lib/supabase";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setIsAdmin } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      
      // After successful login, check user role and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', user.id)
          .single();
        
        // Check if account is suspended
        if (profile?.status === 'suspended') {
          throw new Error("لا يمكنك الوصول إلى الأكاديمية في الوقت الحالي! يرجى الاتصال بالدعم");
        }
        
        // Set localStorage values
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', profile?.role || 'student');
        
        // Set success state and delay navigation for animation
        setIsSuccess(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (profile?.role === 'admin') {
          setIsAdmin(true);
          navigate("/admin/dashboard");
        } else {
          setIsAdmin(false);
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-background to-teal-500/20" 
      />
      
      <Card className="w-full max-w-md mx-4 relative backdrop-blur-xl bg-white/10 dark:bg-black/10 border-white/20 dark:border-white/10 shadow-lg ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-white/10 to-transparent rounded-lg" 
        />
        <CardHeader className="space-y-4 text-center relative">
          <motion.div 
            className="flex justify-center"
            animate={
              isSuccess 
                ? { scale: [1, 1.2, 1], rotate: [0, 360, 360] }
                : isLoading 
                  ? { scale: 0.8 }
                  : { scale: 1 }
            }
            transition={{ 
              duration: isSuccess ? 1.5 : 0.5,
              ease: isSuccess ? "easeInOut" : "easeOut"
            }}
          >
            <img 
              src="/logo.png" 
              alt="Cyber Mentor Academy" 
              className="w-24 h-24 object-contain"
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {!isSuccess && (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                  سايبر مينتور اكاديمي
                </CardTitle>
                <CardDescription className="text-muted-foreground/80">
                  تسجيل الدخول
                </CardDescription>
              </motion.div>
            )}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center space-y-2"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-xl font-medium text-foreground">
                    تم تسجيل الدخول بنجاح
                  </CardTitle>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent className="relative">
          <AnimatePresence mode="wait">
            {!isSuccess && (
              <motion.form 
                onSubmit={handleLogin} 
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="space-y-2"
                  animate={isLoading ? { 
                    opacity: 0.5,
                    y: -10,
                    transition: { duration: 0.2 }
                  } : {
                    opacity: 1,
                    y: 0
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 backdrop-blur-sm focus:bg-white/20 dark:focus:bg-white/10 transition-colors placeholder:text-muted-foreground/70"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  animate={isLoading ? { 
                    opacity: 0.5,
                    y: -10,
                    transition: { duration: 0.2, delay: 0.1 }
                  } : {
                    opacity: 1,
                    y: 0
                  }}
                >
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 backdrop-blur-sm focus:bg-white/20 dark:focus:bg-white/10 transition-colors placeholder:text-muted-foreground/70"
                    required
                    disabled={isLoading}
                  />
                </motion.div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                      <AlertDescription className="text-red-500">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                <motion.div
                  animate={isLoading ? { 
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  } : {
                    scale: 1
                  }}
                >
                  <Button
                    type="submit"
                    className={cn(
                      "w-full font-medium bg-gradient-to-r from-sky-500 to-green-500 text-white hover:from-sky-600 hover:to-green-600 shadow-lg backdrop-blur-sm",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isLoading}
                  >
                    {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 