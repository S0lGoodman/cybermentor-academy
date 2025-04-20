-- Add additional contact fields to students table
-- This script adds first_name, last_name, phone_number, and whatsapp_url columns to the students table

-- First, check if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_name = 'students' AND column_name = 'first_name') THEN
      ALTER TABLE public.students ADD COLUMN first_name TEXT;
    END IF;

    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_name = 'students' AND column_name = 'last_name') THEN
      ALTER TABLE public.students ADD COLUMN last_name TEXT;
    END IF;

    -- Add phone_number column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_name = 'students' AND column_name = 'phone_number') THEN
      ALTER TABLE public.students ADD COLUMN phone_number TEXT;
    END IF;

    -- Add whatsapp_url column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                  WHERE table_name = 'students' AND column_name = 'whatsapp_url') THEN
      ALTER TABLE public.students ADD COLUMN whatsapp_url TEXT;
    END IF;

    -- Update existing records to split name into first_name and last_name
    UPDATE public.students
    SET 
      first_name = CASE 
                    WHEN name LIKE '% %' THEN SPLIT_PART(name, ' ', 1)
                    ELSE name
                  END,
      last_name = CASE 
                    WHEN name LIKE '% %' THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
                    ELSE ''
                  END
    WHERE first_name IS NULL OR last_name IS NULL;

    RAISE NOTICE 'Successfully added contact fields to students table';
  ELSE
    RAISE EXCEPTION 'The students table does not exist';
  END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.students TO service_role;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.students TO anon;

-- Add a function to generate WhatsApp URL from phone number
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
