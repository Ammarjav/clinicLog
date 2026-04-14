"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import EditPatientForm from '@/components/forms/EditPatientForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Stethoscope, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const ClinicPatientEdit = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndPatient = async () => {
      try {
        // 1️⃣ Get authenticated user        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/admin/login');
          return;
        }

        // 2️⃣ Fetch the user's clinic_id
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('clinic_id')
          .eq('id', user.id)
          .single();

        if (userError || !userData?.clinic_id) {
          toast.error('Unable to determine your clinic');
          navigate('/clinic/' + slug + '/patients');
          return;
        }
        setClinicId(userData.clinic_id);

        // 3️⃣ Fetch patient record **and** ensure it belongs to the user's clinic
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .eq('clinic_id', userData.clinic_id)   // <-- explicit clinic filter
          .single();

        if (patientError) {
          toast.error('Failed to load patient record');
          navigate('/clinic/' + slug + '/patients');
          return;
        }

        // 4️⃣ Double‑check that the returned record really matches the clinic
        if (patientData?.clinic_id !== userData.clinic_id) {
          toast.error('Access denied – this record does not belong to your clinic');
          navigate('/clinic/' + slug + '/patients');
          return;
        }

        setPatient(patientData);
      } catch (err: any) {
        console.error(err);
        toast.error('Unexpected error while loading patient data');
        navigate('/clinic/' + slug + '/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndPatient();
  }, [id, slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Clinical Record...</p>
      </div>
    );
  }

  // If we got here without redirect, the patient is safe to edit
  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0 h-12 w-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <Link to={`/clinic/${slug}/patients`}><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="overflow-hidden">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">{patient?.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">Edit clinical details for this patient</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 dark:shadow-none">
        <EditPatientForm patient={patient} onSuccess={() => navigate(`/${slug}`)} onCancel={() => navigate(`/clinic/${slug}/patients`)} />
      </div>
    </div>
  );
};

export default ClinicPatientEdit;