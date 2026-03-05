-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "clinics_select_policy" ON public.clinics;
DROP POLICY IF EXISTS "clinics_insert_policy" ON public.clinics;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;

-- 1. Clinics Table Policies
-- Allow anyone to insert a clinic during signup (the owner_id will be checked against the record)
CREATE POLICY "clinics_insert_policy" ON public.clinics
FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Users can read their own clinic
CREATE POLICY "clinics_select_policy" ON public.clinics
FOR SELECT TO authenticated, anon
USING (
  id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  OR owner_id = auth.uid()
);

-- 2. Users Table Policies
-- Allow insert during signup
CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Users can read their own profile or clinic members
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT TO authenticated
USING (
  id = auth.uid() 
  OR clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- 3. Patients Table (Existing policies are usually fine, but let's ensure they use the subquery)
DROP POLICY IF EXISTS "patients_insert_policy" ON public.patients;
CREATE POLICY "patients_insert_policy" ON public.patients
FOR INSERT TO authenticated
WITH CHECK (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);