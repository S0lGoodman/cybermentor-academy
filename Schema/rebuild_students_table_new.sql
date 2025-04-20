-- Rebuild the students table with the correct structure

-- First, backup the existing data if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Create a backup table
    DROP TABLE IF EXISTS students_backup;
    CREATE TABLE students_backup AS SELECT * FROM students;
    RAISE NOTICE 'Created backup of students table';
  END IF;
END $$;

-- Drop the existing table
DROP TABLE IF EXISTS students;

-- Create the new table with the correct structure
CREATE TABLE students (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  whatsapp_url TEXT,
  status TEXT DEFAULT 'active',
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  program_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  enrolled_courses INTEGER DEFAULT 0,
  months_paid INTEGER DEFAULT 0,
  suspended_until TIMESTAMP WITH TIME ZONE,
  suspension_reason TEXT
);

-- Restore data from backup if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students_backup') THEN
    -- Insert data from backup, mapping fields appropriately
    INSERT INTO students (
      id, 
      email, 
      first_name, 
      last_name,
      status, 
      role, 
      created_at, 
      updated_at, 
      last_active,
      program_start_date, 
      progress, 
      enrolled_courses, 
      months_paid,
      suspended_until, 
      suspension_reason
    )
    SELECT 
      id, 
      email, 
      -- If name exists in backup, split it into first_name and last_name
      CASE 
        WHEN name LIKE '% %' THEN SPLIT_PART(name, ' ', 1)
        ELSE name
      END AS first_name,
      CASE 
        WHEN name LIKE '% %' THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
        ELSE ''
      END AS last_name,
      status, 
      role, 
      created_at, 
      updated_at, 
      last_active,
      program_start_date, 
      progress, 
      enrolled_courses, 
      months_paid,
      suspended_until, 
      suspension_reason
    FROM students_backup;
    
    RAISE NOTICE 'Restored data from backup';
  END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.students TO anon;

-- Create a function to generate WhatsApp URL from phone number
CREATE OR REPLACE FUNCTION generate_whatsapp_url(phone TEXT) 
RETURNS TEXT AS $$
BEGIN
  -- Remove any non-digit characters
  phone := REGEXP_REPLACE(phone, '[^0-9]', '', 'g');
  
  -- If phone starts with 0, replace it with 212
  IF LEFT(phone, 1) = '0' THEN
    phone := '212' || SUBSTRING(phone FROM 2);
  END IF;
  
  -- If phone doesn't start with 212, add it
  IF LEFT(phone, 3) != '212' THEN
    phone := '212' || phone;
  END IF;
  
  RETURN 'https://wa.me/' || phone;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update whatsapp_url when phone_number changes
CREATE OR REPLACE FUNCTION update_whatsapp_url()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone_number IS NOT NULL AND (NEW.whatsapp_url IS NULL OR OLD.phone_number != NEW.phone_number) THEN
    NEW.whatsapp_url := generate_whatsapp_url(NEW.phone_number);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS update_whatsapp_url_trigger ON public.students;
CREATE TRIGGER update_whatsapp_url_trigger
BEFORE INSERT OR UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION update_whatsapp_url();
