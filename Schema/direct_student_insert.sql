-- Direct SQL script to create a student
-- This script creates both the auth user and the student record

-- 1. First, create the auth user
-- Replace the placeholders with actual values
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role_id
) VALUES (
  gen_random_uuid(), -- Generate a UUID
  'student@example.com', -- Replace with the student's email
  crypt('password123!', gen_salt('bf')), -- Replace 'password123!' with the desired password
  now(), -- Email confirmed
  now(), -- Created at
  now(), -- Updated at
  '{"provider": "email", "role": "student"}', -- App metadata
  '{"first_name": "Student", "last_name": "Name"}', -- User metadata (replace with actual names)
  false, -- Not a super admin
  1 -- Default role ID
);

-- 2. Get the user ID that was just created
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'student@example.com' ORDER BY created_at DESC LIMIT 1;
  
  -- 3. Insert into students table using the same ID
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
    user_id,
    'student@example.com', -- Same email as auth user
    'Student', -- Replace with first name
    'Name', -- Replace with last name
    '0612345678', -- Replace with phone number or NULL
    'https://wa.me/212612345678', -- Replace with WhatsApp URL or NULL
    'active',
    'student',
    now(),
    now()
  );
  
  RAISE NOTICE 'Created student with ID: %', user_id;
END $$;
