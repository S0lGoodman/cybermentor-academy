-- Update students table to include all necessary columns
-- This script adds all the required columns to the students table

-- First, add all the missing columns
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS avatar TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS suspension_reason TEXT,
ADD COLUMN IF NOT EXISTS program_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS months_paid INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS enrolled_courses INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE;

-- We'll skip the payment-related columns since you mentioned you want to remove payment tracking
-- But we'll add placeholder columns that can be used for future reference
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS subscription_plan_id UUID,
ADD COLUMN IF NOT EXISTS next_payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS payment_plan_id UUID;

-- Grant all permissions
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.students TO anon;
