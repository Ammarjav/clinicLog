"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ShieldCheck, Landmark, AlertCircle, MessageCircle, RefreshCw, Loader2 } from 'lucide-react';
import PaymentModal from '@/components/billing/PaymentModal';
import { toast } from 'sonner';

const PLANS = [
  { name: 'Free', price: '0', description: 'Perfect for small private practices', features: ['Maximum 50 patients', 'Dashboard access', 'Basic analytics'], limit: 50 },
  { name: 'Basic', price: '5', description: 'Grow your clinic with confidence', features: ['Maximum 200 patients', 'Detailed analytics', 'PDF reports'], limit: 200, highlight: true },
  { name: 'Pro', price: '7', description: 'Unlimited power for high-volume clinics', features: ['Unlimited patients', 'Excel export', 'Advanced analytics'], limit: 2147483647 }
];

const ClinicBilling = () => {
  const [clinic, setClinic] = useState<any>(null);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
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
        
        const { data: paymentData } = await supabase
          .from('payments')
          .select('*')
          .eq('clinic_id', userData.clinic_id)
          .neq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        setPendingPayment(paymentData);
        if (showToast) toast.success("Status updated");
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

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Clinic Subscription</h1>
          <p className="text-slate-500 font-medium">Manage your plan and clinical limits</p>
        </div>
        <Button variant="outline" onClick={() => fetchData(true)} disabled={isRefreshing} className="rounded-xl font-bold">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Check Status
        </Button>
      </div>

      {pendingPayment && pendingPayment.status === 'pending' && (
        <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Landmark className="w-6 h-6 text-amber-600" />
            <div>
              <p className="text-sm font-black text-amber-800 uppercase tracking-widest">Verification in Progress</p>
              <p className="text-amber-700 font-medium text-sm">Waiting for admin to verify TID: {pendingPayment.transaction_id}</p>
            </div>
          </div>
          <Badge className="bg-amber-500 text-white px-4 py-1.5 font-bold uppercase text-[10px]">Pending</Badge>
        </div>
      )}

      {pendingPayment && pendingPayment.status === 'rejected' && (
        <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-rose-600" />
            <p className="text-rose-700 font-medium text-sm">Payment rejected. Please check your transaction ID and try again.</p>
          </div>
          <Button size="sm" className="bg-rose-600 text-white font-bold" onClick={() => setPendingPayment(null)}>Try Again</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={`p-8 rounded-[3rem] border-none shadow-xl flex flex-col ${plan.highlight ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black">{plan.name}</h3>
                {clinic?.plan === plan.name && <Badge className="bg-emerald-500 text-white">Current</Badge>}
              </div>
              <div className="text-4xl font-black mb-2">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></div>
              <p className="text-sm opacity-70">{plan.description}</p>
            </div>
            <div className="space-y-4 flex-1 mb-10">
              {plan.features.map((f, i) => (
                <div key={i} className="flex gap-2 text-sm font-bold"><Check className="w-4 h-4 text-emerald-500" /> {f}</div>
              ))}
            </div>
            <Button 
              disabled={clinic?.plan === plan.name || plan.name === 'Free'} 
              onClick={() => handleUpgrade(plan)}
              className={`w-full h-14 rounded-2xl font-black ${plan.highlight ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {clinic?.plan === plan.name ? 'Active' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>

      {selectedPlan && <PaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} plan={selectedPlan} clinicId={clinic?.id} />}
    </div>
  );
};

export default ClinicBilling;