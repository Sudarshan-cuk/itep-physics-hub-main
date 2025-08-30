-- supabase/seed.sql

-- Create a sample table
CREATE TABLE IF NOT EXISTS jokes (
  id SERIAL PRIMARY KEY,
  setup TEXT NOT NULL,
  punchline TEXT NOT NULL
);

-- Insert some sample data
INSERT INTO jokes (setup, punchline) VALUES
('Why did the PowerShell script cross the road?', 'To fix the PATH on the other side.'),
('What do you call a broken Supabase CLI?', 'A supa-pain.'),
('How do React devs stay in shape?', 'They do hooks and effects.');