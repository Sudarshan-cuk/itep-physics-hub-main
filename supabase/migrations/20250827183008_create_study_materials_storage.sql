-- Create the storage bucket for study materials
insert into storage.buckets (id, name, public)
values ('study-materials', 'study-materials', true);

-- Create the 'study_materials' table
create table public.study_materials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  uploader_id uuid references auth.users (id) on delete cascade not null,
  file_name text not null,
  file_path text not null, -- Path within the storage bucket
  file_url text not null,  -- Public URL to access the file
  file_type text not null,
  file_size bigint not null,
  category text,
  description text
);

-- Enable Row Level Security (RLS) for the 'study_materials' table
alter table public.study_materials enable row level security;

-- Policy for authenticated users to view study materials
create policy "Authenticated users can view study materials"
on public.study_materials for select
to authenticated
using (true);

-- Policy for admins to insert study materials
create policy "Admins can insert study materials"
on public.study_materials for insert
to authenticated
with check (
  public.is_admin()
);

-- Policy for admins to update study materials
create policy "Admins can update study materials"
on public.study_materials for update
to authenticated
using (
  public.is_admin()
) with check (
  public.is_admin()
);

-- Policy for authenticated users to insert their own study materials
create policy "Authenticated users can insert their own study materials"
on public.study_materials for insert
to authenticated
with check (
  uploader_id = auth.uid()
);

-- Policy for admins to delete study materials
create policy "Admins can delete study materials"
on public.study_materials for delete
to authenticated
using (
  public.is_admin()
);

-- Set up RLS for storage bucket
-- Allow authenticated users to download files
create policy "Allow authenticated users to download study materials"
on storage.objects for select
to authenticated
using (bucket_id = 'study-materials');

-- Allow admins to upload files
create policy "Allow admins to upload study materials"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'study-materials' AND public.is_admin()
);

-- Allow admins to update files
create policy "Allow admins to update study materials"
on storage.objects for update
to authenticated
using (
  bucket_id = 'study-materials' AND public.is_admin()
) with check (
  bucket_id = 'study-materials' AND public.is_admin()
);

-- Allow admins to delete files
create policy "Allow admins to delete study materials"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'study-materials' AND public.is_admin()
);