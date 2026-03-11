"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  CalendarClock, 
  UserRoundCheck,
  Stethoscope,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

interface FollowupRemindersProps {
  clinicName: string;
}

const FollowupReminders = ({ clinicName }: FollowupRemindersProps) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('visit_date', { ascending: false });

      if (error) throw error;

      if (data) {
        // Group by phone/name to find history
        const patientHistory: Record<string, any[]> = {};
        data.forEach(p => {
          const key = p.phone || p.name;
          if (!patientHistory[key]) patientHistory[key] = [];
          patientHistory[key].push(p);
        });

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        const missedFollowups = Object.values(patientHistory)
          .filter(history => {
            const latest = history[0];
            const hasFollowup = history.some(h => h.visit_type === 'Follow-up');
            
            // Basic criteria: New patient, visit in the past, no follow-up yet
            const isEligible = latest.visit_type === 'New' && latest.visit_date < todayStr && !hasFollowup;
            
            if (!isEligible) return false;

            // Logic for reappearance:
            // If never sent, show it.
            // If sent, check if it was more than 2 days ago.
            if (!latest.last_reminder_sent_at) return true;

            const lastSent = new Date(latest.last_reminder_sent_at);
            const daysSinceReminder = differenceInDays(today, lastSent);
            
            return daysSinceReminder >= 2;
          })
          .map(h => h[0]);

        setReminders(missedFollowups);
      }
    } catch (err: any) {
      console.error("Reminder fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleWhatsApp = (patient: any) => {
    if (!patient.phone) {
      toast.error("No phone number recorded");
      return;
    }

    const date = new Date(patient.visit_date).toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric' 
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
      
      toast.success("Reminder logged. Reappearing in 48h if no visit occurs.");
      // Remove from local state immediately
      setReminders(prev => prev.filter(p => p.id !== patientId));
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) return null;
  if (reminders.length === 0) return null;

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className={cn(
          "w-full sm:w-auto h-12 rounded-2xl border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 font-bold px-6 shadow-sm flex items-center gap-3 transition-all",
          isOpen && "bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white border-transparent"
        )}
      >
        <CalendarClock className="w-5 h-5" />
        <span>Follow-up Reminders</span>
        <div className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
          isOpen ? "bg-white text-indigo-600" : "bg-indigo-600 text-white"
        )}>
          {reminders.length}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </Button>

      {isOpen && (
        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/10 overflow-hidden">
            <div className="max-h-[350px] overflow-y-auto">
              {reminders.map((patient, idx) => (
                <div 
                  key={patient.id} 
                  className={cn(
                    "p-5 flex flex-col sm:flex-row items-center justify-between gap-4 group transition-colors",
                    idx !== reminders.length - 1 && "border-b border-slate-50 dark:border-slate-800"
                  )}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl shrink-0">
                      <UserRoundCheck className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{patient.name}</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Stethoscope className="w-3 h-3" />
                        <span className="truncate">{patient.diagnosis}</span>
                        <span className="text-slate-200 dark:text-slate-700">•</span>
                        <Clock className="w-3 h-3" />
                        <span>Last: {new Date(patient.visit_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={() => handleWhatsApp(patient)}
                      className="flex-1 sm:flex-none rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-6 shrink-0 shadow-lg shadow-emerald-100 dark:shadow-none"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button 
                      onClick={() => markAsSent(patient.id)}
                      disabled={isProcessing === patient.id}
                      variant="outline"
                      className="rounded-xl h-10 px-4 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      title="Mark as sent (hide for 48h)"
                    >
                      {isProcessing === patient.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupReminders;