"use client";

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvancedClinicalCardsProps {
  data: any[];
}

const AdvancedClinicalCards = ({ data }: AdvancedClinicalCardsProps) => {
  const metrics = useMemo(() => {
    if (data.length === 0) return { retentionRate: 0, avgSessions: 0 };

    // Group by unique patient identity
    const patientGroups: Record<string, any[]> = {};
    data.forEach(p => {
      const key = `${p.name.toLowerCase().trim()}|${p.phone || ''}|${p.category || ''}`;
      if (!patientGroups[key]) patientGroups[key] = [];
      patientGroups[key].push(p);
    });

    const totalUnique = Object.keys(patientGroups).length;
    const returningCount = Object.values(patientGroups).filter(g => g.length > 1).length;
    
    const retentionRate = totalUnique > 0 ? (returningCount / totalUnique) * 100 : 0;
    const avgSessions = totalUnique > 0 ? data.length / totalUnique : 0;

    return {
      retentionRate: Math.round(retentionRate),
      avgSessions: Math.round(avgSessions * 10) / 10
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Retention Rate Card */}
      <Card className="p-8 border-none shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-indigo-200/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 group-hover:scale-110 transition-transform duration-300">
            <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            LOYALTY
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Patient Retention Rate</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{metrics.retentionRate}%</h3>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Percentage of patients who returned for additional therapy sessions.
          </p>
        </div>
      </Card>

      {/* Average Sessions Card */}
      <Card className="p-8 border-none shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-indigo-200/30 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ENGAGEMENT</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Avg Sessions per Patient</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{metrics.avgSessions}</h3>
            <span className="text-lg font-black text-slate-400">Sessions</span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Average number of physiotherapy sessions completed per patient.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedClinicalCards;