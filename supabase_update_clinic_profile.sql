-- Add profile columns to clinics table
ALTER TABLE public.clinics 
ADD COLUMN IF NOT EXISTS doctor_name TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Update RLS policies to ensure owners can update these new fields
-- (Policies already exist for clinic updates, but this ensures everything is covered)