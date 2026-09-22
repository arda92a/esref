-- Add region column to projects table with default value 'Lefkoşa, Alayköy'
ALTER TABLE projects ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'Lefkoşa, Alayköy';

-- Ensure any existing rows without region receive the default value
UPDATE projects SET region = 'Lefkoşa, Alayköy' WHERE region IS NULL;
