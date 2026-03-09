"use client";

import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, Legend 
} from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartsProps {
  data: any[];
}

const COLORS = ['#3b82f6', '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const Charts = ({ data }: ChartsProps) => {
  // 1. Age Group Distribution
  const ageGroups = { 'Pediatric (0-12)': 0, 'Teen (13-19)': 0, 'Adult (20-60)': 0, 'Geriatric (60+)': 0 };
  data.forEach(p => {
    const age = parseInt(p.age);
    if (age <= 12) ageGroups['Pediatric (0-12)']++;
    else if (age <= 19) ageGroups['Teen (13-19)']++;
    else if (age <= 60) ageGroups['Adult (20-60)']++;
    else ageGroups['Geriatric (60+)']++;
  });
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

  // 2. Gender Ratio
  const genderCounts: Record<string, number> = {};
  data.forEach(p => {
    genderCounts[p.gender] = (genderCounts[p.gender] || 0) + 1;
  });
  const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));

  // 3. Visit Type (New vs Follow-up)
  const visitCounts: Record<string, number> = {};
  data.forEach(p => {
    visitCounts[p.visit_type] = (visitCounts[p.visit_type] || 0) + 1;
  });
  const visitData = Object.entries(visitCounts).map(([name, value]) => ({ name, value }));

  // 4. Daily Trend
  const trendGroups: Record<string, number> = {};
  data.forEach(p => {
    trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + 1;
  });
  const trendData = Object.entries(trendGroups)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // Last 14 days

  // 5. Diagnosis Distribution
  const diagGroups: Record<string, number> = {};
  const diagCasing: Record<string, string> = {};
  data.forEach(p => {
    if (p.diagnosis) {
      const original = p.diagnosis.trim();
      const key = original.toLowerCase();
      diagGroups[key] = (diagGroups[key] || 0) + 1;
      if (!diagCasing[key]) diagCasing[key] = original;
    }
  });
  const diagData = Object.entries(diagGroups)
    .map(([key, value]) => ({ name: diagCasing[key], value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-3 border-none shadow-xl rounded-xl">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{label || payload[0].name}</p>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {payload[0].value} Patients
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Volume Trend */}
        <Card className="p-6 border-none shadow-sm dark:shadow-none rounded-3xl bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Patient Volume Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Diagnosis Distribution */}
        <Card className="p-6 border-none shadow-sm dark:shadow-none rounded-3xl bg-white dark:bg-slate-900">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Most Common Conditions</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Gender Distribution */}
        <Card className="p-6 border-none shadow-sm dark:shadow-none rounded-3xl bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Gender Ratio</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={genderData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {genderData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Visit Type Distribution */}
        <Card className="p-6 border-none shadow-sm dark:shadow-none rounded-3xl bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Visit Composition</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={visitData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {visitData.map((_, index) => <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Age Demographics */}
        <Card className="p-6 border-none shadow-sm dark:shadow-none rounded-3xl bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-6">Age Demographics</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={ageData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {ageData.map((_, index) => <Cell key={index} fill={COLORS[(index + 4) % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Charts;