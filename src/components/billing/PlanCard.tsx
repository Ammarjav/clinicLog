"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PlanCardProps {
  plan: {
    name: string;
    price: string;
    description: string;
    features: string[];
    highlight?: boolean;
  };
  currentPlan?: string;
  isPending?: boolean;
  onUpgrade: (plan: any) => void;
}

const PlanCard = ({ plan, currentPlan, isPending, onUpgrade }: PlanCardProps) => {
  const isActive = currentPlan === plan.name;
  
  return (
    <Card 
      className={`p-8 h-full rounded-[3rem] border-none shadow-2xl dark:shadow-none flex flex-col transition-all duration-300 hover:scale-[1.02] ${
        plan.highlight 
          ? 'bg-slate-900 dark:bg-indigo-950 text-white ring-4 ring-indigo-500/20' 
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-50 dark:border-slate-800'
      }`}
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
          {isActive && (
            <Badge className="bg-emerald-500 text-white border-none rounded-full px-3 py-1 font-black uppercase text-[10px]">
              Current
            </Badge>
          )}
        </div>
        <div className="text-4xl font-black mb-2">
          ${plan.price}
          <span className="text-sm font-normal text-slate-400">/mo</span>
        </div>
        <p className={`text-sm opacity-70 ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {plan.description}
        </p>
      </div>
      
      <div className="space-y-4 flex-1 mb-10">
        {plan.features.map((f, i) => (
          <div key={i} className="flex gap-3 text-sm font-bold items-center">
            <div className={`p-1 rounded-full ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Check className="w-3.5 h-3.5" />
            </div>
            {f}
          </div>
        ))}
      </div>
      
      <Button 
        disabled={isActive || plan.name === 'Free' || isPending} 
        onClick={() => onUpgrade(plan)}
        className={`w-full h-14 rounded-2xl font-black text-base shadow-lg transition-all active:scale-[0.98] ${
          plan.highlight 
            ? 'bg-white text-slate-900 hover:bg-slate-50' 
            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
        }`}
      >
        {isActive ? 'Plan Active' : isPending ? 'Verification Pending' : `Upgrade to ${plan.name}`}
      </Button>
    </Card>
  );
};

export default PlanCard;