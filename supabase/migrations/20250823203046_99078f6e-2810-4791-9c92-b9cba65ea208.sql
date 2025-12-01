-- Create notes table for student note-taking
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table for department news and updates
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery/photos table for batch and event photos
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  batch_year INTEGER,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table for inquiry form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes table
DROP POLICY IF EXISTS "notes_owner_delete" ON public.notes;
DROP POLICY IF EXISTS "notes_owner_insert" ON public.notes;
DROP POLICY IF EXISTS "notes_owner_select" ON public.notes;
DROP POLICY IF EXISTS "notes_owner_update" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;

CREATE POLICY "Users can create their own notes"
ON public.notes
FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own notes"
ON public.notes
FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.notes
FOR DELETE
USING ((select auth.uid()) = user_id);

-- RLS Policies for blog posts (read for all, write for admins)
DROP POLICY IF EXISTS "posts_owner_delete" ON public.blog_posts;
DROP POLICY IF EXISTS "posts_owner_insert" ON public.blog_posts;
DROP POLICY IF EXISTS "posts_owner_select" ON public.blog_posts;
DROP POLICY IF EXISTS "posts_owner_update" ON public.blog_posts;

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (published = true AND NOT public.is_admin());

CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts
FOR SELECT, INSERT, UPDATE, DELETE
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE user_id = (select auth.uid()) AND role = 'admin'
));

-- RLS Policies for photos (read for all, upload for approved users)
CREATE POLICY "Anyone can view photos" 
ON public.photos 
FOR SELECT 
USING (true);

CREATE POLICY "Approved users can upload photos" 
ON public.photos 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = (select auth.uid()) AND is_approved = true
));

CREATE POLICY "Users can update their own photos" 
ON public.photos 
FOR UPDATE 
USING ((select auth.uid()) = uploaded_by);

CREATE POLICY "Users can delete their own photos or admins can delete any" 
ON public.photos 
FOR DELETE 
USING (
  (select auth.uid()) = uploaded_by OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = (select auth.uid()) AND role = 'admin'
  )
);

-- RLS Policies for contact messages (insert for all, read for admins)
DROP POLICY IF EXISTS "messages_admin_delete" ON public.contact_messages;
DROP POLICY IF EXISTS "messages_admin_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "messages_admin_select" ON public.contact_messages;
DROP POLICY IF EXISTS "messages_admin_update" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all contact messages"
ON public.contact_messages
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE user_id = (select auth.uid()) AND role = 'admin'
));

CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles
  WHERE user_id = (select auth.uid()) AND role = 'admin'
));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();