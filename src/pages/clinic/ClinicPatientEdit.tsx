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

  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setPatient(data);
      } catch (err: any) {
        toast.error("Could not retrieve patient record");
        navigate(`/clinic/${slug}/patients`);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Clinical Record...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0">
            <Link to={`/clinic/${slug}/patients`}><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div className="overflow-hidden">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">Clinical Workspace</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-0.5">Comprehensive documentation for <span className="text-indigo-600 font-bold">{patient?.name}</span></p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">HIPAA Protected Environment</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 dark:shadow-none">
        {patient && (
          <EditPatientForm 
            patient={patient} 
            onSuccess={() => navigate(`/clinic/${slug}/patients`)}
            onCancel={() => navigate(`/clinic/${slug}/patients`)}
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
        <Stethoscope className="w-3 h-3" />
        Practitioner Workspace v2.4
      </div>
    </div>
  );
};

export default ClinicPatientEdit;