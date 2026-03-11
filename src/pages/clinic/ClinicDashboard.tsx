"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import { Button } from '@/components/ui/button';
import { RefreshCcw, UserPlus, TrendingUp, Settings } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ClinicDashboard = () => {
  const { slug } = useParams();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('visit_date', { ascending: false });
    
    if (error) toast.error(error.message);
    else setPatients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [slug]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Real-time clinical metrics and patient trends</p>
        </div>
        
        <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchData} 
            className="rounded-xl border-slate-200 dark:border-slate-800 h-11 w-11 bg-white dark:bg-slate-900 shadow-sm shrink-0"
          >
            <RefreshCcw className={cn("w-4 h-4 text-slate-400", loading && "animate-spin")} />
          </Button>
          
          <Button 
            variant="outline"
            className="rounded-xl border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-700 h-11 px-4 sm:px-5 font-bold shadow-sm text-xs sm:text-sm"
            asChild
          >
            <Link to={`/clinic/${slug}/settings/fees`}>
              <Settings className="w-4 h-4 mr-2" />
              <span className="truncate">Fee Settings</span>
            </Link>
          </Button>

          <Button 
            className="col-span-2 sm:col-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-5 font-bold shadow-lg shadow-indigo-100 dark:shadow-none text-xs sm:text-sm" 
            asChild
          >
            <Link to={`/clinic/${slug}/entry`}>
              <UserPlus className="w-4 h-4 mr-2" />
              New Patient
            </Link>
          </Button>
        </div>
      </div>

      <StatCards data={patients} />
      
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Performance Analytics</h2>
        </div>
        <Charts data={patients} />
      </div>
    </div>
  );
};

export default ClinicDashboard;