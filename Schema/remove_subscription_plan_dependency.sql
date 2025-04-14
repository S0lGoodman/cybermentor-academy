-- Remove Subscription Plan Dependency
-- This script completely removes the subscription_plan_id field and any related dependencies

-- First, disable all triggers to avoid any conflicts
SET session_replication_role = 'replica';

-- Drop the foreign key constraint
ALTER TABLE IF EXISTS public.students 
DROP CONSTRAINT IF EXISTS students_subscription_plan_id_fkey;

-- Remove the subscription_plan_id column from the students table
ALTER TABLE IF EXISTS public.students 
DROP COLUMN IF EXISTS subscription_plan_id;

-- Remove other payment-related columns that might cause issues
ALTER TABLE IF EXISTS public.students 
DROP COLUMN IF EXISTS payment_plan_id,
DROP COLUMN IF EXISTS next_payment_date,
DROP COLUMN IF EXISTS last_payment_date;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Update the invitation logic without any payment-related fields
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

-- Create a function to handle new user creation from invites
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
