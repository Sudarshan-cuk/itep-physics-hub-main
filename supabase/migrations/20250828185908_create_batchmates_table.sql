-- Create the 'batchmates' table
CREATE TABLE public.batchmates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  social_links JSONB,
  profile_picture_url TEXT
);

-- Enable Row Level Security (RLS) for the 'batchmates' table
ALTER TABLE public.batchmates ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage batchmates
CREATE POLICY "Admins can manage batchmates"
ON public.batchmates
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy for authenticated users to view batchmates
CREATE POLICY "Authenticated users can view batchmates"
ON public.batchmates
FOR SELECT
TO authenticated
USING (true);