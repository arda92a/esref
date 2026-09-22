-- Add is_featured flag so admins can pick which projects appear on the homepage.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
