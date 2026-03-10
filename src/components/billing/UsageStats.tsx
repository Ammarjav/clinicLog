"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UsageStatsProps {
  current: number;
  limit: number | string;
  plan: string;
}

const UsageStats = ({ current, limit, plan }: UsageStatsProps) => {
  const isUnlimited = typeof limit === 'string' || limit === -1 || limit === 2147483647;
  const numericLimit = typeof limit === 'number' ? limit : 50;
  const percentage = isUnlimited ? 0 : Math.min((current / numericLimit) * 100, 100);
  const { slug } = useParams();

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Plan Usage</p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{plan} Plan</h3>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {current} / {isUnlimited ? '∞' : limit} <span className="text-slate-400 font-medium">Patients</span>
          </p>
        </div>
      </div>
      
      {!isUnlimited && (
        <>
          <Progress value={percentage} className="h-1.5 mb-3 bg-slate-100 dark:bg-slate-800" />
          {percentage >= 80 && (
            <div className="flex flex-col gap-2 mt-2 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 leading-tight">Approaching limit. Upgrade to keep growing.</p>
              <Button asChild size="sm" className="h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9px] w-full">
                <Link to={`/clinic/${slug}/billing`}>Upgrade</Link>
              </Button>
            </div>
          )}
        </>
      )}
      
      {isUnlimited && (
        <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Unlimited capacity active.</p>
      )}
    </div>
  );
};

export default UsageStats;