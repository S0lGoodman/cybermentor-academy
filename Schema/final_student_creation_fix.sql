-- Final script to fix student creation issues
-- This script ensures the profiles table has the correct structure and permissions

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

-- 2. Ensure the table has the correct permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- 3. Disable RLS temporarily to fix any existing issues
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 4. Create a simple function to create a student profile
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
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.create_student_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_student_profile TO service_role;

-- 6. Create a direct SQL function as a fallback
CREATE OR REPLACE FUNCTION public.direct_create_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  user_role TEXT DEFAULT 'student',
  user_status TEXT DEFAULT 'active'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, status, created_at, updated_at)
  VALUES (
    user_id,
    user_email,
    user_name,
    user_role,
    user_status,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant execute permission on the fallback function
GRANT EXECUTE ON FUNCTION public.direct_create_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.direct_create_profile TO service_role;
