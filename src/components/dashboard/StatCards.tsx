import React from 'react';
import { Users, UserCheck, ArrowUpRight, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardsProps {
  data: any[];
}

const StatCards = ({ data }: StatCardsProps) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const total = data.length;
  const todayTotal = data.filter(p => p.visit_date === todayStr).length;

  const male = data.filter(p => p.gender === 'Male').length;
  const todayMale = data.filter(p => p.gender === 'Male' && p.visit_date === todayStr).length;

  const female = data.filter(p => p.gender === 'Female').length;
  const todayFemale = data.filter(p => p.gender === 'Female' && p.visit_date === todayStr).length;

  const stats = [
    { 
      title: 'Total Patients', 
      value: total, 
      today: todayTotal,
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      title: 'Male Patients', 
      value: male, 
      today: todayMale,
      icon: UserCheck, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Female Patients', 
      value: female, 
      today: todayFemale,
      icon: UserCheck, 
      color: 'text-pink-600', 
      bg: 'bg-pink-50' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-8 border-none shadow-2xl shadow-indigo-100/20 rounded-[2.5rem] bg-white flex flex-col justify-between hover:shadow-indigo-200/30 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-200" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-tight">Today</span>
                <span className={cn("text-base font-black", stat.color)}>{stat.today}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;