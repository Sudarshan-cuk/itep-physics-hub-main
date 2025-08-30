-- Create the storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery_images', 'gallery_images', TRUE);

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