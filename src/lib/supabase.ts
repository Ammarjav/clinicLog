import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

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