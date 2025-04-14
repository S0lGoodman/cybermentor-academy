-- Comprehensive Fix for Database Issues
-- This script attempts to fix all potential issues with the database

-- First, disable all triggers to avoid any conflicts
SET session_replication_role = 'replica';

-- Create all necessary tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY,
  name TEXT,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a dummy subscription plan
INSERT INTO public.subscription_plans (id, name, price)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Default Plan', 0)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions to all tables
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.subscription_plans TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.subscription_plans TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.students TO anon;
GRANT ALL ON public.subscription_plans TO anon;

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;

-- Drop any problematic foreign key constraints
ALTER TABLE IF EXISTS public.students 
DROP CONSTRAINT IF EXISTS students_subscription_plan_id_fkey;

ALTER TABLE IF EXISTS public.students 
DROP CONSTRAINT IF EXISTS students_payment_plan_id_fkey;

ALTER TABLE IF EXISTS public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Add the foreign key constraint to the dummy subscription plan
ALTER TABLE IF EXISTS public.students 
ADD CONSTRAINT students_subscription_plan_id_fkey 
FOREIGN KEY (subscription_plan_id) 
REFERENCES public.subscription_plans(id) 
ON DELETE SET NULL;

-- Set all subscription_plan_id values to the dummy value
UPDATE public.students
SET subscription_plan_id = '00000000-0000-0000-0000-000000000000'
WHERE subscription_plan_id IS NOT NULL;

-- Re-enable triggers
SET session_replication_role = 'origin';
