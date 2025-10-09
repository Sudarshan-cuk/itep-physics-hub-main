CREATE TABLE public.site_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL UNIQUE,
    display_value TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.site_statistics
FOR SELECT USING (true);

CREATE POLICY "Allow admin to manage site statistics" ON public.site_statistics
FOR ALL TO authenticated USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')) WITH CHECK (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));