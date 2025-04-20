-- Direct SQL script to insert a student record
-- This can be used to test if the database schema is working correctly

-- First, generate a random UUID for the student
DO $$
DECLARE
  student_id uuid := gen_random_uuid();
  student_email text := 'test_' || floor(random() * 1000)::text || '@example.com';
BEGIN
  RAISE NOTICE 'Attempting to insert student with ID: % and email: %', student_id, student_email;
  
  -- Insert with minimal fields
  INSERT INTO students (
    id, 
    email,
    status,
    role
  ) VALUES (
    student_id,
    student_email,
    'active',
    'student'
  );
  
  RAISE NOTICE 'Student inserted successfully with minimal fields';
  
  -- Now update with additional fields
  UPDATE students
  SET 
    first_name = 'Test',
    last_name = 'User',
    phone_number = '0612345678'
  WHERE id = student_id;
  
  RAISE NOTICE 'Student updated with additional fields';
  
  -- Verify the record was created correctly
  RAISE NOTICE 'Verifying student record...';
  
  DECLARE
    student_record record;
  BEGIN
    SELECT * INTO student_record FROM students WHERE id = student_id;
    
    RAISE NOTICE 'Student record: %', student_record;
    RAISE NOTICE 'WhatsApp URL: %', student_record.whatsapp_url;
  END;
END $$;
