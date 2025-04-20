-- Manual SQL script to insert a student record
-- Replace the placeholders with actual values

INSERT INTO students (
  id, 
  email, 
  first_name, 
  last_name, 
  phone_number,
  status, 
  role, 
  created_at, 
  updated_at
) VALUES (
  '[USER_ID]', -- Replace with the user ID from the auth system
  '[EMAIL]', -- Replace with the user's email
  '[FIRST_NAME]', -- Replace with the first name
  '[LAST_NAME]', -- Replace with the last name
  '[PHONE_NUMBER]', -- Replace with the phone number or NULL
  'active', 
  'student', 
  NOW(), 
  NOW()
);

-- After inserting, verify the record was created
SELECT * FROM students WHERE id = '[USER_ID]';
