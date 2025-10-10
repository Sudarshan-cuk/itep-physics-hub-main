-- Drop the existing "Allow admin to manage site statistics" policy if it exists
DROP POLICY IF EXISTS "Allow admin to manage site statistics" ON public.site_statistics;

-- Create a new policy to explicitly allow admins to manage (insert, update, delete) site statistics
CREATE POLICY "Allow admin to manage site statistics"
ON public.site_statistics
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());