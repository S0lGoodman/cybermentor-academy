-- Remove all payment references and fix profiles table
-- This script removes all payment-related columns and references

-- First, disable any triggers that might be causing issues
ALTER TABLE IF EXISTS public.profiles DISABLE TRIGGER ALL;

-- Remove payment-related columns from profiles if they exist
DO $$
BEGIN
  -- Remove subscription_plan_id column if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_plan_id'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN subscription_plan_id;
  END IF;

  -- Remove payment_plan_id column if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'payment_plan_id'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN payment_plan_id;
  END IF;

  -- Remove any other payment-related columns
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN payment_status;
  END IF;
END $$;

-- Drop any payment-related tables if they exist
DROP TABLE IF EXISTS public.subscription_plans CASCADE;
DROP TABLE IF EXISTS public.payment_plans CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;

-- Recreate the profiles table with minimal structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'student',
  status TEXT DEFAULT 'invited',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove any foreign key constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_payment_plan_id_fkey;

-- Disable RLS to allow direct inserts
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Re-enable triggers
ALTER TABLE IF EXISTS public.profiles ENABLE TRIGGER ALL;
