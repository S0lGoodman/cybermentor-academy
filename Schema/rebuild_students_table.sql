-- Rebuild Students Table
-- This script completely rebuilds the students table from scratch

-- First, disable all triggers to avoid any conflicts
SET session_replication_role = 'replica';

-- Backup existing data
CREATE TEMPORARY TABLE temp_students AS
SELECT 
  id, 
  email, 
  name, 
  status, 
  role, 
  created_at, 
  updated_at, 
  avatar, 
  suspended_until, 
  suspension_reason, 
  program_start_date, 
  months_paid, 
  progress, 
  enrolled_courses, 
  last_active
FROM public.students;

-- Drop the existing table
DROP TABLE IF EXISTS public.students CASCADE;

-- Create a clean students table with no payment-related fields
CREATE TABLE public.students (
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
  last_active TIMESTAMP WITH TIME ZONE
);

-- Restore the data
INSERT INTO public.students (
  id, 
  email, 
  name, 
  status, 
  role, 
  created_at, 
  updated_at, 
  avatar, 
  suspended_until, 
  suspension_reason, 
  program_start_date, 
  months_paid, 
  progress, 
  enrolled_courses, 
  last_active
)
SELECT 
  id, 
  email, 
  name, 
  status, 
  role, 
  created_at, 
  updated_at, 
  avatar, 
  suspended_until, 
  suspension_reason, 
  program_start_date, 
  months_paid, 
  progress, 
  enrolled_courses, 
  last_active
FROM temp_students;

-- Drop the temporary table
DROP TABLE temp_students;

-- Grant permissions
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.students TO anon;

-- Disable RLS
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- Re-enable triggers
SET session_replication_role = 'origin';
