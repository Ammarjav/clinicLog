"use client";

import { differenceInDays, isAfter, parseISO } from 'date-fns';

export type ClinicStatus = 'trialing' | 'expired' | 'active';

export const getClinicStatus = (clinic: any): { 
  status: ClinicStatus; 
  daysLeft: number; 
  isFeatureUnlocked: (feature: 'analytics' | 'reports' | 'followups' | 'actions') => boolean;
  effectivePlan: string;
} => {
  if (!clinic) return { status: 'expired', daysLeft: 0, isFeatureUnlocked: () => false, effectivePlan: 'Free' };

  const now = new Date();
  const trialEnd = clinic.trial_end ? parseISO(clinic.trial_end) : now;
  const isTrialActive = isAfter(trialEnd, now);
  const isSubscribed = clinic.plan !== 'Free';
  const daysLeft = Math.max(0, differenceInDays(trialEnd, now));

  let status: ClinicStatus = 'expired';
  if (isSubscribed) status = 'active';
  else if (isTrialActive) status = 'trialing';

  // During trial, they get 'Pro' features (unrestricted)
  const effectivePlan = (status === 'trialing' || clinic.plan === 'Pro') ? 'Pro' : clinic.plan;

  const isFeatureUnlocked = (feature: 'analytics' | 'reports' | 'followups' | 'actions') => {
    // Actions (Create/Edit/Delete) are ONLY allowed if subscribed OR trial is active
    if (feature === 'actions') return status !== 'expired';
    
    // Pro features
    if (feature === 'followups') return effectivePlan === 'Pro';
    
    // Basic/Pro features
    if (feature === 'analytics' || feature === 'reports') {
      return effectivePlan === 'Pro' || effectivePlan === 'Basic';
    }

    return false;
  };

  return { status, daysLeft, isFeatureUnlocked, effectivePlan };
};