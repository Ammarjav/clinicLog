"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Charts from '@/components/dashboard/Charts';
import RevenueCharts from '@/components/dashboard/RevenueCharts';
import { toast } from 'sonner';
import { BarChart3, Activity, Banknote, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClinicAnalytics = () => {
  const { slug } = useParams();
  const [patients, setPatients] = useState<any[]>([]);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch patients
      const { data: patientData, error } = await supabase.from('patients').select('*');
      if (error) toast.error(error.message);
      else setPatients(patientData || []);

      // Fetch clinic for fees
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', slug)
        .single();
      if (clinicData) setClinic(clinicData);
      
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinical Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Deep dive into population trends and financial performance</p>
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

      <Tabs defaultValue="clinical" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl h-14 w-full sm:w-auto mb-8 border border-slate-200/50 dark:border-slate-800">
          <TabsTrigger value="clinical" className="rounded-xl px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-slate-500 dark:text-slate-400 data-[state=active]:text-indigo-600">
            <Sparkles className="w-4 h-4 mr-2" />
            Clinical Data
          </TabsTrigger>
          <TabsTrigger value="financial" className="rounded-xl px-8 h-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md font-bold text-slate-500 dark:text-slate-400 data-[state=active]:text-emerald-600">
            <Banknote className="w-4 h-4 mr-2" />
            Financials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="outline-none space-y-8">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Patient Distribution</h2>
          </div>
          <Charts data={patients} />
        </TabsContent>

        <TabsContent value="financial" className="outline-none space-y-8">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Insights</h2>
          </div>
          {clinic ? (
            <RevenueCharts 
              data={patients} 
              fees={{ new: clinic.new_visit_fee || 0, followUp: clinic.followup_visit_fee || 0 }} 
            />
          ) : (
            <div className="p-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-bold">Syncing clinic data...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicAnalytics;