-- Drop existing restrictive SELECT policies for public.notes
DROP POLICY IF EXISTS "notes_owner_select" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;

-- Create a new policy to allow all authenticated users to view all notes
CREATE POLICY "Allow authenticated users to view all notes"
ON public.notes
FOR SELECT
TO authenticated
USING (true);