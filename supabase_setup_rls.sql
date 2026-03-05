-- 1. Clean up existing policies
DROP POLICY IF EXISTS "clinics_select_policy" ON public.clinics;
DROP POLICY IF EXISTS "clinics_insert_policy" ON public.clinics;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_own" ON public.users;
DROP POLICY IF EXISTS "users_select_clinic" ON public.users;

-- 2. Clinics Table Policies
-- Owners can insert their clinic
CREATE POLICY "clinics_insert_policy" ON public.clinics
FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Owners can see their own clinics (Simple check, no recursion)
CREATE POLICY "clinics_select_policy" ON public.clinics
FOR SELECT TO authenticated, anon
USING (owner_id = auth.uid());


-- 3. Users Table Policies
-- Allow insert during signup
CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT TO authenticated, anon
WITH CHECK (true);

-- Users can always see their own row (No recursion)
CREATE POLICY "users_select_own" ON public.users
FOR SELECT TO authenticated
USING (id = auth.uid());

-- Clinic owners can see all users in their clinic (Checks clinics table, not users)
CREATE POLICY "users_select_admin" ON public.users
FOR SELECT TO authenticated
USING (
  clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
);


-- 4. Patients Table Policies
-- Simplify to check via the clinics table ownership
DROP POLICY IF EXISTS "patients_select_policy" ON public.patients;
CREATE POLICY "patients_select_policy" ON public.patients
FOR SELECT TO authenticated
USING (
  clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  OR
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "patients_insert_policy" ON public.patients;
CREATE POLICY "patients_insert_policy" ON public.patients
FOR INSERT TO authenticated
WITH CHECK (
  clinic_id IN (SELECT id FROM public.clinics WHERE owner_id = auth.uid())
  OR
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);