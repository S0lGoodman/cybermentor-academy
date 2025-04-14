-- First, check if the profiles table has a status column with a check constraint
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
        
        -- Recreate the constraint with the new value
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

-- Create a function to update profile status based on payment status
CREATE OR REPLACE FUNCTION update_profile_payment_status()
RETURNS TRIGGER AS $$
BEGIN
    -- If payment status is 'due_soon' or 'overdue', update profile status to 'payment_due'
    IF NEW.payment_status IN ('due_soon', 'overdue') THEN
        UPDATE profiles
        SET status = 'payment_due'
        WHERE id = NEW.user_id AND status != 'suspended';
    -- If payment status is 'paid', update profile status back to 'active' if it was 'payment_due'
    ELSIF NEW.payment_status = 'paid' THEN
        UPDATE profiles
        SET status = 'active'
        WHERE id = NEW.user_id AND status = 'payment_due';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on payments table
DROP TRIGGER IF EXISTS payment_status_update_trigger ON payments;
CREATE TRIGGER payment_status_update_trigger
AFTER INSERT OR UPDATE OF payment_status ON payments
FOR EACH ROW
EXECUTE FUNCTION update_profile_payment_status();

-- Update existing profiles with payment_due status based on current payments
DO $$
BEGIN
    -- Set profiles to 'payment_due' if they have payments with 'due_soon' or 'overdue' status
    UPDATE profiles p
    SET status = 'payment_due'
    FROM payments pm
    WHERE p.id = pm.user_id
    AND pm.payment_status IN ('due_soon', 'overdue')
    AND p.status != 'suspended';
END $$;
