-- First, check if retention_id exists and drop it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'proceedings' 
        AND column_name = 'retention_id'
    ) THEN
        -- Drop foreign key constraint if exists
        ALTER TABLE "proceedings" DROP CONSTRAINT IF EXISTS "proceedings_retention_id_fkey";
        
        -- Drop the column
        ALTER TABLE "proceedings" DROP COLUMN "retention_id";
    END IF;
END $$;

-- Ensure retention_line_id is NOT NULL
ALTER TABLE "proceedings" ALTER COLUMN "retention_line_id" SET NOT NULL;
