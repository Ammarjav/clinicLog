"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShieldCheck, Landmark, AlertCircle, MessageCircle, RefreshCw, Loader2, XCircle } from 'lucide-react';
import PaymentModal from '@/components/billing/PaymentModal';
import { toast } from 'sonner';

const PLANS = [
  { name: 'Free', price: '0', description: 'Perfect for small private practices', features: ['Maximum 50 patients', 'Dashboard access', 'Basic analytics'], limit: 50 },
  { name: 'Basic', price: '5', description: 'Grow your clinic with confidence', features: ['Maximum 200 patients', 'Detailed analytics', 'PDF reports'], limit: 200, highlight: true },
  { name: 'Pro', price: '7', description: 'Unlimited power for high-volume clinics', features: ['Unlimited patients', 'Excel export', 'Advanced analytics'], limit: 2147483647 }
];

const ClinicBilling = () => {
  const [clinic, setClinic] = useState<any>(null);
  const [latestPayment, setLatestPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (showToast = false) => {
    if (showToast) setIsRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('clinic_id, clinics(*)')
        .eq('id', user.id)
        .single();
      
      if (userData?.clinics) {
        setClinic(userData.clinics);
        
        // Fetch the absolute latest payment attempt
        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('clinic_id', userData.clinic_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setLatestPayment(paymentData);
        if (showToast) toast.success("Billing status synchronized");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpgrade = (plan: any) => {
    if (plan.name === clinic?.plan) return toast.info("Already on this plan");
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleClearRejection = async () => {
    setLatestPayment(null);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Loading subscription...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic Subscription</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your plan and clinical limits</p>
        </div>
        <Button variant="outline" onClick={() => fetchData(true)} disabled={isRefreshing} className="rounded-xl font-bold h-12 px-6">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Check Status
        </Button>
      </div>

      {/* Verification Banner: ONLY shown if status is 'pending' */}
      {latestPayment?.status === 'pending' && (
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-800/40 p-3 rounded-2xl">
              <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">Verification in Progress</p>
              <p className="text-amber-700 dark:text-amber-400/80 font-medium text-sm">
                Your request for the <span className="font-bold">{latestPayment.plan_requested}</span> plan is being reviewed.
              </p>
            </div>
          </div>
          <Badge className="bg-amber-500 text-white px-5 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest border-none shadow-md">Pending Admin</Badge>
        </div>
      )}

      {/* Rejection Banner: ONLY shown if status is 'rejected' */}
      {latestPayment?.status === 'rejected' && (
        <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-rose-100 dark:bg-rose-800/40 p-3 rounded-2xl">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest">Payment Rejected</p>
              <p className="text-rose-700 dark:text-rose-400/80 font-medium text-sm">
                Transaction ID <span className="font-mono bg-rose-100 dark:bg-rose-900 px-1 rounded">{latestPayment.transaction_id}</span> could not be verified.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => window.open('https://wa.me/923106960468', '_blank')}>
              Contact Support
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 px-8 font-bold" onClick={handleClearRejection}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={`p-8 rounded-[3rem] border-none shadow-2xl dark:shadow-none flex flex-col transition-all duration-300 hover:scale-[1.02] ${
              plan.highlight 
                ? 'bg-slate-900 dark:bg-indigo-950 text-white ring-4 ring-indigo-500/20' 
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
            }`}
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                {clinic?.plan === plan.name && <Badge className="bg-emerald-500 text-white border-none rounded-full px-3 py-1 font-black uppercase text-[10px]">Current</Badge>}
              </div>
              <div className="text-4xl font-black mb-2">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <p className={`text-sm opacity-70 ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{plan.description}</p>
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
              disabled={clinic?.plan === plan.name || plan.name === 'Free' || latestPayment?.status === 'pending'} 
              onClick={() => handleUpgrade(plan)}
              className={`w-full h-14 rounded-2xl font-black text-base shadow-lg transition-all active:scale-[0.98] ${
                plan.highlight 
                  ? 'bg-white text-slate-900 hover:bg-slate-50' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
              }`}
            >
              {clinic?.plan === plan.name ? 'Plan Active' : latestPayment?.status === 'pending' ? 'Verification Pending' : `Upgrade to ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm">
          <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure manual payments</h4>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
            Submit your transaction ID for verification. Once approved, your clinic limits will be updated immediately. 
            Verification typically takes less than 24 hours.
          </p>
        </div>
      </div>

      {selectedPlan && <PaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} plan={selectedPlan} clinicId={clinic?.id} />}
    </div>
  );
};

export default ClinicBilling;