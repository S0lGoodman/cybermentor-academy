-- COMPLETELY MANUAL SQL SCRIPT TO INSERT A STUDENT
-- This script creates both the auth user and the student record
-- Run this directly in your database if all else fails

-- 1. First, create the auth user
-- Replace the placeholders with actual values
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  student_email text := 'student@example.com'; -- REPLACE WITH ACTUAL EMAIL
  student_password text := 'password123!'; -- REPLACE WITH ACTUAL PASSWORD
  student_first_name text := 'Student'; -- REPLACE WITH ACTUAL FIRST NAME
  student_last_name text := 'Name'; -- REPLACE WITH ACTUAL LAST NAME
  student_phone text := '0612345678'; -- REPLACE WITH ACTUAL PHONE OR NULL
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
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    student_email,
    crypt(student_password, gen_salt('bf')),
    now(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    format('{"first_name": "%s", "last_name": "%s"}', student_first_name, student_last_name)::jsonb,
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
    new_user_id,
    new_user_id,
    format('{"sub": "%s", "email": "%s"}', new_user_id, student_email)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  -- Format phone number for WhatsApp URL
  DECLARE
    whatsapp_url text := NULL;
    formatted_phone text := regexp_replace(student_phone, '[^0-9]', '', 'g');
  BEGIN
    IF formatted_phone IS NOT NULL AND formatted_phone != '' THEN
      IF left(formatted_phone, 1) = '0' THEN
        formatted_phone := '212' || substring(formatted_phone, 2);
      ELSIF left(formatted_phone, 3) != '212' THEN
        formatted_phone := '212' || formatted_phone;
      END IF;
      whatsapp_url := 'https://wa.me/' || formatted_phone;
    END IF;
  
    -- Insert into public.students table
    INSERT INTO public.students (
      id,
      email,
      first_name,
      last_name,
      phone_number,
      whatsapp_url,
      status,
      role,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      student_email,
      student_first_name,
      student_last_name,
      student_phone,
      whatsapp_url,
      'active',
      'student',
      now(),
      now()
    );
  END;

  RAISE NOTICE 'Successfully created student with ID: % and email: %', new_user_id, student_email;
END $$;
