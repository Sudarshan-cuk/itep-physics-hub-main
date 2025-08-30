-- Create the 'photos' table
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  gallery_id UUID REFERENCES public.galleries (id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER
);

-- Enable Row Level Security (RLS) for the 'photos' table
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage photos
CREATE POLICY "Admins can manage photos"
ON public.photos
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy for authenticated users to view photos in public galleries
CREATE POLICY "Authenticated users can view photos in public galleries"
ON public.photos
FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.galleries WHERE id = gallery_id AND is_public = true));