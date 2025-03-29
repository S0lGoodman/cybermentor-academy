-- Create user_notes table to store notes per user per content item
CREATE TABLE IF NOT EXISTS user_notes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  note_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  PRIMARY KEY (user_id, content_id) -- Composite primary key
);

-- Add RLS (Row Level Security) policies
-- Enable RLS
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notes
DROP POLICY IF EXISTS "Users can view their own notes." ON user_notes;
CREATE POLICY "Users can view their own notes."
  ON user_notes FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own notes
DROP POLICY IF EXISTS "Users can insert their own notes." ON user_notes;
CREATE POLICY "Users can insert their own notes."
  ON user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notes
DROP POLICY IF EXISTS "Users can update their own notes." ON user_notes;
CREATE POLICY "Users can update their own notes."
  ON user_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notes (optional, uncomment if needed)
-- DROP POLICY IF EXISTS "Users can delete their own notes." ON user_notes;
-- CREATE POLICY "Users can delete their own notes."
--   ON user_notes FOR DELETE
--   USING (auth.uid() = user_id);


-- Create trigger function if it doesn't exist (might be created by other migrations)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = TIMEZONE('utc'::text, NOW());
      RETURN NEW;
    END;
    $func$ language 'plpgsql';
  END IF;
END $$;

-- Add trigger to update updated_at timestamp on user_notes table
DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_content_id ON user_notes(content_id);
