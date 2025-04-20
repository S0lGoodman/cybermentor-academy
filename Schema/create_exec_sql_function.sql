-- Create a function to execute SQL directly
-- This is needed for the StudentCreateDirectSQL component

-- Drop the function if it exists
DROP FUNCTION IF EXISTS exec_sql(text);

-- Create the function
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
