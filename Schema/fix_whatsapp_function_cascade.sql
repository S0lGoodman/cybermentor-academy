-- Check and fix the WhatsApp URL generation function and trigger

-- First, check if the function exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_proc WHERE proname = 'update_whatsapp_url') THEN
    RAISE NOTICE 'update_whatsapp_url function exists, will drop with CASCADE';
  ELSE
    RAISE NOTICE 'update_whatsapp_url function does not exist, creating it';
  END IF;
END $$;

-- Drop the function if it exists WITH CASCADE to also drop dependent objects like triggers
DROP FUNCTION IF EXISTS update_whatsapp_url() CASCADE;

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

-- Create the trigger
CREATE TRIGGER update_whatsapp_url_trigger
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_whatsapp_url();
