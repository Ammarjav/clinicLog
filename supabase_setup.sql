-- Ensure the patients table exists and has RLS enabled
ALTER TABLE IF EXISTS public.patients ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new records (for the public entry form)
DROP POLICY IF EXISTS "Allow public insert" ON public.patients;
CREATE POLICY "Allow public insert" ON public.patients 
FOR INSERT TO public WITH CHECK (true);

-- Allow anyone to read records (required for diagnosis suggestions on the landing page)
DROP POLICY IF EXISTS "Allow public read" ON public.patients;
CREATE POLICY "Allow public read" ON public.patients 
FOR SELECT TO public USING (true);

-- Allow authenticated users full control (for the admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.patients;
CREATE POLICY "Allow authenticated full access" ON public.patients 
FOR ALL TO authenticated USING (true);