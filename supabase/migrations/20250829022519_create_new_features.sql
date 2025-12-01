-- Create the 'galleries' table
CREATE TABLE IF NOT EXISTS public.galleries (
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

-- Drop existing policies for galleries if they exist
DROP POLICY IF EXISTS "Admins can manage galleries" ON public.galleries;
DROP POLICY IF EXISTS "Authenticated users can view public galleries" ON public.galleries;

-- Policy for admins to manage galleries
CREATE POLICY "Admins can manage galleries"
ON public.galleries
FOR SELECT, INSERT, UPDATE, DELETE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy for authenticated users to view public galleries
CREATE POLICY "Authenticated users can view public galleries"
ON public.galleries
FOR SELECT
TO authenticated
USING (is_public = true AND NOT public.is_admin());


-- Create the 'photos' table
CREATE TABLE IF NOT EXISTS public.photos (
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

-- Drop existing policies for photos if they exist
DROP POLICY IF EXISTS "Admins can manage photos" ON public.photos;
DROP POLICY IF EXISTS "Authenticated users can view photos in public galleries" ON public.photos;

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


-- Create the storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery_images', 'gallery_images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for storage.objects related to gallery_images if they exist
DROP POLICY IF EXISTS "Admins can manage gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view gallery images" ON storage.objects;

-- Policy for admins to manage gallery images
CREATE POLICY "Admins can manage gallery images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'gallery_images' AND public.is_admin())
WITH CHECK (bucket_id = 'gallery_images' AND public.is_admin());

-- Policy for authenticated users to view gallery images
CREATE POLICY "Allow authenticated users to view gallery images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'gallery_images');


-- Create the 'batchmates' table
CREATE TABLE IF NOT EXISTS public.batchmates (
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

-- Drop existing policies for batchmates if they exist
DROP POLICY IF EXISTS "Admins can manage batchmates" ON public.batchmates;
DROP POLICY IF EXISTS "Authenticated users can view batchmates" ON public.batchmates;

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


-- Create the storage bucket for batchmate profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('batchmate_profiles', 'batchmate_profiles', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies for storage.objects related to batchmate_profiles if they exist
DROP POLICY IF EXISTS "Admins can manage batchmate profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view batchmate profile pictures" ON storage.objects;

-- Policy for admins to manage batchmate profile pictures
CREATE POLICY "Admins can manage batchmate profile pictures"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'batchmate_profiles' AND public.is_admin())
WITH CHECK (bucket_id = 'batchmate_profiles' AND public.is_admin());

-- Policy for authenticated users to view batchmate profile pictures
CREATE POLICY "Allow authenticated users to view batchmate profile pictures"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'batchmate_profiles');


-- Create the 'social_accounts' table
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  display_order INTEGER
);

-- Enable Row Level Security (RLS) for the 'social_accounts' table
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for social_accounts if they exist
DROP POLICY IF EXISTS "Admins can manage social accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "All users can view social accounts" ON public.social_accounts;

-- Policy for admins to manage social accounts
CREATE POLICY "Admins can manage social accounts"
ON public.social_accounts
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Policy for all users to view social accounts
CREATE POLICY "All users can view social accounts"
ON public.social_accounts
FOR SELECT
USING (true);