-- Temporarily relax storage RLS for debugging purposes

-- Drop the old policy that checks for admin role
DROP POLICY IF EXISTS "Allow admins to upload study materials" ON storage.objects;

-- Create a new, more permissive policy for testing
CREATE POLICY "TEMP - Allow any authenticated user to upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'study-materials');