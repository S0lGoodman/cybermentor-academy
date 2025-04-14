-- EMERGENCY FIX: Restore admin access and fix redirection issues

-- 1. First, let's fix the profiles table to ensure admins have the correct role
UPDATE profiles 
SET role = 'admin' 
WHERE email IN (
  -- Add your admin email addresses here
  'admin@cybermentor.ma',
  'admin@example.com'
  -- Add any other admin emails you know
);

-- 2. Fix any broken RLS policies that might be causing redirection issues
DROP POLICY IF EXISTS "Allow admins full access" ON profiles;

-- Create a proper admin access policy
CREATE POLICY "Allow admins full access" ON profiles
FOR ALL
USING (
  (role = 'admin') OR 
  (auth.uid() = id)
);

-- 3. Make sure the auth.users table has the correct metadata for admins
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email IN (
  -- Add your admin email addresses here
  'admin@cybermentor.ma',
  'admin@example.com'
  -- Add any other admin emails you know
);

-- 4. Fix the trigger that might be causing issues
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a better trigger that preserves admin status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Don't override existing profiles
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = new.id) THEN
    INSERT INTO public.profiles (
      id, 
      email, 
      name,
      role, 
      status
    )
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'name', new.email),
      COALESCE(new.raw_user_meta_data->>'role', 'student'), 
      'active'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Fix the redirection logic by ensuring the session contains the correct role
-- This is a view that will help debug the current state
CREATE OR REPLACE VIEW debug_user_roles AS
SELECT 
  au.id, 
  au.email, 
  au.raw_user_meta_data->>'role' as auth_role,
  p.role as profile_role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id;

-- 6. Ensure all profiles have the correct role based on their email domain
UPDATE profiles
SET role = 'admin'
WHERE email LIKE '%@cybermentor.ma' AND role != 'admin';

-- 7. Make sure the status field has the correct values
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_status_check
CHECK (status IN ('active', 'inactive', 'invited', 'suspended', 'payment_due'));
