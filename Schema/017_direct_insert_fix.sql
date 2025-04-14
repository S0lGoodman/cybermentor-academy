-- This is a direct SQL fix to ensure the profiles table allows new students to be created

-- First, ensure the status column has the correct default
ALTER TABLE profiles 
ALTER COLUMN status SET DEFAULT 'active';

-- Make sure all required columns have appropriate defaults
ALTER TABLE profiles 
ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE profiles 
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Ensure the role column has a default value
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'student';

-- Make sure any potentially problematic columns are nullable
DO $$
BEGIN
  -- Check if payment_plan_id column exists and make it nullable
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'payment_plan_id'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN payment_plan_id DROP NOT NULL;
  END IF;
  
  -- Check if program_start_date column exists and make it nullable
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'program_start_date'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN program_start_date DROP NOT NULL;
  END IF;
  
  -- Check if months_paid column exists and make it nullable
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'months_paid'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN months_paid DROP NOT NULL;
  END IF;
END $$;

-- Create a policy to allow inserting into profiles
CREATE POLICY insert_profiles ON profiles FOR INSERT
    WITH CHECK (true);

-- Grant insert privileges on profiles to authenticated users
GRANT INSERT ON profiles TO authenticated;

-- Create a simplified function for checking payment due status
CREATE OR REPLACE FUNCTION check_payment_due()
RETURNS void AS $$
BEGIN
  -- Update profiles to payment_due status if they're past due
  UPDATE profiles
  SET status = 'payment_due'
  WHERE 
    role = 'student' 
    AND status = 'active'
    AND created_at < (NOW() - INTERVAL '1 month' - INTERVAL '3 days');
END;
$$ LANGUAGE plpgsql;
