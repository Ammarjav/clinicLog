"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  CalendarClock, 
  ChevronRight, 
  UserRoundCheck,
  Stethoscope,
  Loader2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface FollowupRemindersProps {
  clinicName: string;
}

const FollowupReminders = ({ clinicName }: FollowupRemindersProps) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      try {
        // Fetch all patients to analyze history
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('visit_date', { ascending: false });

        if (error) throw error;

        if (data) {
          // Group by phone to find patients who only had a 'New' visit
          const patientHistory: Record<string, any[]> = {};
          data.forEach(p => {
            const key = p.phone || p.name; // Use phone as primary key if available
            if (!patientHistory[key]) patientHistory[key] = [];
            patientHistory[key].push(p);
          });

          const today = new Date().toISOString().split('T')[0];
          
          const missedFollowups = Object.values(patientHistory)
            .filter(history => {
              const latest = history[0];
              // Condition: Latest visit was 'New', it wasn't today, and they have no follow-up sessions
              const hasFollowup = history.some(h => h.visit_type === 'Follow-up');
              return latest.visit_type === 'New' && latest.visit_date < today && !hasFollowup;
            })
            .map(h => h[0]) // Get the latest (and only) visit record
            .slice(0, 5); // Show top 5 reminders

          setReminders(missedFollowups);
        }
      } catch (err: any) {
        console.error("Reminder fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  const handleWhatsApp = (patient: any) => {
    if (!patient.phone) {
      toast.error("No phone number recorded for this patient");
      return;
    }

    const date = new Date(patient.visit_date).toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric' 
    });

    const message = `Hello ${patient.name}, this is ${clinicName}. %0A%0AWe are checking in following your initial consultation on ${date} regarding your ${patient.diagnosis}. We noticed you haven't visited for a follow-up session yet. %0A%0AHow is your recovery progressing? Please let us know if you'd like to schedule a follow-up appointment to monitor your condition. %0A%0AWishing you a speedy recovery!`;

    // Clean phone number (ensure no + for the link construction but keeping it for the API)
    const phone = patient.phone.replace('+', '');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  if (loading) return (
    <div className="flex items-center gap-3 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm mb-8">
      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Scanning for missed follow-ups...</span>
    </div>
  );

  if (reminders.length === 0) return null;

  return (
    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Follow-up Queue</h2>
        </div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {reminders.length} Pending Actions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((patient) => (
          <Card key={patient.id} className="p-6 rounded-[2rem] border-none shadow-xl shadow-indigo-100/20 dark:shadow-none bg-white dark:bg-slate-900 group hover:ring-2 hover:ring-indigo-500/20 transition-all">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-xl">
                    <UserRoundCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100 dark:border-amber-900/30">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">Missed Follow-up</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-black text-slate-900 dark:text-white truncate mb-1">{patient.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-4">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold truncate">{patient.diagnosis}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
                <Button 
                  onClick={() => handleWhatsApp(patient)}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-lg shadow-emerald-100 dark:shadow-none"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Check condition
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FollowupReminders;