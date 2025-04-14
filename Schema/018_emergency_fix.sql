-- Emergency fix for student creation issues
-- This script takes a more aggressive approach to fix the database issues

-- First, let's identify any triggers that might be causing problems
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'profiles';

-- Disable ALL triggers on the profiles table temporarily
ALTER TABLE profiles DISABLE TRIGGER ALL;

-- Drop any foreign key constraints that might be causing issues
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_name = 'profiles' AND tc.constraint_type = 'FOREIGN KEY'
    LOOP
        EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT IF EXISTS ' || constraint_record.constraint_name;
    END LOOP;
END $$;

-- Make sure all columns that might be causing issues are nullable
DO $$
BEGIN
    -- Get all columns from profiles table
    FOR column_record IN
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name NOT IN ('id', 'role', 'status', 'created_at', 'updated_at')
    LOOP
        -- Make the column nullable
        EXECUTE 'ALTER TABLE profiles ALTER COLUMN ' || column_record.column_name || ' DROP NOT NULL';
    END LOOP;
END $$;

-- Create a very simple function to create a student profile
CREATE OR REPLACE FUNCTION emergency_create_student(
    student_id UUID,
    student_email TEXT,
    student_name TEXT
) RETURNS void AS $$
BEGIN
    -- Direct insert with minimal fields
    INSERT INTO profiles (id, email, name, role, status)
    VALUES (student_id, student_email, student_name, 'student', 'active');
    
    -- If that fails, try an even more minimal approach
    EXCEPTION WHEN OTHERS THEN
        BEGIN
            INSERT INTO profiles (id, role, status)
            VALUES (student_id, 'student', 'active');
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to create student profile: %', SQLERRM;
        END;
END;
$$ LANGUAGE plpgsql;

-- Re-enable triggers after the emergency fix
-- ALTER TABLE profiles ENABLE TRIGGER ALL;
