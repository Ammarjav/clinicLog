"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartsProps {
  data: any[];
}

const COLORS = ['#3b82f6', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];

const Charts = ({ data }: ChartsProps) => {
  // Age Groups Logic with custom ranges: 0-5, 6-15, 16-50, 50+
  const ageGroups = { '0-5': 0, '6-15': 0, '16-50': 0, '50+': 0 };
  
  data.forEach(p => {
    const age = parseInt(p.age);
    if (age <= 5) ageGroups['0-5']++;
    else if (age <= 15) ageGroups['6-15']++;
    else if (age <= 50) ageGroups['16-50']++;
    else ageGroups['50+']++;
  });

  const ageData = Object.entries(ageGroups)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  // Diagnosis Distribution (Top 10)
  const diagGroups: Record<string, number> = {};
  data.forEach(p => {
    if (p.diagnosis) {
      diagGroups[p.diagnosis] = (diagGroups[p.diagnosis] || 0) + 1;
    }
  });
  
  const diagData = Object.entries(diagGroups)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Daily Trend
  const trendGroups: Record<string, number> = {};
  data.forEach(p => {
    trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + 1;
  });
  
  const trendData = Object.entries(trendGroups)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Age Distribution */}
      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Age Group Distribution</h3>
        <div className="h-[300px]">
          {ageData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={ageData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Patients']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No age data available
            </div>
          )}
        </div>
      </Card>

      {/* Visit Trend */}
      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Visit Trend</h3>
        <div className="h-[300px]">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No trend data available
            </div>
          )}
        </div>
      </Card>

      {/* Top Diagnoses */}
      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Diagnoses</h3>
        <div className="h-[350px]">
          {diagData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagData} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 11 }} 
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20} 
                  label={{ position: 'right', fontSize: 11, fill: '#64748b' }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              No diagnosis data available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Charts;