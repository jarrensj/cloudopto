-- Configure Row Level Security policies for public read access
-- This allows anyone to read folders and images, but only the API (with service role) can write

-- Enable RLS on both tables
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read folders (public access)
CREATE POLICY "Allow public read access to folders"
  ON folders
  FOR SELECT
  USING (true);

-- Allow anyone to read images (public access)
CREATE POLICY "Allow public read access to images"
  ON images
  FOR SELECT
  USING (true);

-- Note: Write operations (INSERT, UPDATE, DELETE) will only work with the service role key
-- which bypasses RLS. This is intentional for security - only the API can modify data.

