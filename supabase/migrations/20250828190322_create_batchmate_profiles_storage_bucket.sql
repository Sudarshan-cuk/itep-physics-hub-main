-- Create the storage bucket for batchmate profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('batchmate_profiles', 'batchmate_profiles', TRUE);

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