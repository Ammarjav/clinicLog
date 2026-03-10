"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Info, ShieldCheck, Zap, Star, Landmark, AlertCircle, MessageCircle } from 'lucide-react';
import PaymentModal from '@/components/billing/PaymentModal';
import { toast } from 'sonner';

const PLANS = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for small private practices',
    features: ['Maximum 50 patients', 'Dashboard access', 'Basic analytics'],
    limit: 50,
    trial: false
  },
  {
    name: 'Basic',
    price: '5',
    description: 'Grow your clinic with confidence',
    features: ['Maximum 200 patients', 'Detailed analytics', 'PDF report generation', '7-day free trial'],
    limit: 200,
    trial: true,
    highlight: true
  },
  {
    name: 'Pro',
    price: '7',
    description: 'Unlimited power for high-volume clinics',
    features: ['Unlimited patients', 'Advanced analytics', 'Excel export', 'PDF reports', '7-day free trial'],
    limit: 2147483647,
    trial: true
  }
];

const ClinicBilling = () => {
  const [clinic, setClinic] = useState<any>(null);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClinicData = async () => {
    setLoading(true);
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
        
        // Check for latest non-approved payment
        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('clinic_id', userData.clinic_id)
          .neq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setPendingPayment(paymentData);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClinicData(); }, []);

  const handleUpgrade = (plan: any) => {
    if (plan.name === clinic?.plan) return toast.info("You are already on this plan");
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Choose Your Plan</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
          Scale your clinic with precision tools designed for medical professionals.
        </p>
      </div>

      {pendingPayment && pendingPayment.status === 'pending' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-amber-100 dark:bg-amber-800/40 p-3 rounded-2xl">
              <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">Verification in Progress</p>
              <p className="text-amber-700/80 dark:text-amber-400/80 font-medium text-sm">
                Request for <span className="font-bold">{pendingPayment.plan_requested}</span> via {pendingPayment.payment_method} is pending.
              </p>
            </div>
          </div>
          <Badge className="bg-amber-500 text-white hover:bg-amber-600 rounded-xl px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">Pending Verification</Badge>
        </div>
      )}

      {pendingPayment && pendingPayment.status === 'rejected' && (
        <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-rose-100 dark:bg-rose-800/40 p-3 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest">Payment Rejected</p>
              <p className="text-rose-700/80 dark:text-rose-400/80 font-medium text-sm">
                We couldn't verify your last transaction ({pendingPayment.transaction_id}). Please try again or contact support.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-xl bg-white dark:bg-slate-900 h-10 font-bold text-xs" onClick={() => window.open('https://wa.me/923106960468', '_blank')}>
               <MessageCircle className="w-3.5 h-3.5 mr-2" />
               Support
             </Button>
             <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 h-10 font-bold uppercase tracking-widest text-[10px]" onClick={() => setPendingPayment(null)}>
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
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                {plan.highlight && (
                  <Badge className="bg-indigo-500 text-white border-none rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest">Popular</Badge>
                )}
                {clinic?.plan === plan.name && (
                  <Badge variant="outline" className="border-emerald-400 text-emerald-400 rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest">Current</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black">${plan.price}</span>
                <span className={`text-sm font-bold ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>/month</span>
              </div>
              <p className={`text-sm font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{plan.description}</p>
            </div>

            <div className="space-y-4 flex-1 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'}`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              disabled={clinic?.plan === plan.name || plan.name === 'Free'}
              onClick={() => handleUpgrade(plan)}
              className={`w-full h-14 rounded-2xl font-black text-base transition-all active:scale-[0.98] ${
                plan.highlight 
                  ? 'bg-white text-slate-900 hover:bg-slate-100' 
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
              }`}
            >
              {clinic?.plan === plan.name ? 'Current Plan' : plan.name === 'Free' ? 'Default Access' : `Upgrade to ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm">
          <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure manual payments</h4>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
            All payments are processed manually via JazzCash, Easypaisa, or Direct Bank Transfer. After submitting your transaction ID, our team will verify and activate your trial or full plan within 24 hours.
          </p>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
          plan={selectedPlan} 
          clinicId={clinic?.id}
        />
      )}
    </div>
  );
};

export default ClinicBilling;