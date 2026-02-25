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
    { title: 'Total Patients', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Male Patients', value: male, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Female Patients', value: female, icon: UserCheck, color: 'text-pink-600', bg: 'bg-pink-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6 border-none shadow-sm rounded-3xl bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;