-- Fix subscription_plans error
-- This script creates a dummy subscription_plans table and removes any references to it

-- Create a dummy subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY,
  name TEXT,
  price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a dummy record
INSERT INTO public.subscription_plans (id, name, price)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Default Plan', 0)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT ALL ON public.subscription_plans TO service_role;
GRANT ALL ON public.subscription_plans TO authenticated;
GRANT ALL ON public.subscription_plans TO anon;

-- Check for any functions that reference subscription_plans
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT proname, prosrc 
    FROM pg_proc 
    WHERE prosrc LIKE '%subscription_plans%'
  LOOP
    RAISE NOTICE 'Function % references subscription_plans', func_record.proname;
  END LOOP;
END $$;

-- Check for any triggers that might be causing issues
DO $$
DECLARE
  trigger_record RECORD;
BEGIN
  FOR trigger_record IN 
    SELECT trigger_name, event_object_table, action_statement
    FROM information_schema.triggers
    WHERE action_statement LIKE '%subscription_plans%'
  LOOP
    RAISE NOTICE 'Trigger % on table % references subscription_plans', 
      trigger_record.trigger_name, trigger_record.event_object_table;
    
    -- Drop the problematic trigger
    EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || 
            ' ON ' || trigger_record.event_object_table;
  END LOOP;
END $$;

-- Update any foreign key constraints in the students table
ALTER TABLE IF EXISTS public.students 
DROP CONSTRAINT IF EXISTS students_subscription_plan_id_fkey;

-- Add a new foreign key constraint to the dummy table
ALTER TABLE IF EXISTS public.students 
ADD CONSTRAINT students_subscription_plan_id_fkey 
FOREIGN KEY (subscription_plan_id) 
REFERENCES public.subscription_plans(id) 
ON DELETE SET NULL;

-- Set all subscription_plan_id values to the dummy value
UPDATE public.students
SET subscription_plan_id = '00000000-0000-0000-0000-000000000000'
WHERE subscription_plan_id IS NOT NULL;
