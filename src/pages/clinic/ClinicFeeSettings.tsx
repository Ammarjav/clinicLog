"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Banknote, 
  Loader2, 
  Save, 
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

const ClinicFeeSettings = () => {
  const { slug } = useParams();
  const [clinic, setClinic] = useState<any>(null);
  const [newFee, setNewFee] = useState('');
  const [followUpFee, setFollowUpFee] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClinic = async () => {
      const { data } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setClinic(data);
        setNewFee(data.new_visit_fee?.toString() || '0');
        setFollowUpFee(data.followup_visit_fee?.toString() || '0');
      }
      setLoading(false);
    };
    fetchClinic();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update({
          new_visit_fee: parseFloat(newFee) || 0,
          followup_visit_fee: parseFloat(followUpFee) || 0
        })
        .eq('slug', slug);

      if (error) throw error;
      toast.success("Clinic fees updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading protocol...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl shrink-0">
          <Link to={`/clinic/${slug}/dashboard`}><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="overflow-hidden">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter truncate">Fee Configuration</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-0.5">Define your clinical visit charges</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">New Patient Consultation</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="text-slate-300 font-bold text-lg">Rs.</span>
                </div>
                <Input 
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  className="rounded-2xl h-14 sm:h-16 pl-14 bg-slate-50 dark:bg-slate-800 border-none text-xl sm:text-2xl font-black focus:ring-indigo-500/20 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Follow-up Session Fee</Label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                  <span className="text-slate-300 font-bold text-lg">Rs.</span>
                </div>
                <Input 
                  type="number"
                  value={followUpFee}
                  onChange={(e) => setFollowUpFee(e.target.value)}
                  className="rounded-2xl h-14 sm:h-16 pl-14 bg-slate-50 dark:bg-slate-800 border-none text-xl sm:text-2xl font-black focus:ring-indigo-500/20 dark:text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex gap-4">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs font-medium text-indigo-700 dark:text-indigo-400 leading-relaxed">
              These rates will be used to calculate your real-time revenue analytics across the platform.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 sm:h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98]" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <><Save className="w-5 h-5 mr-3" /> Save Changes</>}
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">Instant Sync</h4>
          <p className="text-[11px] sm:text-xs text-slate-500">Analytics update immediately after saving new rates.</p>
        </div>
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">Profit Tracking</h4>
          <p className="text-[11px] sm:text-xs text-slate-500">Track earnings per patient based on visit type.</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicFeeSettings;