"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import { Button } from '@/components/ui/button';
import { RefreshCcw, UserPlus, TrendingUp } from 'lucide-react';
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

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time clinical metrics and patient trends</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="icon" onClick={fetchData} className="rounded-2xl border-slate-200 dark:border-slate-800 h-14 w-14 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none">
            <RefreshCcw className={cn("w-5 h-5 text-slate-400 dark:text-slate-500", loading && "animate-spin")} />
          </Button>
          <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-14 px-8 flex-1 md:flex-none font-bold shadow-xl shadow-indigo-100 dark:shadow-none" asChild>
            <Link to={`/clinic/${slug}/entry`}>
              <UserPlus className="w-5 h-5 mr-2" />
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