-- 1. Allow authenticated users to create their own clinic record
CREATE POLICY "clinics_insert_policy" ON public.clinics
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = owner_id);

-- 2. Allow users to view clinics they own (important during initial setup)
DROP POLICY IF EXISTS "clinics_select_policy" ON public.clinics;
CREATE POLICY "clinics_select_policy" ON public.clinics
FOR SELECT TO authenticated 
USING (
  id IN (SELECT clinic_id FROM public.users WHERE id = auth.uid())
  OR owner_id = auth.uid()
);

-- 3. Allow users to insert their own profile record into the users table
CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT TO authenticated 
WITH CHECK (id = auth.uid());

-- 4. Allow users to update their own profile record
CREATE POLICY "users_update_policy" ON public.users
FOR UPDATE TO authenticated 
USING (id = auth.uid());