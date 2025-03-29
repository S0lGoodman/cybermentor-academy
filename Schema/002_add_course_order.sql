-- Add order column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'courses' AND column_name = 'order') THEN
        ALTER TABLE courses ADD COLUMN "order" integer;
    END IF;
END $$;

-- Update order field for existing courses if null
WITH numbered_courses AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY phase ORDER BY created_at) - 1 as new_order
  FROM courses
)
UPDATE courses c
SET "order" = nc.new_order
FROM numbered_courses nc
WHERE c.id = nc.id AND c."order" IS NULL;

-- Add not null constraint
ALTER TABLE courses 
ALTER COLUMN "order" SET NOT NULL; 