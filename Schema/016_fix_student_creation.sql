-- This SQL script is designed to fix the student creation issue
-- by examining and fixing any constraints or triggers that might be causing problems

-- First, let's check the structure of the profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Check for any constraints on the profiles table
SELECT con.conname AS constraint_name,
       con.contype AS constraint_type,
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'profiles';

-- Check for any triggers on the profiles table
SELECT trigger_name, 
       event_manipulation, 
       action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- Fix: Modify the profiles table to make problematic columns nullable or provide defaults
ALTER TABLE profiles 
ALTER COLUMN status SET DEFAULT 'active';

-- If there are any foreign key constraints causing issues, temporarily disable them
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_payment_plan_id_fkey;

-- If there are any check constraints causing issues, temporarily disable them
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
-- Then recreate with the correct values
-- ALTER TABLE profiles ADD CONSTRAINT profiles_status_check 
--   CHECK (status IN ('active', 'inactive', 'invited', 'suspended', 'payment_due'));

-- If there are any triggers causing issues, temporarily disable them
-- DROP TRIGGER IF EXISTS check_payment_status_trigger ON profiles;

-- Create a simplified function for student creation that avoids complex logic
CREATE OR REPLACE FUNCTION create_student_profile(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
) RETURNS void AS $$
BEGIN
  -- Simple insert with minimal fields
  INSERT INTO profiles (
    id, 
    email, 
    name, 
    role, 
    status,
    created_at, 
    updated_at
  ) 
  VALUES (
    user_id,
    user_email,
    user_name,
    'student',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = 'student',
    status = 'active',
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
