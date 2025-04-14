-- Fix Missing Profiles Script
-- This script creates profiles for any existing users that don't have them

-- First, ensure the profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'invited',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles for any users that don't have them
INSERT INTO public.profiles (id, email, name, role, status, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.raw_user_meta_data->>'full_name', au.email),
  'student',
  'invited',
  NOW(),
  NOW()
FROM 
  auth.users au
LEFT JOIN 
  public.profiles p ON au.id = p.id
WHERE 
  p.id IS NULL
ON CONFLICT (id) DO NOTHING;
