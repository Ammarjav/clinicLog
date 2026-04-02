"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Landmark, RefreshCw, Loader2, XCircle, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PaymentModal from '@/components/billing/PaymentModal';
import PlanCard from '@/components/billing/PlanCard';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from 'framer-motion';
import { getClinicStatus } from '@/utils/statusUtils';

const PLANS = [
  { 
    name: '10-Day Trial', 
    price: '0', 
    description: 'Experience every feature unrestricted.', 
    features: ['Unrestricted Pro access', 'All Premium Analytics', 'Recovery Monitoring System'], 
    limit: 2147483647 
  },
  { 
    name: 'Basic', 
    price: '5', 
    description: 'Grow your clinic with confidence.', 
    features: ['Up to 200 patients', 'Advanced Clinical Analytics', 'Professional PDF reports'], 
    limit: 200, 
    highlight: true 
  },
  { 
    name: 'Pro', 
    price: '7', 
    description: 'Unlimited power for high-volume clinics.', 
    features: ['Unlimited patients', 'Advanced Financial Analytics', 'Follow-up Reminder System', 'Excel data exports'], 
    limit: 2147483647 
  }
];

const ClinicBilling = () => {
  const isMobile = useIsMobile();
  const [clinic, setClinic] = useState<any>(null);
  const [latestPayment, setLatestPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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

  const isPending = latestPayment?.status === 'pending';
  const { status, daysLeft } = getClinicStatus(clinic);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-left w-full">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Subscription</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your plan and limits</p>
        </div>
        <Button variant="outline" onClick={() => fetchData(true)} disabled={isRefreshing} className="rounded-xl font-bold h-12 px-6 w-full md:w-auto">
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sync Billing
        </Button>
      </div>

      {isPending && (
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-800/40 p-3 rounded-2xl">
              <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">Verification Pending</p>
              <p className="text-amber-700 dark:text-amber-400/80 font-medium text-sm">Reviewing your request for {latestPayment.plan_requested}.</p>
            </div>
          </div>
          <Badge className="bg-amber-500 text-white px-5 py-2 rounded-xl font-bold uppercase text-[10px] tracking-widest border-none">Pending Admin</Badge>
        </div>
      )}

      {latestPayment?.status === 'rejected' && (
        <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-rose-100 dark:bg-rose-800/40 p-3 rounded-2xl">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-800 dark:text-rose-300 uppercase tracking-widest">Payment Rejected</p>
              <p className="text-rose-700 dark:text-rose-400/80 font-medium text-sm">Transaction ID {latestPayment.transaction_id} not verified.</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none rounded-xl h-12 px-6 font-bold border-rose-200" onClick={() => window.open('https://wa.me/923106960468', '_blank')}>Support</Button>
            <Button className="flex-1 md:flex-none bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 px-8 font-bold" onClick={handleClearRejection}>Retry</Button>
          </div>
        </div>
      )}

      <div className="relative py-4">
        {isMobile ? (
          <Carousel 
            setApi={setApi}
            className="w-full" 
            opts={{ align: "center", loop: false }}
          >
            <CarouselContent className="-ml-0 items-center">
              {PLANS.map((plan, index) => {
                const isSelected = current === index;
                return (
                  <CarouselItem key={plan.name} className="pl-0 basis-[85%] px-2">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isSelected ? 1 : 0.85,
                        opacity: isSelected ? 1 : 0.6,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="h-full"
                    >
                      <PlanCard 
                        plan={plan} 
                        currentPlan={clinic?.plan} 
                        isPending={isPending} 
                        onUpgrade={handleUpgrade} 
                        daysLeft={daysLeft}
                        isExpired={status === 'expired'}
                      />
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            <div className="flex justify-center gap-2 mt-8">
              {PLANS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === i ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <PlanCard 
                key={plan.name} 
                plan={plan} 
                currentPlan={clinic?.plan} 
                isPending={isPending} 
                onUpgrade={handleUpgrade} 
                daysLeft={daysLeft}
                isExpired={status === 'expired'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm">
          <ShieldCheck className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure manual payments</h4>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
            Submit your transaction ID for verification. Approved upgrades update your clinic limits within 24 hours.
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