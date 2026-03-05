import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Clinic = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
};

export type AppUser = {
  id: string;
  clinic_id: string;
  role: string;
  created_at: string;
};

export type Patient = {
  id: string;
  clinic_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  visit_type: 'New' | 'Follow-up';
  visit_date: string;
  created_at: string;
};