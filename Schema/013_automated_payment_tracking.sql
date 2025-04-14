-- Create subscription_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  billing_cycle_days INTEGER NOT NULL, -- Number of days between payments (e.g., 30 for monthly)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default subscription plans if they don't exist
INSERT INTO subscription_plans (name, description, price, billing_cycle_days)
VALUES 
  ('Monthly', 'Monthly subscription plan', 500, 30),
  ('Quarterly', 'Quarterly subscription plan', 1350, 90),
  ('Annual', 'Annual subscription plan', 5000, 365)
ON CONFLICT DO NOTHING;

-- Add subscription_plan_id to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_plan_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_plan_id UUID REFERENCES subscription_plans(id);
  END IF;
END $$;

-- Add next_payment_date to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'next_payment_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN next_payment_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add last_payment_date to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_payment_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_payment_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create function to automatically set next payment date when a subscription plan is assigned
CREATE OR REPLACE FUNCTION set_next_payment_date()
RETURNS TRIGGER AS $$
DECLARE
  cycle_days INTEGER;
BEGIN
  -- Get the billing cycle days from the subscription plan
  SELECT billing_cycle_days INTO cycle_days
  FROM subscription_plans
  WHERE id = NEW.subscription_plan_id;
  
  -- If subscription plan is set and next_payment_date is not set, set it
  IF NEW.subscription_plan_id IS NOT NULL AND NEW.next_payment_date IS NULL THEN
    -- Set next payment date to current date + billing cycle days
    NEW.next_payment_date := TIMEZONE('utc'::text, NOW()) + (cycle_days || ' days')::INTERVAL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set next payment date when subscription plan is assigned
DROP TRIGGER IF EXISTS set_next_payment_date_trigger ON profiles;
CREATE TRIGGER set_next_payment_date_trigger
BEFORE INSERT OR UPDATE OF subscription_plan_id ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_next_payment_date();

-- Create function to check for upcoming and overdue payments
CREATE OR REPLACE FUNCTION check_payment_statuses()
RETURNS void AS $$
DECLARE
  upcoming_payment_days INTEGER := 3; -- Days before payment to mark as due_soon
BEGIN
  -- Create payments for profiles with upcoming payments (within 3 days)
  INSERT INTO payments (user_id, amount, due_date, payment_status)
  SELECT 
    p.id, 
    sp.price, 
    p.next_payment_date, 
    'due_soon'
  FROM 
    profiles p
    JOIN subscription_plans sp ON p.subscription_plan_id = sp.id
  WHERE 
    p.next_payment_date IS NOT NULL
    AND p.next_payment_date <= TIMEZONE('utc'::text, NOW()) + (upcoming_payment_days || ' days')::INTERVAL
    AND p.next_payment_date > TIMEZONE('utc'::text, NOW())
    AND NOT EXISTS (
      -- Check if there's already a payment record for this due date
      SELECT 1 FROM payments 
      WHERE user_id = p.id 
      AND due_date = p.next_payment_date
    );
    
  -- Update payment status to overdue for payments that are past due
  UPDATE payments
  SET payment_status = 'overdue'
  WHERE 
    payment_status = 'due_soon'
    AND due_date < TIMEZONE('utc'::text, NOW());
    
  -- Update profile status based on payment status
  -- This will trigger the update_profile_payment_status function
  -- from the previous migration
END;
$$ LANGUAGE plpgsql;

-- Create function to process a payment
CREATE OR REPLACE FUNCTION process_payment(user_id UUID, payment_amount NUMERIC)
RETURNS void AS $$
DECLARE
  cycle_days INTEGER;
  current_plan_id UUID;
BEGIN
  -- Get the user's subscription plan
  SELECT subscription_plan_id INTO current_plan_id
  FROM profiles
  WHERE id = user_id;
  
  -- Get the billing cycle days
  SELECT billing_cycle_days INTO cycle_days
  FROM subscription_plans
  WHERE id = current_plan_id;
  
  -- Update the most recent unpaid payment to paid
  UPDATE payments
  SET 
    payment_status = 'paid',
    amount = payment_amount
  WHERE 
    user_id = user_id
    AND payment_status IN ('due_soon', 'overdue')
    AND due_date = (
      SELECT MAX(due_date)
      FROM payments
      WHERE user_id = user_id AND payment_status IN ('due_soon', 'overdue')
    );
    
  -- Update profile's payment dates
  UPDATE profiles
  SET 
    last_payment_date = TIMEZONE('utc'::text, NOW()),
    next_payment_date = TIMEZONE('utc'::text, NOW()) + (cycle_days || ' days')::INTERVAL,
    status = 'active'
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the check_payment_statuses function daily
-- Note: This requires the pg_cron extension to be enabled
-- If pg_cron is not available, this can be handled by a scheduled serverless function
DO $$
BEGIN
  -- Check if pg_cron extension exists
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Schedule the job to run daily at midnight
    PERFORM cron.schedule('0 0 * * *', 'SELECT check_payment_statuses()');
  END IF;
END $$;

-- Set default subscription plan for existing students
UPDATE profiles
SET subscription_plan_id = (SELECT id FROM subscription_plans WHERE name = 'Monthly')
WHERE role = 'student' AND subscription_plan_id IS NULL;

-- Run the check_payment_statuses function once to initialize payment records
SELECT check_payment_statuses();
