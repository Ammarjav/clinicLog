"use client";

import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, Legend 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Activity, Users, UserCheck } from 'lucide-react';

interface ChartsProps {
  data: any[];
  showCorrelation?: boolean;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

const Charts = ({ data, showCorrelation = true }: ChartsProps) => {
  // 1. Visit Type (New vs Follow-up)
  const visitData = useMemo(() => {
    const visitCounts: Record<string, number> = {};
    data.forEach(p => {
      visitCounts[p.visit_type] = (visitCounts[p.visit_type] || 0) + 1;
    });
    return Object.entries(visitCounts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 2. Gender Distribution
  const genderData = useMemo(() => {
    const genderCounts: Record<string, number> = {};
    data.forEach(p => {
      genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
    });
    return Object.entries(genderCounts).map(([name, value]) => ({ name, value }));
  }, [data]);

  // 3. Age Group Distribution
  const ageGroupData = useMemo(() => {
    const groups = [
      { name: '0-18', min: 0, max: 18 },
      { name: '19-35', min: 19, max: 35 },
      { name: '36-60', min: 36, max: 60 },
      { name: '60+', min: 61, max: 200 },
    ];
    return groups.map(g => ({
      name: g.name,
      value: data.filter(p => p.age >= g.min && p.age <= g.max).length
    }));
  }, [data]);

  // 4. Daily Trend
  const trendData = useMemo(() => {
    const trendGroups: Record<string, number> = {};
    data.forEach(p => {
      trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + 1;
    });
    return Object.entries(trendGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);
  }, [data]);

  // 5. Diagnosis Distribution (Top 8)
  const diagData = useMemo(() => {
    const diagGroups: Record<string, number> = {};
    const diagCasing: Record<string, string> = {};
    data.forEach(p => {
      if (p.diagnosis && p.diagnosis !== 'Pending Documentation') {
        const key = p.diagnosis.trim().toLowerCase();
        diagGroups[key] = (diagGroups[key] || 0) + 1;
        if (!diagCasing[key]) diagCasing[key] = p.diagnosis.trim();
      }
    });
    return Object.entries(diagGroups)
      .map(([key, value]) => ({ name: diagCasing[key], value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [data]);

  // 6. Age vs Condition Correlation
  const correlationData = useMemo(() => {
    if (!showCorrelation) return [];
    const ageRanges = [
      { label: '0-18', min: 0, max: 18 },
      { label: '19-30', min: 19, max: 30 },
      { label: '31-45', min: 31, max: 45 },
      { label: '46-60', min: 46, max: 60 },
      { label: '60+', min: 61, max: 200 },
    ];
    const topConditions = diagData.slice(0, 5).map(d => d.name);
    return ageRanges.map(range => {
      const patientsInRange = data.filter(p => p.age >= range.min && p.age <= range.max);
      const row: any = { range: range.label };
      topConditions.forEach(cond => {
        row[cond] = patientsInRange.filter(p => p.diagnosis?.toLowerCase() === cond.toLowerCase()).length;
      });
      const accounted = topConditions.reduce((acc, cond) => acc + row[cond], 0);
      row.Others = patientsInRange.length - accounted;
      return row;
    });
  }, [data, diagData, showCorrelation]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{label || payload[0].name}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{entry.name}</span>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const topConditions = diagData.slice(0, 5).map(d => d.name);

  return (
    <div className="space-y-8">
      {/* Top Row: Main Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Patient Volume Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Common Conditions</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.05} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Advanced Demographics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Gender Distribution */}
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-6">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Gender Split</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} innerRadius={50} outerRadius={70} paddingAngle={10} dataKey="value">
                  {genderData.map((_, index) => <Cell key={index} fill={index === 0 ? '#6366f1' : '#ec4899'} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Age Group Distribution */}
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Age Range</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroupData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Visit Composition */}
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Visit Status</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={visitData} innerRadius={50} outerRadius={70} paddingAngle={10} dataKey="value">
                  {visitData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Correlation Chart - Only visible if prop is true */}
      {showCorrelation && (
        <Card className="p-8 border-none shadow-sm dark:shadow-none rounded-[2.5rem] bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Age vs Condition Correlation</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="range" tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold' }} />
                {topConditions.map((cond, i) => (
                  <Bar key={cond} dataKey={cond} stackId="a" fill={COLORS[i % COLORS.length]} />
                ))}
                <Bar dataKey="Others" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Charts;