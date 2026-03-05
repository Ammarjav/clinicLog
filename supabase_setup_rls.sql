-- 1. Enable RLS on all tables
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 2. Clinics Table Policies
-- Users can only read the clinic they belong to
CREATE POLICY "clinics_select_policy" ON public.clinics
FOR SELECT TO authenticated 
USING (
  id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- 3. Users Table Policies
-- Users can only read user records that belong to their same clinic
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT TO authenticated 
USING (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- 4. Patients Table Policies (Tenant Isolation)

-- SELECT: Only patients belonging to the user's clinic
CREATE POLICY "patients_select_policy" ON public.patients
FOR SELECT TO authenticated 
USING (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- INSERT: Only if the patient's clinic_id matches the user's clinic_id
CREATE POLICY "patients_insert_policy" ON public.patients
FOR INSERT TO authenticated 
WITH CHECK (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- UPDATE: Only for patients belonging to the user's clinic
CREATE POLICY "patients_update_policy" ON public.patients
FOR UPDATE TO authenticated 
USING (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
)
WITH CHECK (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- DELETE: Only for patients belonging to the user's clinic
CREATE POLICY "patients_delete_policy" ON public.patients
FOR DELETE TO authenticated 
USING (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);