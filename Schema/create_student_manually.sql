-- MANUAL SQL SCRIPT TO CREATE A STUDENT
-- This script creates both the auth user and the student record
-- Run this directly in your database if all else fails

-- 1. Set the student information
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  first_name text := 'John'; -- REPLACE WITH ACTUAL FIRST NAME
  last_name text := 'Doe'; -- REPLACE WITH ACTUAL LAST NAME
  phone_number text := '0612345678'; -- REPLACE WITH ACTUAL PHONE OR NULL
  
  -- Generate email in the format [first initial].[last name]@cybermentor.ma
  student_email text := lower(left(first_name, 1) || '.' || last_name || '@cybermentor.ma');
  
  -- Generate password as [firstname]123!
  student_password text := lower(first_name) || '123!';
  
  -- Format WhatsApp URL
  whatsapp_url text;
  formatted_phone text;
BEGIN
  -- Format phone for WhatsApp
  IF phone_number IS NOT NULL AND phone_number != '' THEN
    formatted_phone := regexp_replace(phone_number, '[^0-9]', '', 'g');
    IF left(formatted_phone, 1) = '0' THEN
      formatted_phone := '212' || substring(formatted_phone, 2);
    ELSIF left(formatted_phone, 3) != '212' THEN
      formatted_phone := '212' || formatted_phone;
    END IF;
    whatsapp_url := 'https://wa.me/' || formatted_phone;
  END IF;

  RAISE NOTICE 'Creating student with:';
  RAISE NOTICE 'ID: %', new_user_id;
  RAISE NOTICE 'Email: %', student_email;
  RAISE NOTICE 'Password: %', student_password;
  RAISE NOTICE 'Name: % %', first_name, last_name;
  RAISE NOTICE 'WhatsApp URL: %', whatsapp_url;

  -- 2. Insert into auth.users table
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
    format('{"first_name": "%s", "last_name": "%s"}', first_name, last_name)::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- 3. Insert into auth.identities table
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

  -- 4. Insert into public.students table
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
    first_name,
    last_name,
    phone_number,
    whatsapp_url,
    'active',
    'student',
    now(),
    now()
  );

  RAISE NOTICE 'Successfully created student!';
  RAISE NOTICE 'Login credentials:';
  RAISE NOTICE 'Email: %', student_email;
  RAISE NOTICE 'Password: %', student_password;
END $$;
