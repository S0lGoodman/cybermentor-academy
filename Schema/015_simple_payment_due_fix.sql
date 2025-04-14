-- This is a simplified fix for payment due status tracking
-- It focuses only on the essential functionality without extensive schema changes

-- First, ensure the profiles table has the payment_due status option
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name for the status column
    SELECT c.conname INTO constraint_name
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE c.conrelid = 'profiles'::regclass
    AND a.attname = 'status'
    AND c.contype = 'c';

    -- If constraint exists, drop it and recreate with the new value
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT ' || constraint_name;
        
        -- Recreate the constraint with the payment_due value
        EXECUTE 'ALTER TABLE profiles ADD CONSTRAINT ' || constraint_name || 
                ' CHECK (status IN (''active'', ''inactive'', ''invited'', ''suspended'', ''payment_due''))';
    ELSE
        -- If no constraint exists, add the column with the check constraint
        -- First check if the status column exists
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'status'
        ) THEN
            -- Add check constraint to existing column
            ALTER TABLE profiles 
            ADD CONSTRAINT profiles_status_check 
            CHECK (status IN ('active', 'inactive', 'invited', 'suspended', 'payment_due'));
        ELSE
            -- Add the status column with constraint
            ALTER TABLE profiles 
            ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
            CHECK (status IN ('active', 'inactive', 'invited', 'suspended', 'payment_due'));
        END IF;
    END IF;
END $$;

-- Create a simple function to check for payment due based on join date
CREATE OR REPLACE FUNCTION check_payment_due()
RETURNS void AS $$
DECLARE
    profile_record RECORD;
    current_date TIMESTAMP WITH TIME ZONE := TIMEZONE('utc'::text, NOW());
    join_date TIMESTAMP WITH TIME ZONE;
    next_payment_date TIMESTAMP WITH TIME ZONE;
    payment_due BOOLEAN;
BEGIN
    -- Loop through all student profiles
    FOR profile_record IN 
        SELECT id, created_at, status
        FROM profiles
        WHERE role = 'student' 
        AND status != 'suspended'
    LOOP
        -- Get the join date
        join_date := profile_record.created_at;
        
        -- Calculate the next payment date (monthly from join date)
        -- This finds the next monthly payment date after the current date
        next_payment_date := join_date;
        WHILE next_payment_date <= current_date LOOP
            next_payment_date := next_payment_date + INTERVAL '1 month';
        END LOOP;
        
        -- Check if the previous payment date is more than 3 days ago
        -- (i.e., payment was due more than 3 days ago)
        payment_due := (next_payment_date - INTERVAL '1 month' + INTERVAL '3 days') < current_date;
        
        -- Update profile status based on payment status
        IF payment_due AND profile_record.status != 'payment_due' THEN
            -- Set status to payment_due
            UPDATE profiles SET status = 'payment_due' WHERE id = profile_record.id;
        ELSIF NOT payment_due AND profile_record.status = 'payment_due' THEN
            -- If payment is not due but status is payment_due, revert to active
            UPDATE profiles SET status = 'active' WHERE id = profile_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a simple function to mark a payment as paid
CREATE OR REPLACE FUNCTION mark_payment_paid(user_id UUID)
RETURNS void AS $$
BEGIN
    -- Simply update the profile status to active
    UPDATE profiles
    SET status = 'active'
    WHERE id = user_id AND status = 'payment_due';
END;
$$ LANGUAGE plpgsql;

-- Run the check_payment_due function once to initialize payment statuses
SELECT check_payment_due();
