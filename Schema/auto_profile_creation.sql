-- Auto Profile Creation Script
-- This script sets up a trigger to automatically create profiles when users are invited

-- Make sure the profiles table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'invited',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS to allow direct inserts
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Create a trigger function to automatically create profiles when users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract name from metadata if available
  DECLARE
    user_name TEXT;
  BEGIN
    user_name := COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      new.email
    );
    
    -- Insert the profile
    INSERT INTO public.profiles (id, email, name, role, status)
    VALUES (
      new.id,
      new.email,
      user_name,
      'student',
      'invited'
    )
    ON CONFLICT (id) DO NOTHING;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
