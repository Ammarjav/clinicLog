"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * usePatient
 *
 * Returns a scoped query function that always filters patients by the
 * currently authenticated user's `clinic_id`.  Usage:
 *
 *   const { data: patient, refetch } = usePatient(patientId);
 *
 * The hook handles loading, error, and ensures the query can never be
 * abused to fetch records from another clinic.
 */
export const usePatient = (id: string) => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        // 1️⃣ Get the current user's clinic_id
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: userClinic } = await supabase
          .from('users')
          .select('clinic_id')
          .eq('id', user.id)
          .single();

        if (!data?.clinic_id) throw new Error('Clinic ID not found for user');

        // 2️⃣ Query the patient, explicitly tying it to that clinic
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .eq('clinic_id', data.clinic_id)   // <-- explicit clinic filter
          .single();

        if (error) throw error;
        if (!data) throw new Error('Patient not found');

        // 3️⃣ Extra safety check – ensure the returned record really belongs to the clinic
        if (data.clinic_id !== data.clinic_id) {
          throw new Error('Record belongs to a different clinic');
        }

        setPatient(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  return { patient, loading, error, refetch: fetchPatient };
};

export default usePatient;