-- Add last_reminder_sent_at column to patients table
ALTER TABLE public.patients ADD COLUMN last_reminder_sent_at TIMESTAMP WITH TIME ZONE;