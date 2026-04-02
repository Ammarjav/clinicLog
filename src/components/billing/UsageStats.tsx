"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from 'react-router-dom';
import { Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UsageStatsProps {
  current: number;
  limit: number | string;
  plan: string;
  isTrial?: boolean;
  daysLeft?: number;
  status?: 'trialing' | 'expired' | 'active';
}

const UsageStats = ({ current, limit, plan, isTrial, daysLeft, status }: UsageStatsProps) => {
  const isUnlimited = typeof limit === 'string' || limit === -1 || limit === 2147483647 || isTrial;
  const displayPlan = isTrial ? '10-Day Trial' : `${plan} Plan`;
  const numericLimit = typeof limit === 'number' ? limit : 50;
  const percentage = isUnlimited ? 0 : Math.min((current / numericLimit) * 100, 100);
  const { slug } = useParams();

  return (
    <Link 
      to={`/clinic/${slug}/billing`} 
      className="block bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Plan Usage</p>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{displayPlan}</h3>
        </div>
        {!isUnlimited && (
          <div className="text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              {current} / {limit}
            </p>
          </div>
        )}
      </div>
      
      {!isUnlimited && (
        <Progress value={percentage} className="h-1.5 mb-2 bg-slate-100 dark:bg-slate-800" />
      )}
      
      {isUnlimited && (
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Unrestricted capacity active.</p>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            {current} <span className="text-slate-400 font-medium text-[10px]">Patients</span>
          </p>
        </div>
      )}

      {(isTrial || status === 'expired') && (
        <div className={cn(
          "mt-3 pt-3 border-t flex items-center justify-between",
          status === 'expired' ? "border-rose-100 dark:border-rose-900/30" : "border-indigo-50 dark:border-indigo-900/30"
        )}>
          <div className="flex items-center gap-1.5">
            {status === 'expired' ? (
              <XCircle className="w-3 h-3 text-rose-500" />
            ) : (
              <Clock className="w-3 h-3 text-indigo-500" />
            )}
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              status === 'expired' ? "text-rose-600" : "text-indigo-600"
            )}>
              {status === 'expired' ? "Trial Ended" : "Trial Active"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {status === 'expired' ? "View-only" : `${daysLeft} days left`}
          </span>
        </div>
      )}
    </Link>
  );
};

export default UsageStats;