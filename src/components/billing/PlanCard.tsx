"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Lock, ChevronUp } from 'lucide-react';

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

const PLAN_RANKS: Record<string, number> = {
  'Free': 0,
  'Basic': 1,
  'Pro': 2
};

const PlanCard = ({ plan, currentPlan = 'Free', isPending, onUpgrade }: PlanCardProps) => {
  const isActive = currentPlan === plan.name;
  
  const currentRank = PLAN_RANKS[currentPlan] ?? 0;
  const targetRank = PLAN_RANKS[plan.name] ?? 0;
  const isLowerPlan = currentRank > targetRank;
  
  return (
    <Card 
      className={`p-6 sm:p-8 h-full rounded-[2.5rem] sm:rounded-[3rem] border-none shadow-2xl dark:shadow-none flex flex-col transition-all duration-300 hover:scale-[1.01] ${
        plan.highlight 
          ? 'bg-slate-900 dark:bg-indigo-950 text-white ring-4 ring-indigo-500/10' 
          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-50 dark:border-slate-800'
      }`}
    >
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">{plan.name}</h3>
          {isActive && (
            <Badge className="bg-emerald-500 text-white border-none rounded-full px-2.5 py-0.5 font-black uppercase text-[9px] sm:text-[10px]">
              Active
            </Badge>
          )}
        </div>
        <div className="text-3xl sm:text-4xl font-black mb-1.5 sm:mb-2">
          ${plan.price}
          <span className="text-xs sm:text-sm font-normal text-slate-400">/mo</span>
        </div>
        <p className={`text-xs sm:text-sm opacity-70 leading-relaxed ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {plan.description}
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4 flex-1 mb-8 sm:mb-10">
        {plan.features.map((f, i) => (
          <div key={i} className="flex gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold items-start sm:items-center">
            <div className={`p-0.5 sm:p-1 rounded-full shrink-0 mt-0.5 sm:mt-0 ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="leading-tight">{f}</span>
          </div>
        ))}
      </div>
      
      <div className="space-y-3 mt-auto">
        <Button 
          disabled={isActive || plan.name === 'Free' || isPending || isLowerPlan} 
          onClick={() => onUpgrade(plan)}
          className={`w-full h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] ${
            plan.highlight 
              ? 'bg-white text-slate-900 hover:bg-slate-50' 
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
          } ${isLowerPlan ? 'opacity-40 grayscale pointer-events-none' : ''}`}
        >
          {isActive ? (
            'Plan Active'
          ) : isPending ? (
            'Processing...'
          ) : isLowerPlan ? (
            'Included'
          ) : (
            <span className="flex items-center gap-2">
              Upgrade <ChevronUp className="w-4 h-4" />
            </span>
          )}
        </Button>
        
        {isLowerPlan && (
          <p className="text-[10px] font-bold text-center text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">
            Higher tier active
          </p>
        )}
      </div>
    </Card>
  );
};

export default PlanCard;