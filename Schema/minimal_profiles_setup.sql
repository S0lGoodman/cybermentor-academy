-- Minimal setup for profiles table
-- This script only ensures the table exists and has basic permissions

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
