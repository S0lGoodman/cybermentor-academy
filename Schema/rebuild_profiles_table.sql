-- Rebuild Profiles Table
-- This script completely rebuilds the profiles table from scratch

-- First, disable all triggers to avoid any conflicts
SET session_replication_role = 'replica';

-- Backup existing data
CREATE TEMPORARY TABLE temp_profiles AS
SELECT 
  id, 
  email, 
  name, 
  role, 
  status, 
  created_at, 
  updated_at
FROM public.profiles;

-- Drop the existing table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create a clean profiles table with no payment-related fields
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restore the data
INSERT INTO public.profiles (
  id, 
  email, 
  name, 
  role, 
  status, 
  created_at, 
  updated_at
)
SELECT 
  id, 
  email, 
  name, 
  role, 
  status, 
  created_at, 
  updated_at
FROM temp_profiles;

-- Drop the temporary table
DROP TABLE temp_profiles;

-- Grant permissions
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable triggers
SET session_replication_role = 'origin';
