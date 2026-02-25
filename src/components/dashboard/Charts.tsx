"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Card } from '@/components/ui/card';

interface ChartsProps {
  data: any[];
}

const COLORS = ['#3b82f6', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];

const Charts = ({ data }: ChartsProps) => {
  const ageGroups = { '0-5': 0, '6-15': 0, '16-50': 0, '50+': 0 };
  data.forEach(p => {
    const age = parseInt(p.age);
    if (age <= 5) ageGroups['0-5']++;
    else if (age <= 15) ageGroups['6-15']++;
    else if (age <= 50) ageGroups['16-50']++;
    else ageGroups['50+']++;
  });
  const ageData = Object.entries(ageGroups).map(([name, value]) => ({ name, value }));

  // Diagnosis Distribution - Grouped Case-Insensitively
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
    .slice(0, 10);

  const trendGroups: Record<string, number> = {};
  data.forEach(p => {
    trendGroups[p.visit_date] = (trendGroups[p.visit_date] || 0) + 1;
  });
  const trendData = Object.entries(trendGroups)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Age Group Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {ageData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Visit Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 border-none shadow-sm rounded-3xl bg-white lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Top Diagnoses (Normalized)</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diagData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Charts;