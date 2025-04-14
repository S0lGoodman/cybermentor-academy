-- Simple profiles table setup
-- This script ensures the profiles table exists with minimal constraints

-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS temporarily to allow direct inserts
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions to service_role
GRANT ALL ON public.profiles TO service_role;

-- Create a simple function to create a student profile
CREATE OR REPLACE FUNCTION public.simple_create_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Insert the profile record
  INSERT INTO public.profiles (id, email, name, role, status, created_at, updated_at)
  VALUES (
    user_id,
    user_email,
    user_name,
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

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.simple_create_profile TO service_role;
