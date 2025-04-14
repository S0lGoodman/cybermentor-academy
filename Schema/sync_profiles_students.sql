-- Sync Profiles and Students Tables
-- This script sets up a relationship between the profiles and students tables

-- First, ensure both tables exist with the correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make sure the students table has all required columns
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'invited',
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar TEXT,
  suspended_until TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT,
  program_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  months_paid INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  enrolled_courses INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE,
  subscription_plan_id UUID,
  next_payment_date TIMESTAMP WITH TIME ZONE,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  payment_plan_id UUID
);

-- Grant permissions
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.students TO anon;

-- Disable RLS on both tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Create a function to sync student data to profiles
CREATE OR REPLACE FUNCTION sync_student_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- When a student is created or updated, update the corresponding profile
  INSERT INTO public.profiles (id, email, name, role, status, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.name,
    'student',
    NEW.status,
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    email = NEW.email,
    name = NEW.name,
    role = 'student',
    status = NEW.status,
    updated_at = NEW.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to sync student data to profiles
DROP TRIGGER IF EXISTS sync_student_profile_trigger ON public.students;
CREATE TRIGGER sync_student_profile_trigger
AFTER INSERT OR UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION sync_student_to_profile();

-- Create a function to check if a profile should be in the students table
CREATE OR REPLACE FUNCTION sync_student_role_profiles()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync profiles with role='student'
  IF NEW.role = 'student' THEN
    -- Check if this profile exists in the students table
    IF NOT EXISTS (SELECT 1 FROM public.students WHERE id = NEW.id) THEN
      -- Insert into students table
      INSERT INTO public.students (
        id, email, name, status, role, created_at, updated_at
      ) VALUES (
        NEW.id, NEW.email, NEW.name, NEW.status, 'student', NEW.created_at, NEW.updated_at
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to sync student role profiles
DROP TRIGGER IF EXISTS sync_student_role_trigger ON public.profiles;
CREATE TRIGGER sync_student_role_trigger
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
WHEN (NEW.role = 'student')
EXECUTE FUNCTION sync_student_role_profiles();
