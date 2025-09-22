-- Add user_id to social_accounts and link to profiles(user_id)
ALTER TABLE public.social_accounts
  ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add FK if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'social_accounts_user_id_fkey'
  ) THEN
    ALTER TABLE public.social_accounts
      ADD CONSTRAINT social_accounts_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.profiles (user_id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- Optional: make user_id required for new rows after backfilling existing nulls
-- Uncomment after ensuring all existing rows have user_id set
-- ALTER TABLE public.social_accounts
--   ALTER COLUMN user_id SET NOT NULL;


