"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Charts from '@/components/dashboard/Charts';
import { toast } from 'sonner';
import { BarChart3, Activity } from 'lucide-react';

const ClinicAnalytics = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) toast.error(error.message);
      else setPatients(data || []);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Detailed Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Deep dive into clinical trends and population distribution</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm dark:shadow-none border border-slate-50 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-xl">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Health Sync</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">Live Status</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Statistical Distribution</h2>
        </div>
        <Charts data={patients} />
      </div>
    </div>
  );
};

export default ClinicAnalytics;