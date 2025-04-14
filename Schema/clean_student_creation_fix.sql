-- Clean script to fix student creation
-- This script focuses only on the essential parts needed for student creation

-- 1. Make sure the profiles table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create a simple function to create a student profile
CREATE OR REPLACE FUNCTION public.create_student_profile(
  student_id UUID,
  student_email TEXT,
  student_name TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Insert the profile record
  INSERT INTO public.profiles (id, email, name, role, status, created_at, updated_at)
  VALUES (
    student_id,
    student_email,
    student_name,
    'student',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = 'student',
    status = 'active',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT EXECUTE ON FUNCTION public.create_student_profile TO service_role;

-- 4. Create a simple RLS policy that allows the service role to manage profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow service role to manage profiles" ON public.profiles;

-- Create a policy that allows the service role to manage all profiles
CREATE POLICY "Allow service role to manage profiles" 
ON public.profiles 
FOR ALL 
TO service_role
USING (true);

-- 5. Create a policy that allows users to read their own profile
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.profiles;
CREATE POLICY "Allow users to read own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);
