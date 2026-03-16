-- Add category column to patients table
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS category TEXT;