-- Check the structure of the students table and fix any issues

-- First, check if the table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'students') THEN
    RAISE NOTICE 'Students table exists';
    
    -- Check for required columns
    RAISE NOTICE 'Checking columns in students table:';
    
    -- List all columns and their data types
    FOR r IN (
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'students'
      ORDER BY ordinal_position
    ) LOOP
      RAISE NOTICE 'Column: %, Type: %, Nullable: %', r.column_name, r.data_type, r.is_nullable;
    END LOOP;
    
    -- Check for constraints
    RAISE NOTICE 'Checking constraints on students table:';
    
    FOR r IN (
      SELECT con.conname AS constraint_name, 
             con.contype AS constraint_type,
             pg_get_constraintdef(con.oid) AS constraint_definition
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
      WHERE rel.relname = 'students'
      AND nsp.nspname = 'public'
    ) LOOP
      RAISE NOTICE 'Constraint: %, Type: %, Definition: %', 
                  r.constraint_name, 
                  CASE r.constraint_type 
                    WHEN 'p' THEN 'PRIMARY KEY'
                    WHEN 'f' THEN 'FOREIGN KEY'
                    WHEN 'u' THEN 'UNIQUE'
                    WHEN 'c' THEN 'CHECK'
                    ELSE r.constraint_type::text
                  END,
                  r.constraint_definition;
    END LOOP;
    
    -- Check if the name column exists and if it has a NOT NULL constraint
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'name' AND is_nullable = 'NO'
    ) THEN
      RAISE NOTICE 'The name column exists and has a NOT NULL constraint. Altering to allow NULL values.';
      
      -- Alter the name column to allow NULL values
      ALTER TABLE public.students ALTER COLUMN name DROP NOT NULL;
      RAISE NOTICE 'Modified name column to allow NULL values.';
    END IF;
    
    -- Check if first_name and last_name columns exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'first_name'
    ) THEN
      RAISE NOTICE 'Adding first_name column to students table';
      ALTER TABLE public.students ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'last_name'
    ) THEN
      RAISE NOTICE 'Adding last_name column to students table';
      ALTER TABLE public.students ADD COLUMN last_name TEXT;
    END IF;
    
    -- Check if phone_number column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'phone_number'
    ) THEN
      RAISE NOTICE 'Adding phone_number column to students table';
      ALTER TABLE public.students ADD COLUMN phone_number TEXT;
    END IF;
    
    -- Check if whatsapp_url column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'whatsapp_url'
    ) THEN
      RAISE NOTICE 'Adding whatsapp_url column to students table';
      ALTER TABLE public.students ADD COLUMN whatsapp_url TEXT;
    END IF;
    
    -- Update existing records to split name into first_name and last_name if needed
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'name'
    ) AND EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'first_name'
    ) AND EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'students' AND column_name = 'last_name'
    ) THEN
      RAISE NOTICE 'Updating existing records to split name into first_name and last_name';
      
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
      WHERE (first_name IS NULL OR last_name IS NULL) AND name IS NOT NULL;
      
      RAISE NOTICE 'Updated existing records';
    END IF;
    
  ELSE
    RAISE EXCEPTION 'The students table does not exist';
  END IF;
END $$;
