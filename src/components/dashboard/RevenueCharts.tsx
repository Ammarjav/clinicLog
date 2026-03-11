"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Banknote, TrendingUp } from 'lucide-react';

interface RevenueChartsProps {
  data: any[];
  fees: { new: number; followUp: number };
}

const RevenueCharts = ({ data, fees }: RevenueChartsProps) => {
  // Calculate revenue per patient record
  const revenueData = data.map(p => ({
    ...p,
    revenue: p.visit_type === 'New' ? fees.new : fees.followUp
  }));

  // 1. Revenue Over Time
  const trendGroups: Record<string, number> = {};
  revenueData.forEach(p => {
    trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + p.revenue;
  });
  const trendData = Object.entries(trendGroups)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  // 2. Revenue by Visit Type
  const typeRevenue = { 'New Patients': 0, 'Follow-up': 0 };
  revenueData.forEach(p => {
    if (p.visit_type === 'New') typeRevenue['New Patients'] += fees.new;
    else typeRevenue['Follow-up'] += fees.followUp;
  });
  const typeData = Object.entries(typeRevenue).map(([name, value]) => ({ name, value }));

  // 3. Revenue by Gender
  const genderRevenue: Record<string, number> = {};
  revenueData.forEach(p => {
    genderRevenue[p.gender] = (genderRevenue[p.gender] || 0) + p.revenue;
  });
  const genderData = Object.entries(genderRevenue).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-3 border-none shadow-2xl rounded-xl">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label || payload[0].name}</p>
          <p className="text-base font-black text-emerald-600">
            Rs. {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden relative">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Revenue Stream</h3>
              <p className="text-xs text-slate-400 font-medium">Daily income trajectory (Last 14 days)</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Visit Value</h3>
              <p className="text-xs text-slate-400 font-medium">Income distribution by visit type</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl">
              <Banknote className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 md:col-span-3">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Demographic Revenue Contribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30}>
                  {genderData.map((entry, index) => (
                    <Bar key={index} dataKey="value" fill={index === 0 ? '#3b82f6' : '#ec4899'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RevenueCharts;