-- 1. DROP ALL EXISTING POLICIES TO PREVENT HIDDEN CYCLES
DO $$ 
DECLARE 
    pol record;
BEGIN
    FOR pol IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 2. USERS TABLE (The base table, no subqueries here)
-- Allow anyone to insert their own record during signup
CREATE POLICY "users_insert_signup" ON public.users 
FOR INSERT TO authenticated, anon 
WITH CHECK (true);

-- Users can see their own record (STRICTLY NO SUBQUERIES HERE)
CREATE POLICY "users_select_self" ON public.users 
FOR SELECT TO authenticated, anon
USING (id = auth.uid());

-- 3. CLINICS TABLE (Depends on users)
-- Allow insert during signup
CREATE POLICY "clinics_insert_signup" ON public.clinics 
FOR INSERT TO authenticated, anon 
WITH CHECK (true);

-- A user can see a clinic if they are the owner OR if they have a record in the users table for it
CREATE POLICY "clinics_select_member" ON public.clinics 
FOR SELECT TO authenticated, anon
USING (
  owner_id = auth.uid() 
  OR 
  id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- 4. PATIENTS TABLE (Depends on users)
-- Users can see patients in the clinic they belong to
CREATE POLICY "patients_select_member" ON public.patients 
FOR SELECT TO authenticated
USING (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- Users can insert patients into the clinic they belong to
CREATE POLICY "patients_insert_member" ON public.patients 
FOR INSERT TO authenticated
WITH CHECK (
  clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
);

-- Users can edit/delete patients in their clinic
CREATE POLICY "patients_update_member" ON public.patients 
FOR UPDATE TO authenticated
USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "patients_delete_member" ON public.patients 
FOR DELETE TO authenticated
USING (clinic_id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid()));