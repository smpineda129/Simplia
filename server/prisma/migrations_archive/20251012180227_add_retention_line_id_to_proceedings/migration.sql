-- AlterTable: Add retention_line_id column to proceedings table
ALTER TABLE "proceedings" ADD COLUMN IF NOT EXISTS "retention_line_id" INTEGER;

-- Add foreign key constraint
ALTER TABLE "proceedings" 
ADD CONSTRAINT "proceedings_retention_line_id_fkey" 
FOREIGN KEY ("retention_line_id") 
REFERENCES "retention_lines"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "proceedings_retention_line_id_idx" ON "proceedings"("retention_line_id");
