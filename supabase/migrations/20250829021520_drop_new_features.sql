-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.galleries CASCADE;
DROP TABLE IF EXISTS public.batchmates CASCADE;
DROP TABLE IF EXISTS public.social_accounts CASCADE;

-- Drop storage buckets
DELETE FROM storage.buckets WHERE id = 'gallery_images';
DELETE FROM storage.buckets WHERE id = 'batchmate_profiles';