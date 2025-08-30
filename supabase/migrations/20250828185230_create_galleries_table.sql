-- Create the 'galleries' table
CREATE TABLE public.galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE NOT NULL
);

-- Enable Row Level Security (RLS) for the 'galleries' table
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage galleries
CREATE POLICY "Admins can manage galleries"
ON public.galleries
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy for authenticated users to view public galleries
CREATE POLICY "Authenticated users can view public galleries"
ON public.galleries
FOR SELECT
TO authenticated
USING (is_public = true);