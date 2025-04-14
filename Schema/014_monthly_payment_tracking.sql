-- Create payment_plans table with just two options: monthly and one-time
CREATE TABLE IF NOT EXISTS payment_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  is_one_time BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert the two payment plan options
INSERT INTO payment_plans (name, description, price, is_one_time)
VALUES 
  ('Monthly', 'Monthly payment plan for 6 months', 500, FALSE),
  ('Full Program', 'One-time payment for the entire 6-month program', 2700, TRUE)
ON CONFLICT DO NOTHING;

-- Add payment_plan_id to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'payment_plan_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN payment_plan_id UUID REFERENCES payment_plans(id);
  END IF;
END $$;

-- Add program_start_date to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'program_start_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN program_start_date TIMESTAMP WITH TIME ZONE;
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

-- Add months_paid to profiles if it doesn't exist (to track how many months have been paid)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'months_paid'
  ) THEN
    ALTER TABLE profiles ADD COLUMN months_paid INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create function to check payment status based on monthly cycles
CREATE OR REPLACE FUNCTION check_monthly_payment_status()
RETURNS void AS $$
DECLARE
  profile_record RECORD;
  current_date TIMESTAMP WITH TIME ZONE := TIMEZONE('utc'::text, NOW());
  next_payment_date TIMESTAMP WITH TIME ZONE;
  payment_due BOOLEAN;
  grace_period_days INTEGER := 3; -- Days of grace period after payment is due
BEGIN
  -- Loop through all student profiles with a program start date
  FOR profile_record IN 
    SELECT id, program_start_date, payment_plan_id, last_payment_date, months_paid, status
    FROM profiles
    WHERE role = 'student' 
    AND program_start_date IS NOT NULL
  LOOP
    -- Skip one-time payment plans that are fully paid
    IF EXISTS (
      SELECT 1 FROM payment_plans 
      WHERE id = profile_record.payment_plan_id 
      AND is_one_time = TRUE
      AND profile_record.months_paid > 0
    ) THEN
      -- Ensure status is active for paid one-time plans
      IF profile_record.status = 'payment_due' THEN
        UPDATE profiles SET status = 'active' WHERE id = profile_record.id;
      END IF;
      CONTINUE;
    END IF;
    
    -- For monthly plans, calculate the next payment date
    -- Next payment is due one month after program start date, then monthly after that
    next_payment_date := profile_record.program_start_date + 
                        ((profile_record.months_paid + 1) * INTERVAL '1 month');
    
    -- Check if payment is due (current date is past next payment date + grace period)
    payment_due := current_date > (next_payment_date + (grace_period_days * INTERVAL '1 day'))
                  AND profile_record.months_paid < 6; -- Only check for the 6-month program duration
    
    -- Update profile status based on payment status
    IF payment_due AND profile_record.status != 'suspended' THEN
      -- Set status to payment_due
      UPDATE profiles SET status = 'payment_due' WHERE id = profile_record.id;
      
      -- Create a payment record if one doesn't exist for this month
      IF NOT EXISTS (
        SELECT 1 FROM payments 
        WHERE user_id = profile_record.id 
        AND due_date = next_payment_date::date
      ) THEN
        INSERT INTO payments (user_id, amount, due_date, payment_status)
        SELECT 
          profile_record.id, 
          p.price, 
          next_payment_date::date, 
          'overdue'
        FROM payment_plans p
        WHERE p.id = profile_record.payment_plan_id;
      END IF;
    ELSIF NOT payment_due AND profile_record.status = 'payment_due' AND profile_record.months_paid < 6 THEN
      -- If payment is not due but status is payment_due, revert to active
      UPDATE profiles SET status = 'active' WHERE id = profile_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to process a monthly payment
CREATE OR REPLACE FUNCTION process_monthly_payment(user_id UUID, payment_amount NUMERIC)
RETURNS void AS $$
DECLARE
  current_months_paid INTEGER;
  plan_price NUMERIC;
BEGIN
  -- Get current months paid and plan price
  SELECT p.months_paid, pp.price INTO current_months_paid, plan_price
  FROM profiles p
  JOIN payment_plans pp ON p.payment_plan_id = pp.id
  WHERE p.id = user_id;
  
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
    
  -- Update profile's payment information
  UPDATE profiles
  SET 
    last_payment_date = TIMEZONE('utc'::text, NOW()),
    months_paid = current_months_paid + 1,
    status = 'active'
  WHERE id = user_id;
  
  -- If this was the final payment (month 6), mark as completed
  IF current_months_paid + 1 >= 6 THEN
    -- You could add additional logic here for program completion
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to process a one-time payment for the full program
CREATE OR REPLACE FUNCTION process_full_payment(user_id UUID, payment_amount NUMERIC)
RETURNS void AS $$
BEGIN
  -- Update any existing payments to paid
  UPDATE payments
  SET 
    payment_status = 'paid',
    amount = payment_amount
  WHERE 
    user_id = user_id
    AND payment_status IN ('due_soon', 'overdue');
    
  -- Update profile to indicate full payment
  UPDATE profiles
  SET 
    last_payment_date = TIMEZONE('utc'::text, NOW()),
    months_paid = 6, -- Mark all 6 months as paid
    status = 'active'
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to initialize a new student's payment tracking
CREATE OR REPLACE FUNCTION initialize_student_payment(
  user_id UUID, 
  plan_id UUID, 
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  actual_start_date TIMESTAMP WITH TIME ZONE;
  is_one_time BOOLEAN;
BEGIN
  -- Set start date to current date if not provided
  actual_start_date := COALESCE(start_date, TIMEZONE('utc'::text, NOW()));
  
  -- Get plan type
  SELECT is_one_time INTO is_one_time FROM payment_plans WHERE id = plan_id;
  
  -- Update profile with payment plan info
  UPDATE profiles
  SET 
    payment_plan_id = plan_id,
    program_start_date = actual_start_date,
    months_paid = CASE WHEN is_one_time THEN 6 ELSE 0 END
  WHERE id = user_id;
  
  -- For monthly plans, create the first payment record
  IF NOT is_one_time THEN
    INSERT INTO payments (user_id, amount, due_date, payment_status)
    SELECT 
      user_id, 
      price, 
      actual_start_date::date, 
      'due_soon'
    FROM payment_plans
    WHERE id = plan_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run the check_monthly_payment_status function daily
-- Note: This requires the pg_cron extension to be enabled
DO $$
BEGIN
  -- Check if pg_cron extension exists
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Schedule the job to run daily at midnight
    PERFORM cron.schedule('0 0 * * *', 'SELECT check_monthly_payment_status()');
  END IF;
END $$;

-- Initialize existing students with the monthly payment plan and their join date as program start date
DO $$
BEGIN
  -- Get the monthly plan ID
  WITH monthly_plan AS (
    SELECT id FROM payment_plans WHERE name = 'Monthly' LIMIT 1
  )
  UPDATE profiles p
  SET 
    payment_plan_id = (SELECT id FROM monthly_plan),
    program_start_date = p.created_at,
    months_paid = CASE 
      -- Calculate months paid based on join date
      WHEN p.created_at IS NOT NULL THEN 
        LEAST(
          FLOOR(EXTRACT(EPOCH FROM (TIMEZONE('utc'::text, NOW()) - p.created_at)) / (30 * 24 * 60 * 60)),
          6
        )::INTEGER
      ELSE 0
    END
  WHERE 
    p.role = 'student' 
    AND p.payment_plan_id IS NULL;
END $$;

-- Run the check_monthly_payment_status function once to initialize payment statuses
SELECT check_monthly_payment_status();
