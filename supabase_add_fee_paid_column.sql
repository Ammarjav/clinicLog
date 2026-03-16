-- Add fee_paid column to patients table
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS fee_paid NUMERIC DEFAULT 0;