-- Complete Payment Removal
-- This script completely removes all payment-related fields and dependencies from all tables

-- First, disable all triggers to avoid any conflicts
SET session_replication_role = 'replica';

-- Drop the subscription_plans table if it exists
DROP TABLE IF EXISTS public.subscription_plans CASCADE;

-- Drop the payment_plans table if it exists
DROP TABLE IF EXISTS public.payment_plans CASCADE;

-- Drop the payments table if it exists
DROP TABLE IF EXISTS public.payments CASCADE;

-- Remove payment-related columns from the students table
ALTER TABLE IF EXISTS public.students 
DROP COLUMN IF EXISTS subscription_plan_id,
DROP COLUMN IF EXISTS payment_plan_id,
DROP COLUMN IF EXISTS next_payment_date,
DROP COLUMN IF EXISTS last_payment_date;

-- Remove payment-related columns from the profiles table
ALTER TABLE IF EXISTS public.profiles 
DROP COLUMN IF EXISTS subscription_plan_id,
DROP COLUMN IF EXISTS payment_plan_id,
DROP COLUMN IF EXISTS next_payment_date,
DROP COLUMN IF EXISTS last_payment_date;

-- Drop any triggers that might reference payment-related tables
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  FOR trigger_record IN 
    SELECT trigger_name, event_object_table
    FROM information_schema.triggers
    WHERE action_statement LIKE '%subscription_plan%' OR 
          action_statement LIKE '%payment%'
  LOOP
    EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || 
            ' ON ' || trigger_record.event_object_table;
  END LOOP;
END $$;

-- Drop any functions that might reference payment-related tables
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT proname
    FROM pg_proc 
    WHERE prosrc LIKE '%subscription_plan%' OR 
          prosrc LIKE '%payment%'
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || func_record.proname || ' CASCADE';
  END LOOP;
END $$;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Create a clean function for handling user confirmation
CREATE OR REPLACE FUNCTION public.handle_user_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user confirms their email, update their status in the students table
  IF NEW.confirmed_at IS NOT NULL AND OLD.confirmed_at IS NULL THEN
    UPDATE public.students
    SET status = 'active'
    WHERE id = NEW.id;
    
    -- Also update the profiles table
    UPDATE public.profiles
    SET status = 'active'
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update student status on confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.confirmed_at IS NOT NULL AND OLD.confirmed_at IS NULL)
  EXECUTE FUNCTION public.handle_user_confirmation();

-- Create a clean function for handling invited users
CREATE OR REPLACE FUNCTION public.handle_invited_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is a new user from an invitation
  IF NEW.email IS NOT NULL THEN
    -- Check if there's a student record with this email but different ID
    DECLARE
      student_id UUID;
    BEGIN
      SELECT id INTO student_id FROM public.students WHERE email = NEW.email AND id != NEW.id;
      
      IF student_id IS NOT NULL THEN
        -- Update the student record with the new user ID
        UPDATE public.students
        SET id = NEW.id
        WHERE id = student_id;
        
        -- Update the profile record with the new user ID
        UPDATE public.profiles
        SET id = NEW.id
        WHERE id = student_id;
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to handle invited users
DROP TRIGGER IF EXISTS on_auth_user_invited ON auth.users;
CREATE TRIGGER on_auth_user_invited
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_invited_user();
