-- Create clinics table
CREATE TABLE public.clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for profile/mapping
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Re-create patients table with clinic scoping
DROP TABLE IF EXISTS public.patients;
CREATE TABLE public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  visit_type TEXT NOT NULL,
  visit_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Indexes for performance
CREATE INDEX idx_patients_clinic_id ON public.patients(clinic_id);
CREATE INDEX idx_patients_visit_date ON public.patients(visit_date);
CREATE INDEX idx_patients_diagnosis ON public.patients(diagnosis);
CREATE INDEX idx_patients_name ON public.patients(name);

-- Enable RLS
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Clinics Policies
CREATE POLICY "Users can view their own clinic" ON public.clinics
FOR SELECT TO authenticated USING (id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

-- Users Policies
CREATE POLICY "Users can view their own profile" ON public.users
FOR SELECT TO authenticated USING (id = auth.uid());

-- Patients Policies (Tenant Isolation)
CREATE POLICY "Clinic members can view clinic patients" ON public.patients
FOR SELECT TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Clinic members can insert clinic patients" ON public.patients
FOR INSERT TO authenticated WITH CHECK (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Clinic members can update clinic patients" ON public.patients
FOR UPDATE TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Clinic members can delete clinic patients" ON public.patients
FOR DELETE TO authenticated USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));