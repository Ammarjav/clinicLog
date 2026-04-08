import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Clinic = {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  new_visit_fee: number;
  followup_visit_fee: number;
  doctor_name?: string;
  address?: string;
  logo_url?: string;
  plan: string;
  patient_limit: number;
  subscription_status: string;
  trial_end?: string;
};

export type Patient = {
  id: string;
  clinic_id: string;
  name: string;
  phone?: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  category?: string;
  visit_type: 'New' | 'Follow-up';
  visit_date: string;
  fee_paid: number;
  created_at: string;
  chief_complaint?: string;
  past_history?: string;
  physical_exam?: string;
  treatment_plan?: string;
  home_plan?: string;
};