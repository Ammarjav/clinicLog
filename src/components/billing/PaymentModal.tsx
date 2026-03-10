"use client";

import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  CreditCard, Smartphone, Banknote, Landmark, 
  ChevronRight, Copy, CheckCircle2, Loader2, Info
} from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
  clinicId: string;
}

const PAYMENT_METHODS = [
  { 
    id: 'jazzcash', 
    name: 'JazzCash', 
    icon: Smartphone, 
    color: 'bg-red-50 text-red-600',
    details: 'Send PKR equivalent of ${price} to:\n03001234567\nAccount Name: Clinic SaaS'
  },
  { 
    id: 'easypaisa', 
    name: 'Easypaisa', 
    icon: Smartphone, 
    color: 'bg-emerald-50 text-emerald-600',
    details: 'Send PKR equivalent to:\n03451234567\nAccount Name: Clinic SaaS'
  },
  { 
    id: 'bank', 
    name: 'Bank Transfer', 
    icon: Landmark, 
    color: 'bg-blue-50 text-blue-600',
    details: 'Bank: HBL\nTitle: Clinic SaaS Solutions\nNumber: 12345678901234'
  },
  { 
    id: 'payoneer', 
    name: 'Payoneer', 
    icon: CreditCard, 
    color: 'bg-orange-50 text-orange-600',
    details: 'Send USD to:\nbilling@clinicsaas.com'
  }
];

const PaymentModal = ({ open, onOpenChange, plan, clinicId }: PaymentModalProps) => {
  const [step, setStep] = useState<'method' | 'instructions' | 'submit' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectMethod = (method: any) => {
    setSelectedMethod(method);
    setStep('instructions');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return toast.error("Transaction ID is required");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('payments').insert([{
        clinic_id: clinicId,
        plan_requested: plan.name,
        payment_method: selectedMethod.name,
        transaction_id: transactionId,
        status: 'pending'
      }]);

      if (error) throw error;
      setStep('success');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Details copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setTimeout(() => {
          setStep('method');
          setSelectedMethod(null);
          setTransactionId('');
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl dark:bg-slate-900 p-0 overflow-hidden">
        {step === 'method' && (
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Choose Payment Method</DialogTitle>
              <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                Select your preferred way to pay for the <span className="text-indigo-600 font-bold">{plan.name}</span> plan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelectMethod(method)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${method.color} dark:bg-opacity-10`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{method.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'instructions' && selectedMethod && (
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{selectedMethod.name} Instructions</DialogTitle>
              <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                Follow these steps to complete your manual payment.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 relative group">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 dark:text-slate-300">
                {selectedMethod.details.replace('${price}', plan.price)}
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(selectedMethod.details.replace('${price}', plan.price))}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setStep('method')}>Back</Button>
              <Button className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700" onClick={() => setStep('submit')}>I have paid</Button>
            </div>
          </div>
        )}

        {step === 'submit' && selectedMethod && (
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Submit Payment</DialogTitle>
              <DialogDescription className="font-medium text-slate-500 dark:text-slate-400">
                Enter your transaction details for verification.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase text-slate-400">Transaction ID</Label>
                <Input 
                  required
                  placeholder="Enter TID or Reference Number" 
                  className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex gap-3">
                <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400 leading-relaxed">
                  Verification usually takes up to 24 hours. Your 7-day trial will start once approved.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setStep('instructions')}>Back</Button>
                <Button type="submit" className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Proof"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Request Submitted</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                Your payment request has been submitted. Verification may take up to 24 hours.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100 dark:border-amber-900/30">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Pending Verification</span>
            </div>
            <Button className="w-full rounded-2xl h-14 font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900" onClick={() => onOpenChange(false)}>
              Got it
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;