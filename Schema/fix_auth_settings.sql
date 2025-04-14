-- Fix Auth Settings
-- This script ensures the auth settings are properly configured for invitations

-- Enable email confirmations
UPDATE auth.config
SET confirm_email = true;

-- Enable email signups
UPDATE auth.config
SET enable_signup = true;

-- Set the site URL for email links
UPDATE auth.config
SET site_url = 'https://cybermentor-academy.vercel.app';

-- Set the redirect URL for email links
UPDATE auth.config
SET additional_redirect_urls = ARRAY['https://cybermentor-academy.vercel.app/*', 'http://localhost:3000/*'];

-- Enable email invites
UPDATE auth.config
SET enable_user_invites = true;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;
GRANT ALL ON auth.config TO service_role;
