-- Drop the existing "Admins can view all profiles" policy if it exists
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a new policy to explicitly allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());