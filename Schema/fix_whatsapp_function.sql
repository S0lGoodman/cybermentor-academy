-- Check and fix the WhatsApp URL generation function and trigger

-- First, check if the function exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_proc WHERE proname = 'update_whatsapp_url') THEN
    RAISE NOTICE 'update_whatsapp_url function exists';
  ELSE
    RAISE NOTICE 'update_whatsapp_url function does not exist, creating it';
  END IF;
END $$;

-- Drop the function if it exists (to recreate it)
DROP FUNCTION IF EXISTS update_whatsapp_url();

-- Create the function with proper error handling
CREATE OR REPLACE FUNCTION update_whatsapp_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update whatsapp_url if phone_number is provided and not null
  IF NEW.phone_number IS NOT NULL THEN
    BEGIN
      -- Remove any non-digit characters
      NEW.phone_number := REGEXP_REPLACE(NEW.phone_number, '[^0-9]', '', 'g');
      
      -- Format the phone number for WhatsApp
      IF LEFT(NEW.phone_number, 1) = '0' THEN
        NEW.whatsapp_url := 'https://wa.me/212' || SUBSTRING(NEW.phone_number FROM 2);
      ELSIF LEFT(NEW.phone_number, 3) = '212' THEN
        NEW.whatsapp_url := 'https://wa.me/' || NEW.phone_number;
      ELSE
        NEW.whatsapp_url := 'https://wa.me/212' || NEW.phone_number;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- If any error occurs, just set a default URL
      NEW.whatsapp_url := NULL;
      RAISE NOTICE 'Error in update_whatsapp_url function: %', SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if the trigger exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_whatsapp_url_trigger' 
    AND tgrelid = 'students'::regclass
  ) THEN
    RAISE NOTICE 'update_whatsapp_url_trigger exists';
  ELSE
    RAISE NOTICE 'update_whatsapp_url_trigger does not exist, creating it';
  END IF;
END $$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_whatsapp_url_trigger ON students;

-- Create the trigger
CREATE TRIGGER update_whatsapp_url_trigger
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_whatsapp_url();

-- Test the function with a simple update
DO $$
BEGIN
  RAISE NOTICE 'Testing the WhatsApp URL function with an update...';
  
  -- Find a student to update
  DECLARE
    student_id uuid;
  BEGIN
    SELECT id INTO student_id FROM students LIMIT 1;
    
    IF student_id IS NOT NULL THEN
      -- Update the phone number to trigger the function
      UPDATE students 
      SET phone_number = '0612345678' 
      WHERE id = student_id;
      
      -- Check if the WhatsApp URL was updated
      DECLARE
        whatsapp_url text;
      BEGIN
        SELECT students.whatsapp_url INTO whatsapp_url 
        FROM students 
        WHERE id = student_id;
        
        IF whatsapp_url IS NOT NULL THEN
          RAISE NOTICE 'WhatsApp URL was successfully updated to: %', whatsapp_url;
        ELSE
          RAISE NOTICE 'WhatsApp URL was not updated';
        END IF;
      END;
    ELSE
      RAISE NOTICE 'No students found to test the function';
    END IF;
  END;
END $$;
