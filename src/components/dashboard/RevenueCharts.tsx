"use client";

import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, Wallet, Users, 
  RefreshCw, Award, Activity,
  ChevronUp, Target, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueChartsProps {
  data: any[];
  fees: { new: number; followUp: number };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
const GRADIENTS = ['from-indigo-600 to-indigo-400', 'from-emerald-600 to-emerald-400', 'from-amber-600 to-amber-400'];

const RevenueCharts = ({ data, fees }: RevenueChartsProps) => {
  // Helper to get the actual or estimated fee for a record
  const getRecordRevenue = (p: any) => {
    const manualFee = Number(p.fee_paid || 0);
    if (manualFee > 0) return manualFee;
    return p.visit_type === 'New' ? Number(fees.new) : Number(fees.followUp);
  };

  // Group data by unique patient identity
  const patientGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    data.forEach(p => {
      const key = `${p.name.toLowerCase().trim()}|${p.phone || ''}|${p.category || ''}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [data]);

  const stats = useMemo(() => {
    const totalRev = data.reduce((acc, curr) => acc + getRecordRevenue(curr), 0);
    const uniquePatientsCount = Object.keys(patientGroups).length;
    
    // Revenue per Patient
    const revPerPatient = uniquePatientsCount > 0 ? totalRev / uniquePatientsCount : 0;

    // Return Rate (Patients with > 1 session / Total patients)
    const returningPatients = Object.values(patientGroups).filter(group => group.length > 1).length;
    const returnRate = uniquePatientsCount > 0 ? (returningPatients / uniquePatientsCount) * 100 : 0;

    // Follow-up vs New Revenue
    let newRev = 0;
    let followUpRev = 0;
    data.forEach(p => {
      const rev = getRecordRevenue(p);
      if (p.visit_type === 'New') newRev += rev;
      else followUpRev += rev;
    });

    // Condition Revenue
    const conditionMap: Record<string, number> = {};
    const conditionCasing: Record<string, string> = {};
    data.forEach(p => {
      if (p.diagnosis && p.diagnosis !== 'Pending Documentation') {
        const key = p.diagnosis.trim().toLowerCase();
        conditionMap[key] = (conditionMap[key] || 0) + getRecordRevenue(p);
        if (!conditionCasing[key]) conditionCasing[key] = p.diagnosis.trim();
      }
    });
    const conditionData = Object.entries(conditionMap)
      .map(([key, value]) => ({ name: conditionCasing[key], value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalRev,
      revPerPatient,
      returnRate,
      newRev,
      followUpRev,
      conditionData,
      uniquePatientsCount
    };
  }, [data, patientGroups, fees]);

  // Daily Trend Data
  const trendData = useMemo(() => {
    const trendGroups: Record<string, number> = {};
    data.forEach(p => {
      trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + getRecordRevenue(p);
    });
    return Object.entries(trendGroups)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [data, fees]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={`Rs. ${stats.totalRev.toLocaleString()}`} 
          subtitle="Net clinic earnings"
          icon={Wallet} 
          color="indigo" 
        />
        <MetricCard 
          title="Revenue per Patient" 
          value={`Rs. ${Math.round(stats.revPerPatient).toLocaleString()}`} 
          subtitle="Average generated per patient"
          icon={Target} 
          color="emerald" 
        />
        <MetricCard 
          title="Patient Lifetime Value" 
          value={`Rs. ${Math.round(stats.revPerPatient * 1.2).toLocaleString()}`} // Simple projection for UI
          subtitle="Estimated LTV projection"
          icon={CreditCard} 
          color="blue" 
        />
        <MetricCard 
          title="Patient Return Rate" 
          value={`${Math.round(stats.returnRate)}%`} 
          subtitle="Returning for therapy"
          icon={RefreshCw} 
          color="amber" 
          showTrend
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Financial Trajectory */}
        <Card className="lg:col-span-2 p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Financial Trajectory</h3>
            <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last 14 Days</span>
            </div>
          </div>
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
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contribution Donut */}
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Revenue Split</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[
                    { name: 'New Patients', value: stats.newRev },
                    { name: 'Follow-ups', value: stats.followUpRev }
                  ]} 
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
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-slate-500">New Patients</span>
              </div>
              <span className="text-slate-900 dark:text-white">{Math.round((stats.newRev / stats.totalRev) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Follow-ups</span>
              </div>
              <span className="text-slate-900 dark:text-white">{Math.round((stats.followUpRev / stats.totalRev) * 100)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue by Condition */}
      <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue by Condition</h3>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.conditionData} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.05} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[0, 12, 12, 0]} 
                barSize={32}
              >
                {stats.conditionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// Helper Sub-component for Metric Cards
const MetricCard = ({ title, value, subtitle, icon: Icon, color, showTrend }: any) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <Card className="p-6 md:p-8 border-none shadow-sm dark:shadow-none rounded-[2rem] bg-white dark:bg-slate-900 flex flex-col justify-between transition-all hover:scale-[1.02] group">
      <div className="flex justify-between items-start mb-6">
        <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {showTrend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
            <ChevronUp className="w-3 h-3" />
            +12%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{value}</h3>
        <p className="text-[10px] font-medium text-slate-400">{subtitle}</p>
      </div>
    </Card>
  );
};

export default RevenueCharts;