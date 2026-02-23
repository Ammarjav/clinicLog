-- 1. Create the patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  diagnosis TEXT NOT NULL,
  visit_type TEXT NOT NULL CHECK (visit_type IN ('New', 'Follow-up')),
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX idx_patients_visit_date ON patients(visit_date);
CREATE INDEX idx_patients_gender ON patients(gender);
CREATE INDEX idx_patients_diagnosis ON patients(diagnosis);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies
-- Anyone (public) can insert a patient record (for the entry form)
CREATE POLICY "Enable insert for anonymous users" 
ON patients FOR INSERT 
TO public
WITH CHECK (true);

-- Only authenticated admins can view all records
CREATE POLICY "Enable select for authenticated admins" 
ON patients FOR SELECT 
TO authenticated 
USING (true);

-- Only authenticated admins can update records
CREATE POLICY "Enable update for authenticated admins" 
ON patients FOR UPDATE 
TO authenticated 
USING (true);

-- Only authenticated admins can delete records
CREATE POLICY "Enable delete for authenticated admins" 
ON patients FOR DELETE 
TO authenticated 
USING (true);