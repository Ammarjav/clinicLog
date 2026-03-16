"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import RevenueCharts from '@/components/dashboard/RevenueCharts';
import { Button } from '@/components/ui/button';
import { RefreshCcw, UserPlus, TrendingUp, Settings, Banknote } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ClinicDashboard = () => {
  const { slug } = useParams();
  const [patients, setPatients] = useState<any[]>([]);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', slug)
        .single();
      if (clinicData) setClinic(clinicData);

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      setPatients(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [slug]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 sm:px-0">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start w-full">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic Overview</h1>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={fetchData} 
                className="rounded-xl h-10 w-10 md:h-11 md:w-11 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 shrink-0"
              >
                <RefreshCcw className={cn("w-4 h-4 text-slate-400", loading && "animate-spin")} />
              </Button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Daily operational summary and patient metrics</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <Button 
            className="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-14 sm:h-12 font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98]" 
            asChild
          >
            <Link to={`/clinic/${slug}/entry`}>
              <UserPlus className="w-5 h-5 mr-2" />
              New Patient
            </Link>
          </Button>

          <Button 
            variant="outline"
            className="flex-1 rounded-2xl border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 h-14 sm:h-12 font-bold shadow-sm transition-all active:scale-[0.98]"
            asChild
          >
            <Link to={`/clinic/${slug}/settings/fees`}>
              <Settings className="w-5 h-5 mr-2" />
              Fee Settings
            </Link>
          </Button>
        </div>
      </div>

      <StatCards data={patients} />

      {/* Simplified Revenue Summary for Dashboard */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Banknote className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Summary</h2>
        </div>
        {clinic && (
          <RevenueCharts 
            data={patients} 
            fees={{ new: clinic.new_visit_fee || 0, followUp: clinic.followup_visit_fee || 0 }} 
            variant="dashboard"
          />
        )}
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Basics</h2>
        </div>
        <Charts data={patients} variant="dashboard" />
      </div>
    </div>
  );
};

export default ClinicDashboard;