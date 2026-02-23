import { createClient } from '@supabase/supabase-js';

// These variables are populated when you link Supabase via the UI button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders to prevent the "supabaseUrl is required" crash if not yet connected
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

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