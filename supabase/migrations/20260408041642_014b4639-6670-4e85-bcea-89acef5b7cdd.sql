-- Drop bio column (GDPR: unmoderated free text from minors)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bio;

-- Add GDPR consent tracking columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_given boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_given_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_version text DEFAULT '1.0';

-- Add data retention column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_retention_until timestamptz;

-- Trigger to auto-set data_retention_until = created_at + 2 years for new profiles
CREATE OR REPLACE FUNCTION public.set_data_retention()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.data_retention_until IS NULL THEN
    NEW.data_retention_until := NEW.created_at + interval '2 years';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_data_retention_trigger ON public.profiles;
CREATE TRIGGER set_data_retention_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_data_retention();

-- Backfill data_retention_until for existing profiles
UPDATE public.profiles
SET data_retention_until = created_at + interval '2 years'
WHERE data_retention_until IS NULL;