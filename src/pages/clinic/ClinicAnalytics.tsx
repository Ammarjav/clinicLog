"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Charts from '@/components/dashboard/Charts';
import RevenueCharts from '@/components/dashboard/RevenueCharts';
import ReportFilters from '@/components/reports/ReportFilters';
import AdvancedClinicalCards from '@/components/dashboard/AdvancedClinicalCards';
import { toast } from 'sonner';
import { BarChart3, Activity, Banknote, Sparkles, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ClinicAnalytics = () => {
  const { slug } = useParams();
  const [patients, setPatients] = useState<any[]>([]);
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [filterType, setFilterType] = useState<'monthly' | 'custom'>('monthly');
  const [filters, setFilters] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!clinic) {
        const { data: clinicData } = await supabase
          .from('clinics')
          .select('*')
          .eq('slug', slug)
          .single();
        if (clinicData) setClinic(clinicData);
      }

      let query = supabase.from('patients').select('*');

      if (filterType === 'monthly') {
        const monthMap: Record<string, number> = {
          January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
          July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        };
        const m = monthMap[filters.month];
        const year = parseInt(filters.year);
        const startDate = `${year}-${String(m).padStart(2, '0')}-01`;
        const lastDay = new Date(year, m, 0).getDate();
        const endDate = `${year}-${String(m).padStart(2, '0')}-${lastDay}`;
        
        query = query.gte('visit_date', startDate).lte('visit_date', endDate);
      } else if (filters.startDate && filters.endDate) {
        query = query.gte('visit_date', filters.startDate).lte('visit_date', filters.endDate);
      }

      const { data, error } = await query.order('visit_date', { ascending: false });
      
      if (error) throw error;
      setPatients(data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug, filterType, filters]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinical Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Deep dive into population trends and clinical performance</p>
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

      <ReportFilters 
        filterType={filterType}
        setFilterType={setFilterType}
        filters={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
      />

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

        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-3xl">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Processing Analytics...</p>
            </div>
          )}

          <TabsContent value="clinical" className="outline-none space-y-8 m-0">
            <AdvancedClinicalCards data={patients} />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Patient Distribution</h2>
            </div>
            <Charts data={patients} />
          </TabsContent>

          <TabsContent value="financial" className="outline-none space-y-8 m-0">
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
        </div>
      </Tabs>
    </div>
  );
};

export default ClinicAnalytics;