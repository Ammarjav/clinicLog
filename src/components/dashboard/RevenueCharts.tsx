"use client";

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { 
  Wallet, Activity, ChevronUp, Target, CreditCard, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueChartsProps {
  data: any[];
  fees: { new: number; followUp: number };
  variant?: 'dashboard' | 'full';
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

const RevenueCharts = ({ data, fees, variant = 'full' }: RevenueChartsProps) => {
  const isDashboard = variant === 'dashboard';

  // Helper to get revenue per record
  const getRecordRevenue = (p: any) => {
    const manualFee = Number(p.fee_paid || 0);
    if (manualFee > 0) return manualFee;
    return p.visit_type === 'New' ? Number(fees.new) : Number(fees.followUp);
  };

  const stats = useMemo(() => {
    const totalRev = data.reduce((acc, curr) => acc + getRecordRevenue(curr), 0);
    
    let newRev = 0;
    let followUpRev = 0;
    data.forEach(p => {
      const rev = getRecordRevenue(p);
      if (p.visit_type === 'New') newRev += rev;
      else followUpRev += rev;
    });

    // Analytics only calculations
    const patientGroups: Record<string, any[]> = {};
    if (!isDashboard) {
      data.forEach(p => {
        const key = `${p.name.toLowerCase().trim()}|${p.phone || ''}|${p.category || ''}`;
        if (!patientGroups[key]) patientGroups[key] = [];
        patientGroups[key].push(p);
      });
    }

    const uniquePatientsCount = Object.keys(patientGroups).length;
    const revPerPatient = uniquePatientsCount > 0 ? totalRev / uniquePatientsCount : 0;

    const conditionMap: Record<string, number> = {};
    const conditionCasing: Record<string, string> = {};
    if (!isDashboard) {
      data.forEach(p => {
        if (p.diagnosis && p.diagnosis !== 'Pending Documentation') {
          const key = p.diagnosis.trim().toLowerCase();
          conditionMap[key] = (conditionMap[key] || 0) + getRecordRevenue(p);
          if (!conditionCasing[key]) conditionCasing[key] = p.diagnosis.trim();
        }
      });
    }

    const conditionData = Object.entries(conditionMap)
      .map(([key, value]) => ({ name: conditionCasing[key], value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalRev,
      newRev,
      followUpRev,
      revPerPatient,
      conditionData
    };
  }, [data, fees, isDashboard]);

  // Trajectory is full only
  const trendData = useMemo(() => {
    if (isDashboard) return [];
    const trendGroups: Record<string, number> = {};
    data.forEach(p => {
      trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + getRecordRevenue(p);
    });
    return Object.entries(trendGroups)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [data, fees, isDashboard]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label || payload[0].name}</p>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            Rs. {Number(payload[0].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isDashboard) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700">
        <MetricCard 
          title="Total Revenue" 
          value={`Rs. ${stats.totalRev.toLocaleString()}`} 
          subtitle="Clinic net earnings"
          icon={Wallet} 
          color="indigo" 
          className="h-full"
        />
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col items-center">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 w-full text-left">Revenue Split</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'New Patients', value: stats.newRev },
                    { name: 'Follow-ups', value: stats.followUpRev }
                  ]} 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'black', textTransform: 'uppercase', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  }

  // Full Analytics View
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Revenue" value={`Rs. ${stats.totalRev.toLocaleString()}`} subtitle="Net earnings" icon={Wallet} color="indigo" />
        <MetricCard title="Revenue/Patient" value={`Rs. ${Math.round(stats.revPerPatient).toLocaleString()}`} subtitle="Average yield" icon={Target} color="emerald" />
        <MetricCard title="Projection" value={`Rs. ${Math.round(stats.revPerPatient * 1.2).toLocaleString()}`} subtitle="Expected yield" icon={CreditCard} color="blue" />
        <MetricCard title="Loyalty Rate" value="High" subtitle="Repeat engagement" icon={RefreshCw} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Financial Trajectory</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col justify-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Split Analysis</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[{ name: 'New', value: stats.newRev }, { name: 'Follow', value: stats.followUpRev }]} 
                  innerRadius={60} 
                  outerRadius={90} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, icon: Icon, color, className }: any) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <Card className={cn("p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col justify-center transition-all hover:scale-[1.02] group", className)}>
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</h3>
        <p className="text-[10px] font-medium text-slate-400">{subtitle}</p>
      </div>
    </Card>
  );
};

export default RevenueCharts;