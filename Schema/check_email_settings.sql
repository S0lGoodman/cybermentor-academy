-- Check Email Settings
-- This script checks the current email settings

-- Check auth config
SELECT * FROM auth.config;

-- Check email templates
SELECT * FROM auth.email_templates;

-- Check if SMTP is configured
SELECT * FROM auth.sms_providers;

-- Check if there are any users
SELECT id, email, confirmed_at, last_sign_in_at, created_at, updated_at
FROM auth.users
LIMIT 10;
