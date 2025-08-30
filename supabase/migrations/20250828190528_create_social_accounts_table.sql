-- Create the 'social_accounts' table
CREATE TABLE public.social_accounts (
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