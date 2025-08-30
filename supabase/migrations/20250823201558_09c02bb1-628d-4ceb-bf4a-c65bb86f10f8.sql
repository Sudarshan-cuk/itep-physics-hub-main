-- Fix security warning: Function Search Path Mutable
-- Update the function to have a proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role, batch_year)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    'student',
    NULLIF(NEW.raw_user_meta_data->>'batch_year', '')::INTEGER
  );
  RETURN NEW;
END;
$$;