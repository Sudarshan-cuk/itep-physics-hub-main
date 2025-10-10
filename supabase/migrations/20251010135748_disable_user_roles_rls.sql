-- Disable RLS on public.user_roles
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Optionally, drop any existing policies if they are known.
-- Since no explicit policies were found, disabling RLS should be sufficient.