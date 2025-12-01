SET search_path = public, extensions;

CREATE TABLE research_papers (
    id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
    title TEXT NOT NULL,
    abstract TEXT,
    file_url TEXT,
    published_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE research_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view research papers" ON research_papers
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Allow admin to insert research papers" ON research_papers
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Allow admin to update research papers" ON research_papers
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Allow admin to delete research papers" ON research_papers
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE));