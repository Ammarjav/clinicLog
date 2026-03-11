"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  CalendarClock, 
  UserRoundCheck,
  Stethoscope,
  Loader2,
  Clock,
  CheckCheck,
  AlertCircle,
  History,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { differenceInDays, isBefore, parseISO, startOfDay } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FollowupRemindersProps {
  clinicName: string;
}

const FollowupReminders = ({ clinicName }: FollowupRemindersProps) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;

      if (data) {
        // Group by patient identity (phone or name)
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
            // history is already sorted by visit_date DESC because the query was
            const latest = history[0];
            const hasAnyFollowup = history.some(h => h.visit_type === 'Follow-up');
            
            // Logic: 
            // 1. Most recent record must be 'New'
            // 2. The date must be before today (strictly in the past)
            // 3. No 'Follow-up' visits exist in their entire history
            const visitDate = parseISO(latest.visit_date);
            const isPastVisit = isBefore(visitDate, today);
            
            const isEligible = latest.visit_type === 'New' && isPastVisit && !hasAnyFollowup;
            
            if (!isEligible) return false;

            // 4. Snooze logic: If sent, only reappear after 2 days (48h)
            if (!latest.last_reminder_sent_at) return true;
            const lastSent = parseISO(latest.last_reminder_sent_at);
            return differenceInDays(now, lastSent) >= 2;
          })
          .map(h => h[0]);

        setReminders(missedFollowups);
      }
    } catch (err: any) {
      console.error("Reminder fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWhatsApp = (patient: any) => {
    if (!patient.phone) {
      toast.error("No phone number recorded");
      return;
    }

    const date = new Date(patient.visit_date).toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });

    const message = `Hello ${patient.name}, this is ${clinicName}. %0A%0AWe are checking in following your initial consultation on ${date} regarding your ${patient.diagnosis}. We noticed you haven't visited for a follow-up session yet. %0A%0AHow is your recovery progressing? Please let us know if you'd like to schedule a follow-up appointment to monitor your condition. %0A%0AWishing you a speedy recovery!`;

    const phone = patient.phone.replace('+', '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <Sheet onOpenChange={(open) => open && fetchReminders()}>
        <SheetTrigger asChild>
          <Button 
            variant="outline"
            className="w-full sm:w-auto h-14 rounded-2xl border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold px-8 shadow-sm flex items-center gap-3 transition-all hover:bg-indigo-600 hover:text-white group"
          >
            <CalendarClock className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Follow-up Reminders</span>
            <div className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
              Live Scan
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-none shadow-2xl dark:bg-slate-950 flex flex-col">
          <SheetHeader className="p-8 border-b border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                <CalendarClock className="w-6 h-6 text-indigo-600" />
              </div>
              <SheetTitle className="text-2xl font-black tracking-tight">Follow-up Protocol</SheetTitle>
            </div>
            <SheetDescription className="font-medium text-slate-500">
              Identifying patients who completed their first session but haven't returned.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Analyzing Database...</p>
              </div>
            ) : reminders.length > 0 ? (
              <>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-3 mb-6">
                  <Info className="w-5 h-5 text-blue-600 shrink-0" />
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 leading-relaxed">
                    Patients listed below had their first visit in the past but no follow-up sessions. "Mark Sent" hides them for 48 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  {reminders.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
                    >
                      <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                              <UserRoundCheck className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 dark:text-white text-lg">{patient.name}</h4>
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-0.5">
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>{patient.diagnosis}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                              <History className="w-3 h-3 text-amber-600" />
                              <span className="text-[10px] font-black text-amber-600 uppercase">First Visit</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(patient.visit_date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={() => handleWhatsApp(patient)}
                            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-100 dark:shadow-none"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                          <Button 
                            onClick={() => markAsSent(patient.id)}
                            disabled={isProcessing === patient.id}
                            variant="outline"
                            className="rounded-xl h-12 px-6 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-bold"
                          >
                            {isProcessing === patient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCheck className="w-4 h-4 mr-2" /> Mark Sent</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Zero Pending Actions</h3>
                  <p className="text-sm text-slate-500 font-medium max-w-[240px] mt-2">All patients are either up-to-date with follow-ups or have been recently reminded.</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
            <Button variant="ghost" className="w-full rounded-xl text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-widest" onClick={fetchReminders}>
              <Loader2 className={loading ? "animate-spin mr-2 h-3 w-3" : "hidden"} />
              Manual Sync Database
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FollowupReminders;