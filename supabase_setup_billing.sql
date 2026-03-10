-- Update clinics table for subscription management
ALTER TABLE public.clinics 
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS patient_limit INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE;

-- Create payments table for manual verification
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  plan_requested TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for payments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own clinic payments') THEN
        CREATE POLICY "Users can view their own clinic payments" ON public.payments
        FOR SELECT TO authenticated USING (
          clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own clinic payments') THEN
        CREATE POLICY "Users can insert their own clinic payments" ON public.payments
        FOR INSERT TO authenticated WITH CHECK (
          clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
        );
    END IF;
END $$;