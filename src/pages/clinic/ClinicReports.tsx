"use client";

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Sparkles, TrendingUp, AlertCircle, Lock, Star } from 'lucide-react';
import ReportFilters from '@/components/reports/ReportFilters';
import StatCards from '@/components/dashboard/StatCards';
import { computeReportAnalytics, ReportAnalytics } from '@/utils/reportDataUtils';
import { exportToExcel } from '@/utils/excelExport';
import { generatePdfReport } from '@/utils/pdfReportGenerator';
import { toast } from 'sonner';
import { getClinicStatus } from '@/utils/statusUtils';
import { cn } from '@/lib/utils';

const ClinicReports = () => {
  const { slug } = useParams();
  const [filterType, setFilterType] = useState<'monthly' | 'custom'>('monthly');
  const [filters, setFilters] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    startDate: '',
    endDate: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [clinic, setClinic] = useState<any>(null);

  useEffect(() => {
    const fetchClinic = async () => {
      const { data } = await supabase.from('clinics').select('*').eq('slug', slug).single();
      if (data) setClinic(data);
    };
    fetchClinic();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
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
      setAnalytics(computeReportAnalytics(data || []));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, filterType]);

  const getDateRangeString = () => {
    if (filterType === 'monthly') return `${filters.month} ${filters.year}`;
    return `${filters.startDate} to ${filters.endDate}`;
  };

  const { effectivePlan, status } = getClinicStatus(clinic);

  const isFeatureLocked = (feature: 'pdf' | 'excel') => {
    // During trial or free plan, certain features are restricted
    if (status === 'trialing' || effectivePlan === 'Free') {
      if (feature === 'excel' && effectivePlan !== 'Pro') return true;
      if (feature === 'pdf' && effectivePlan !== 'Basic' && effectivePlan !== 'Pro') return true;
    }
    // Additional check: if plan is Free and not trialing, also lock
    if (effectivePlan === 'Free') {
      if (feature === 'excel') return true;
      if (feature === 'pdf') return true;
    }
    return false;
  };

  const handleExportExcel = () => {
    if (isFeatureLocked('excel')) {
      let message = "Excel export is only available in the Pro plan.";
      if (status === 'trialing') {
        message += "\n\nYour 10‑day trial is active—upgrade to Pro to unlock this feature.";
      }
      toast.error(message, { duration: 5000 });
      return;
    }
    if (patients.length === 0) return toast.error("No data to export");
    exportToExcel(patients, `ClinicReport_${getDateRangeString().replace(/\s/g, '_')}`);
    toast.success("Excel report exported");
  };

  const handleExportPdf = () => {
    if (isFeatureLocked('pdf')) {
      let message = "PDF export is only available in Basic or Pro plans.";
      if (status === 'trialing') {
        message += "\n\nYour trial doesn't include PDF exports—upgrade to Basic or Pro to unlock this feature.";
      }
      toast.error(message, { duration: 5000 });
      return;
    }
    if (!analytics || patients.length === 0) return toast.error("No data to generate report");
    generatePdfReport(patients, analytics, clinic?.name || 'Clinic', getDateRangeString());
    toast.success("PDF report generated");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Document your practice performance for administration</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <Button 
            onClick={handleExportExcel}
            variant={isFeatureLocked('excel') ? 'outline' : 'default'}
            className={`w-full sm:w-auto rounded-2xl h-14 px-8 font-bold shadow-xl transition-all ${
              isFeatureLocked('excel') 
              ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500' 
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black'
            }`}
            disabled={loading || (patients.length === 0 && !isFeatureLocked('excel'))}
          >
            {isFeatureLocked('excel') ? <Lock className="w-4 h-4 mr-2" /> : <Download className="w-5 h-5 mr-2" />}
            Excel Export
          </Button>
          
          <Button 
            onClick={handleExportPdf}
            variant={isFeatureLocked('pdf') ? 'outline' : 'default'}
            className={`w-full sm:w-auto rounded-2xl h-14 px-8 font-bold shadow-xl transition-all ${
              isFeatureLocked('pdf')               ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            disabled={loading || (patients.length === 0 && !isFeatureLocked('pdf'))}
          >
            {isFeatureLocked('pdf') ? <Lock className="w-4 h-4 mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
            PDF Report
          </Button>
        </div>
      </div>

      <ReportFilters 
        filterType={filterType}
        setFilterType={setFilterType}
        filters={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
      />

      {status === 'expired' && (
        <div className="p-6 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm bg-rose-50 border-rose-100">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm">
              <Star className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-rose-900">
                Upgrade to Export
              </p>
              <p className="font-medium text-xs text-rose-800/60">
                Professional documentation tools are available in Basic and Pro plans.
              </p>
            </div>
          </div>
          <Button asChild className="w-full md:w-auto rounded-xl h-11 px-8 font-bold shadow-lg bg-rose-600">
            <Link to={`/clinic/${slug}/billing`}>Unlock All Features</Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 md:p-20 gap-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Analyzing Patient Data...</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Report Preview</h2>
          </div>
          
          <StatCards data={patients} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900 dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] shadow-2xl dark:shadow-none text-white relative overflow-hidden group border border-transparent dark:border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:bg-indigo-400/30 transition-all duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-500/20 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">Clinical Insights</h3>
                </div>
                <ul className="space-y-4">
                  {analytics?.aiInsights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 tracking-tight">Dominant Conditions</h3>
              <div className="space-y-5">
                {analytics?.topConditions.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">{c.name}</span>
                      <span className="text-indigo-600 dark:text-indigo-400 shrink-0">{c.count}</span>
                    </div>
                    <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${(c.count / patients.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 md:p-20 flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Data Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xs">Try selecting a different month or expanding your custom date range.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicReports;