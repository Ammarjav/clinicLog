"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, ShieldCheck, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";

const PLANS = [
  { 
    name: '10-Day Trial', 
    price: '0', 
    icon: Zap,
    description: 'Experience the full power of ClinicLog with zero restrictions.', 
    features: ['Unrestricted Pro Access', 'Automated Follow-ups', 'Advanced Analytics', 'Professional Exports'], 
    color: 'indigo'
  },
  { 
    name: 'Basic', 
    price: '5', 
    icon: ShieldCheck,
    description: 'Advanced documentation tools for growing private clinics.', 
    features: ['Up to 200 Patients', 'Advanced Clinical Analytics', 'PDF Report Exports', 'Secure RLS Storage'], 
    highlight: true,
    color: 'emerald'
  },
  { 
    name: 'Pro', 
    price: '7', 
    icon: Crown,
    description: 'Unrestricted power for high-volume medical centers.', 
    features: ['Unlimited Patients', 'Advanced Financial Analytics', 'Follow-up Reminder System', 'Excel Data Exports'], 
    color: 'indigo'
  }
];

const PricingSection = () => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section id="pricing" className="py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16 md:mb-20">
        <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Investment in Quality</h2>
        <p className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
          Plans for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">practice scale.</span>
        </p>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
          Choose a protocol that matches your clinic's volume. No hidden fees, just pure clinical efficiency.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {isMobile ? (
          <div className="relative">
            <Carousel 
              setApi={setApi}
              className="w-full py-10" 
              opts={{ align: "center", loop: false }}
            >
              <CarouselContent className="-ml-0 items-stretch">
                {PLANS.map((plan, index) => {
                  const isSelected = current === index;
                  return (
                    <CarouselItem key={plan.name} className="pl-0 basis-[85%] px-2">
                      <motion.div
                        animate={{
                          scale: isSelected ? 1 : 0.9,
                          opacity: isSelected ? 1 : 0.5,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-full"
                      >
                        <PricingCard plan={plan} />
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
            
            <div className="flex justify-center gap-2 mt-4">
              {PLANS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === i ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <PricingCard plan={plan} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const PricingCard = ({ plan }: { plan: any }) => (
  <div
    className={`flex flex-col p-8 md:p-10 rounded-[3rem] h-full transition-all duration-500 relative ${
      plan.highlight 
        ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-500/20 ring-4 ring-indigo-500/10 z-10' 
        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-100/10 dark:shadow-none'
    }`}
  >
    {plan.highlight && (
      <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-6 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest border-none whitespace-nowrap shadow-xl">
        Practitioner's Choice
      </Badge>
    )}

    <div className="mb-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
        plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
      }`}>
        <plan.icon size={28} />
      </div>
      <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-5xl font-black">${plan.price}</span>
        {plan.price !== '0' && (
          <span className={plan.highlight ? 'text-slate-400' : 'text-slate-50'}>/mo</span>
        )}
      </div>
      <p className={`text-sm font-medium leading-relaxed ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
        {plan.description}
      </p>
    </div>

    <div className="space-y-4 mb-10 flex-1">
      {plan.features.map((feature: string) => (
        <div key={feature} className="flex items-center gap-3">
          <div className={`p-1 rounded-full ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
            <Check size={14} className="stroke-[4]" />
          </div>
          <span className="text-sm font-bold opacity-90">{feature}</span>
        </div>
      ))}
    </div>

    <Button asChild className={`w-full h-14 rounded-2xl font-black text-base transition-all active:scale-[0.98] ${
      plan.highlight 
        ? 'bg-white text-slate-900 hover:bg-slate-50' 
        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
    }`}>
      <Link to="/admin/signup">
        {plan.price === '0' ? 'Start Free Trial' : 'Get Started'} <ArrowRight className="ml-2 w-4 h-4" />
      </Link>
    </Button>
  </div>
);

export default PricingSection;