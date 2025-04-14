import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  checkSuspension: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkSuspension = async () => {
    if (!user) return false;

    // EMERGENCY FIX: Check if admin by email domain
    const isAdminByEmail = user.email?.endsWith('@cybermentor.ma') || false;

    // Admins bypass suspension checks
    if (isAdminByEmail) {
      return false;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .single();

    // Admins bypass suspension checks
    if (profile?.role === 'admin') {
      return false;
    }

    // Check for both suspended and payment_due statuses
    if (profile?.status === 'suspended' || profile?.status === 'payment_due') {
      // Clear auth data and return true to indicate access restriction
      localStorage.clear();
      await signOut();
      return true;
    }

    return false;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser)

      if (newUser) {
        // Check suspension status whenever auth state changes
        const isSuspended = await checkSuspension();
        if (isSuspended) {
          setUser(null);
        }
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Check access restrictions immediately after sign in
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      // EMERGENCY FIX: Check if admin by email domain
      const isAdminByEmail = currentUser.email?.endsWith('@cybermentor.ma') || false;

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('status, role')
        .eq('id', currentUser.id)
        .single();

      // EMERGENCY FIX: If admin by email but profile doesn't exist or doesn't have admin role
      if (isAdminByEmail && (!profile || profile.role !== 'admin')) {
        // Create or update profile to ensure admin role
        await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            email: currentUser.email,
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      // Only check restrictions for non-admin users
      if (!isAdminByEmail && profile?.role !== 'admin') {
        // Check for specific status to provide more detailed error messages
        if (profile?.status === 'suspended') {
          await signOut();
          throw new Error("لا يمكنك الوصول إلى الأكاديمية في الوقت الحالي! يرجى الاتصال بالدعم");
        }

        if (profile?.status === 'payment_due') {
          await signOut();
          throw new Error("لا يمكنك الوصول إلى الأكاديمية بسبب وجود دفعات مستحقة! يرجى تسوية المدفوعات المستحقة");
        }
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, checkSuspension }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}