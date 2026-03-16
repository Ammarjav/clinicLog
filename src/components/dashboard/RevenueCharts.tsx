"use client";

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, Wallet, Banknote } from 'lucide-react';

interface RevenueChartsProps {
  data: any[];
  fees: { new: number; followUp: number };
}

const RevenueCharts = ({ data, fees }: RevenueChartsProps) => {
  // Use real fee_paid data from records
  const totalRevenue = data.reduce((acc, curr) => acc + (curr.fee_paid || 0), 0);

  // 1. Revenue Over Time (Real Data)
  const trendGroups: Record<string, number> = {};
  data.forEach(p => {
    trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + (p.fee_paid || 0);
  });
  const trendData = Object.entries(trendGroups)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 2. Revenue by Visit Type (Real Data)
  const typeRevenue = { 'New Patients': 0, 'Follow-up': 0 };
  data.forEach(p => {
    if (p.visit_type === 'New') typeRevenue['New Patients'] += (p.fee_paid || 0);
    else typeRevenue['Follow-up'] += (p.fee_paid || 0);
  });
  const typeData = Object.entries(typeRevenue).map(([name, value]) => ({ name, value }));

  // 3. Revenue by Gender (Real Data)
  const genderRevenue: Record<string, number> = {};
  data.forEach(p => {
    genderRevenue[p.gender] = (genderRevenue[p.gender] || 0) + (p.fee_paid || 0);
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
      <Card className="p-8 border-none shadow-2xl shadow-emerald-100/20 dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all duration-300">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl group-hover:scale-110 transition-transform">
            <Wallet className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Live Net Revenue</p>
            <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              Rs. {totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Actual earnings from {data.length} records</p>
          <div className="mt-2 flex gap-4 text-[10px] font-black uppercase tracking-widest">
            <span className="text-indigo-600">Pricing Base: Standard Rates Applied</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Financial Trajectory</h3>
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
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Visit Composition Value</h3>
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
    </div>
  );
};

export default RevenueCharts;