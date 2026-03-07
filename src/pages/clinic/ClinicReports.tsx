"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import ReportFilters from '@/components/reports/ReportFilters';
import StatCards from '@/components/dashboard/StatCards';
import { computeReportAnalytics, ReportAnalytics } from '@/utils/reportDataUtils';
import { exportToExcel } from '@/utils/excelExport';
import { generatePdfReport } from '@/utils/pdfReportGenerator';
import { toast } from 'sonner';

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
  const [patients, setPatients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [clinicName, setClinicName] = useState('Clinic Portal');

  useEffect(() => {
    const fetchClinic = async () => {
      const { data } = await supabase.from('clinics').select('name').eq('slug', slug).single();
      if (data) setClinicName(data.name);
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, filterType]);

  const getDateRangeString = () => {
    if (filterType === 'monthly') return `${filters.month} ${filters.year}`;
    return `${filters.startDate} to ${filters.endDate}`;
  };

  const handleExportExcel = () => {
    if (patients.length === 0) return toast.error("No data to export");
    exportToExcel(patients, `ClinicReport_${getDateRangeString().replace(/\s/g, '_')}`);
    toast.success("Excel report exported");
  };

  const handleExportPdf = () => {
    if (!analytics || patients.length === 0) return toast.error("No data to generate report");
    generatePdfReport(patients, analytics, clinicName, getDateRangeString());
    toast.success("PDF report generated");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Clinic Reports</h1>
          <p className="text-slate-500 font-medium">Professional documentation of your practice performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleExportExcel}
            className="rounded-2xl h-14 px-8 bg-slate-900 hover:bg-black font-bold shadow-xl shadow-slate-200"
            disabled={loading || patients.length === 0}
          >
            <Download className="w-5 h-5 mr-2" />
            Export to Excel
          </Button>
          <Button 
            onClick={handleExportPdf}
            className="rounded-2xl h-14 px-8 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-xl shadow-indigo-100"
            disabled={loading || patients.length === 0}
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      <ReportFilters 
        filterType={filterType}
        setFilterType={setFilterType}
        filters={filters}
        onChange={(k, v) => setFilters(prev => ({ ...prev, [k]: v }))}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-slate-500 font-bold animate-pulse">Analyzing Patient Data...</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Report Preview</h2>
          </div>
          
          <StatCards data={patients} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Insights Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
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

            {/* Condition Trend Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm shadow-indigo-100/20">
              <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Dominant Conditions</h3>
              <div className="space-y-5">
                {analytics?.topConditions.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-700">
                      <span>{c.name}</span>
                      <span className="text-indigo-600">{c.count} Patients</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
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
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No Data for this Period</h3>
          <p className="text-slate-500 mt-2 max-w-xs">Try selecting a different month or expanding your custom date range.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicReports;