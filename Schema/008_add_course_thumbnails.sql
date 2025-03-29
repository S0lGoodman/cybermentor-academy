-- Add thumbnail_url column to courses table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'courses' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE courses ADD COLUMN thumbnail_url TEXT;
    END IF;
END $$;

-- Create storage bucket for course thumbnails if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to course thumbnails
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-thumbnails');

-- Allow authenticated users to upload course thumbnails
CREATE POLICY "Authenticated users can upload course thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-thumbnails' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own uploads
CREATE POLICY "Users can update their own course thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-thumbnails' AND
  auth.uid() = owner
);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Users can delete their own course thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-thumbnails' AND
  auth.uid() = owner
); 