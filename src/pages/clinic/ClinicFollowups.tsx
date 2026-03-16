"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  MessageCircle, 
  UserRoundCheck,
  Stethoscope,
  Loader2,
  CheckCheck,
  AlertCircle,
  History,
  Info,
  ArrowLeft,
  CalendarClock,
  ExternalLink
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
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0 h-12 w-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <Link to={`/clinic/${slug}/patients`}><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
          </Button>
          <div className="overflow-hidden">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter truncate">Follow-up Protocol</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">Identifying and reminding patients pending recovery monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 px-5 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-3 h-14 flex-1 lg:flex-none">
            <CalendarClock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div className="text-left">
              <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest leading-none">Pending Actions</p>
              <p className="text-lg font-black text-indigo-900 dark:text-indigo-200">{reminders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/20 flex gap-4 shadow-sm">
        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl shadow-sm h-fit">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 leading-relaxed py-1">
          This terminal identifies patients who had an initial consultation but haven't recorded a follow-up. 
          Use <span className="font-black text-blue-900 dark:text-white">WhatsApp</span> to send recovery check-ins or <span className="font-black text-blue-900 dark:text-white">Mark Sent</span> to snooze them for 48 hours.
        </p>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 dark:shadow-none border border-slate-50 dark:border-slate-800 p-20 flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Performing Database Scan...</p>
        </div>
      ) : reminders.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 dark:shadow-none border border-slate-50 dark:border-slate-800 overflow-hidden animate-in fade-in duration-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-md">
                <TableRow className="border-none">
                  <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Patient Identity</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Primary Diagnosis</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Initial Visit</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Last Contacted</TableHead>
                  <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Reminders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all border-b border-slate-50 dark:border-slate-800 group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                          <UserRoundCheck className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base">{patient.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{patient.phone || 'No Phone'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                        <Stethoscope className="w-4 h-4 text-indigo-400" />
                        <span>{patient.diagnosis}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
                        <History className="w-3.5 h-3.5" />
                        {new Date(patient.visit_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      {patient.last_reminder_sent_at ? (
                        <div className="flex flex-col">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">Sent Recently</span>
                          <span className="text-[10px] text-slate-400">{new Date(patient.last_reminder_sent_at).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700 font-black text-[10px] uppercase tracking-widest">Never Sent</span>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleWhatsApp(patient)}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 shadow-lg shadow-emerald-100 dark:shadow-none transition-all active:scale-[0.98]"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button 
                          onClick={() => markAsSent(patient.id)}
                          disabled={isProcessing === patient.id}
                          variant="outline"
                          className="rounded-xl h-10 px-6 border-slate-100 dark:border-slate-800 font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          {isProcessing === patient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4 mr-2" />}
                          Mark
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertCircle className="w-10 h-10 text-slate-200 dark:text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Zero Pending Actions</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-xs mx-auto leading-relaxed">
            Your database is synchronized. All patients are either up-to-date or have been recently contacted.
          </p>
          <Button 
            variant="ghost" 
            onClick={fetchData} 
            className="mt-8 rounded-xl text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-50"
          >
            Force Live Scan
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
        <CalendarClock className="w-3 h-3" />
        Automated Protocol Sync Active
      </div>
    </div>
  );
};

export default ClinicFollowups;