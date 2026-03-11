-- Add fee columns to clinics table
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS new_visit_fee NUMERIC DEFAULT 0;
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS followup_visit_fee NUMERIC DEFAULT 0;