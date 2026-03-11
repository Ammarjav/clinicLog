"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  UserRoundCheck,
  Stethoscope,
  Loader2,
  CheckCheck,
  AlertCircle,
  History,
  Info,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { differenceInDays, isBefore, parseISO, startOfDay } from 'date-fns';

const ClinicFollowups = () => {
  const { slug } = useParams();
  const [reminders, setReminders] = useState<any[]>([]);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('name')
        .eq('slug', slug)
        .single();
      setClinic(clinicData);

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const patientHistory: Record<string, any[]> = {};
        data.forEach(p => {
          const key = (p.phone || p.name).toLowerCase().trim();
          if (!patientHistory[key]) patientHistory[key] = [];
          patientHistory[key].push(p);
        });

        const now = new Date();
        const today = startOfDay(now);
        
        const missedFollowups = Object.values(patientHistory)
          .filter(history => {
            const latest = history[0];
            const hasAnyFollowup = history.some(h => h.visit_type === 'Follow-up');
            const visitDate = parseISO(latest.visit_date);
            const isPastVisit = isBefore(visitDate, today);
            
            const isEligible = latest.visit_type === 'New' && isPastVisit && !hasAnyFollowup;
            if (!isEligible) return false;

            if (!latest.last_reminder_sent_at) return true;
            const lastSent = parseISO(latest.last_reminder_sent_at);
            return differenceInDays(now, lastSent) >= 2;
          })
          .map(h => h[0]);

        setReminders(missedFollowups);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleWhatsApp = (patient: any) => {
    if (!patient.phone) return toast.error("No phone number recorded");
    const date = new Date(patient.visit_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    const message = `Hello ${patient.name}, this is ${clinic?.name}. %0A%0AWe are checking in following your initial consultation on ${date} regarding your ${patient.diagnosis}. We noticed you haven't visited for a follow-up session yet. %0A%0AHow is your recovery progressing? Please let us know if you'd like to schedule a follow-up appointment to monitor your condition.`;
    window.open(`https://wa.me/${patient.phone.replace('+', '')}?text=${message}`, '_blank');
  };

  const markAsSent = async (patientId: string) => {
    setIsProcessing(patientId);
    try {
      const { error } = await supabase
        .from('patients')
        .update({ last_reminder_sent_at: new Date().toISOString() })
        .eq('id', patientId);
      if (error) throw error;
      toast.success("Reminder marked as sent. Snoozed for 48h.");
      setReminders(prev => prev.filter(p => p.id !== patientId));
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0">
          <Link to={`/clinic/${slug}/patients`}><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">Follow-up Protocol</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-0.5">Automated screening for returning patients</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl sm:rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex gap-4">
        <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
          The protocol identifies patients with an initial visit who haven't returned. Mark Sent hides them for 48 hours.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 sm:p-20 gap-4 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analyzing Database...</p>
        </div>
      ) : reminders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {reminders.map((patient) => (
            <div key={patient.id} className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 hover:shadow-xl transition-all group">
              <div className="flex items-start sm:items-center gap-4 w-full">
                <div className="bg-slate-50 dark:bg-slate-800 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform shrink-0">
                  <UserRoundCheck className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">{patient.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-400 text-[10px] sm:text-xs font-bold mt-1">
                    <div className="flex items-center gap-1.5 shrink-0"><Stethoscope className="w-3.5 h-3.5" /> {patient.diagnosis}</div>
                    <div className="hidden sm:block text-slate-200 dark:text-slate-800">•</div>
                    <div className="flex items-center gap-1.5 shrink-0"><History className="w-3.5 h-3.5" /> First: {new Date(patient.visit_date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 w-full lg:w-auto pt-2 lg:pt-0">
                <Button onClick={() => handleWhatsApp(patient)} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 sm:h-12 px-6 sm:px-8 shadow-lg shadow-emerald-100 dark:shadow-none text-xs sm:text-sm">
                  <MessageCircle className="w-4 h-4 mr-2" /> Send Reminder
                </Button>
                <Button onClick={() => markAsSent(patient.id)} disabled={isProcessing === patient.id} variant="outline" className="rounded-xl h-11 sm:h-12 px-6 border-slate-100 dark:border-slate-800 font-bold text-xs sm:text-sm text-slate-500">
                  {isProcessing === patient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCheck className="w-4 h-4 mr-2" /> Mark Sent</>}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-[2.5rem] p-12 sm:p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Zero Pending Actions</h3>
          <p className="text-slate-500 font-medium mt-2 text-xs sm:text-sm">All patients are either up-to-date or have been recently reminded.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicFollowups;