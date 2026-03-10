"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, XCircle, Landmark, CreditCard, Smartphone, Loader2, AlertTriangle, Lock, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const AdminPayments = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [confirmApprove, setConfirmApprove] = useState<any | null>(null);
  const [confirmReject, setConfirmReject] = useState<any | null>(null);

  // The code you provided
  const MASTER_PIN = "200317";

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, clinics(name, plan)')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("Fetch failed: " + error.message);
    else setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => { 
    if (isAuthorized) {
      fetchPayments(); 
    }
  }, [isAuthorized]);

  const handlePinComplete = (value: string) => {
    if (value === MASTER_PIN) {
      setIsAuthorized(true);
      toast.success("Access Granted", {
        description: "Payment Management Portal Unlocked."
      });
    } else {
      toast.error("Invalid Protocol Code", {
        description: "Verification failed. Please try again."
      });
      setPinValue("");
    }
  };

  const handleApprove = async () => {
    const payment = confirmApprove;
    if (!payment) return;
    
    setProcessingId(payment.id);
    setConfirmApprove(null);
    
    try {
      let limit = 50;
      if (payment.plan_requested === 'Basic') limit = 200;
      if (payment.plan_requested === 'Pro') limit = 2147483647;

      const { error: clinicError } = await supabase
        .from('clinics')
        .update({
          plan: payment.plan_requested,
          patient_limit: limit,
          subscription_status: 'active'
        })
        .eq('id', payment.clinic_id);

      if (clinicError) throw new Error("Clinic update failed: " + clinicError.message);

      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (paymentError) throw new Error("Payment status update failed: " + paymentError.message);

      toast.success(`Clinic ${payment.clinics.name} upgraded to ${payment.plan_requested}!`);
      await fetchPayments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    const payment = confirmReject;
    if (!payment) return;
    
    setProcessingId(payment.id);
    setConfirmReject(null);
    
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'rejected' })
        .eq('id', payment.id);
      
      if (error) throw error;
      
      toast.success("Payment rejected");
      await fetchPayments();
    } catch (err: any) {
      toast.error("Rejection failed: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200 dark:shadow-none flex items-center justify-center relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Restricted Access</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Enter the 6-digit administrative protocol code to proceed.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-none flex flex-col items-center">
            <InputOTP 
              maxLength={6} 
              value={pinValue}
              onChange={setPinValue}
              onComplete={handlePinComplete}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
                <InputOTPSlot index={1} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
                <InputOTPSlot index={2} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
                <InputOTPSlot index={3} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
                <InputOTPSlot index={4} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
                <InputOTPSlot index={5} className="w-12 h-14 rounded-xl border-slate-200 dark:border-slate-800 text-xl font-bold" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" />
            Secure Protocol Active
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Payment Manager</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Directly control clinic plan activations</p>
          </div>
          <Button onClick={fetchPayments} variant="outline" className="rounded-xl h-12 px-6 font-bold w-full md:w-auto">Refresh Requests</Button>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/20 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-none">
                  <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Clinic</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Requested Plan</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Transaction ID</TableHead>
                  <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Status</TableHead>
                  <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((p) => (
                    <TableRow key={p.id} className="border-b border-slate-50 dark:border-slate-800">
                      <TableCell className="px-8 py-6">
                        <p className="font-bold text-slate-900 dark:text-white">{p.clinics?.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{p.clinic_id}</p>
                      </TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge className={p.plan_requested === 'Pro' ? 'bg-indigo-600' : 'bg-slate-900 dark:bg-slate-800'}>
                          {p.plan_requested}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-6 font-mono text-xs dark:text-slate-300">{p.transaction_id}</TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge variant="outline" className={
                          p.status === 'pending' ? 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-900/10' : 
                          p.status === 'approved' ? 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10' : 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-900/10'
                        }>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        {p.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setConfirmReject(p)} 
                              className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                              disabled={!!processingId}
                            >
                              <XCircle className="w-5 h-5" />
                            </Button>
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-10" 
                              onClick={() => setConfirmApprove(p)}
                              disabled={!!processingId}
                            >
                              {processingId === p.id ? <Loader2 className="animate-spin w-4 h-4" /> : "Approve"}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-slate-300 dark:text-slate-700 tracking-widest pr-4">Processed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                      No pending requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <AlertDialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Approve Plan Upgrade?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500 dark:text-slate-400">
              This will activate the <span className="text-indigo-600 font-bold">{confirmApprove?.plan_requested}</span> plan for <strong>{confirmApprove?.clinics?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-100 dark:border-slate-800 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Confirm Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reject Payment?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500 dark:text-slate-400">
              The user will see a rejection message and can resubmit with a correct TID.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-100 dark:border-slate-800 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="rounded-xl h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold">Confirm Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;