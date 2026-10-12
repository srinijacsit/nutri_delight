-- Create a trigger to automatically create a public.profiles row when a new auth.users row is created.

-- Function must be SECURITY DEFINER to have permission to access auth.users and insert into public.profiles
-- Search path is explicitly set to public to prevent search_path injection attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, created_at, updated_at)
  VALUES (NEW.id, 'customer', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING; -- Make it idempotent so it is safe to retry or if profile was manually created
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists to ensure idempotency when running migrations
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the AFTER INSERT trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
