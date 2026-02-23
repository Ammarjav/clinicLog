import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type Patient = {
  id: string;
  name: string | null;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosis: string;
  visit_type: 'New' | 'Follow-up';
  visit_date: string;
  created_at: string;
};