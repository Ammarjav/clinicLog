import React from 'react';
import { Users, UserCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatCardsProps {
  data: any[];
}

const StatCards = ({ data }: StatCardsProps) => {
  const total = data.length;
  const male = data.filter(p => p.gender === 'Male').length;
  const female = data.filter(p => p.gender === 'Female').length;

  const stats = [
    { title: 'Total Patients', value: total, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Male Patients', value: male, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Female Patients', value: female, icon: UserCheck, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-8 border-none shadow-2xl shadow-indigo-100/20 rounded-[2.5rem] bg-white flex flex-col justify-between hover:shadow-indigo-200/30 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <ArrowUpRight className="w-5 h-5 text-slate-200" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;