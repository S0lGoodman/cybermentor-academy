-- MANUAL SQL SCRIPT TO CREATE AN AUTH USER FOR AN EXISTING STUDENT
-- Run this in the Supabase SQL Editor to create an auth user for a student that already exists in the database

-- Set the student information
DO $$
DECLARE
  student_id uuid := 'REPLACE_WITH_STUDENT_ID'; -- Replace with the actual student ID from the database
  student_email text := 'REPLACE_WITH_EMAIL'; -- Replace with the student's email
  student_password text := 'REPLACE_WITH_PASSWORD'; -- Replace with the desired password
  first_name text := 'REPLACE_WITH_FIRST_NAME'; -- Replace with the student's first name
  last_name text := 'REPLACE_WITH_LAST_NAME'; -- Replace with the student's last name
BEGIN
  -- Insert into auth.users table
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    student_id, -- Use the same ID as the student record
    '00000000-0000-0000-0000-000000000000',
    student_email,
    crypt(student_password, gen_salt('bf')),
    now(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    format('{"first_name": "%s", "last_name": "%s"}', first_name, last_name)::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into auth.identities table
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    student_id,
    student_id,
    format('{"sub": "%s", "email": "%s"}', student_id, student_email)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  RAISE NOTICE 'Successfully created auth user for student ID: %', student_id;
END $$;
