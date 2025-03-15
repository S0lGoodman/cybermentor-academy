-- First, drop the existing contents table
DROP TABLE IF EXISTS contents;

-- Create new contents table directly linked to courses
CREATE TABLE IF NOT EXISTS contents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'text', 'quiz', 'lab')),
  content TEXT NOT NULL,
  order INTEGER NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contents_course_id ON contents(course_id);
CREATE INDEX IF NOT EXISTS idx_contents_order ON contents(order);

-- Drop the modules table since it's no longer needed
DROP TABLE IF EXISTS modules;

-- Add trigger for updated_at timestamp if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_contents_updated_at') THEN
    CREATE TRIGGER update_contents_updated_at
      BEFORE UPDATE ON contents
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$; 