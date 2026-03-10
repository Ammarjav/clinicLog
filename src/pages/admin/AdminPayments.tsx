"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, XCircle, Clock, Search, 
  ExternalLink, CreditCard, Landmark, Smartphone, Loader2, AlertTriangle
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

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Dialog States
  const [confirmApprove, setConfirmApprove] = useState<any | null>(null);
  const [confirmReject, setConfirmReject] = useState<any | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, clinics(name, plan)')
      .order('created_at', { ascending: false });
    
    if (error) toast.error(error.message);
    else setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

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
          subscription_status: 'active',
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', payment.clinic_id);

      if (clinicError) throw clinicError;

      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (paymentError) throw paymentError;

      toast.success(`Approved ${payment.plan_requested} for ${payment.clinics.name}`);
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    const paymentId = confirmReject?.id;
    if (!paymentId) return;
    
    setProcessingId(paymentId);
    setConfirmReject(null);
    
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: 'rejected' })
        .eq('id', paymentId);
      
      if (error) throw error;
      
      toast.success("Payment rejected");
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getMethodIcon = (method: string) => {
    if (method === 'Bank Transfer') return <Landmark className="w-4 h-4" />;
    if (method === 'Payoneer') return <CreditCard className="w-4 h-4" />;
    return <Smartphone className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Payment Manager</h1>
            <p className="text-slate-500 font-medium mt-1">Verify manual transactions and activate plans</p>
          </div>
          <Button onClick={fetchPayments} variant="outline" className="rounded-xl h-12 px-6 font-bold" disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Refresh List"}
          </Button>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/20 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 border-none">
                <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Clinic</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Plan Requested</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Method & ID</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-40 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></TableCell></TableRow>
              ) : payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No payment requests found</TableCell></TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-50">
                    <TableCell className="px-8 py-6">
                      <p className="font-bold text-slate-900">{p.clinics?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">ID: {p.clinic_id}</p>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      <Badge className={p.plan_requested === 'Pro' ? 'bg-indigo-600' : 'bg-slate-900'}>
                        {p.plan_requested}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      <div className="flex items-center gap-2 mb-1">
                        {getMethodIcon(p.payment_method)}
                        <span className="text-sm font-bold text-slate-700">{p.payment_method}</span>
                      </div>
                      <code className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-indigo-600 font-bold">{p.transaction_id}</code>
                    </TableCell>
                    <TableCell className="px-4 py-6">
                      <Badge variant="outline" className={cn(
                        "rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest shadow-none",
                        p.status === 'pending' ? 'border-amber-400 text-amber-500' : 
                        p.status === 'approved' ? 'border-emerald-400 text-emerald-500 bg-emerald-50' : 'border-rose-400 text-rose-500 bg-rose-50'
                      )}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      {p.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl text-rose-500 hover:bg-rose-50 h-10 w-10"
                            onClick={() => setConfirmReject(p)}
                            disabled={!!processingId}
                          >
                            {processingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-5 h-5" />}
                          </Button>
                          <Button 
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-10 px-4 font-bold shadow-sm"
                            onClick={() => setConfirmApprove(p)}
                            disabled={!!processingId}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                           <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300">
                             <CheckCircle2 className="w-3 h-3" />
                             Verified
                           </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-slate-900">Confirm Activation</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              You are about to activate the <span className="text-indigo-600 font-bold">{confirmApprove?.plan_requested}</span> plan for <span className="text-slate-900 font-bold">{confirmApprove?.clinics?.name}</span>. This will update their patient limits immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-100 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Yes, Approve Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-slate-900">Reject Payment?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              Are you sure you want to reject this payment request from <span className="text-slate-900 font-bold">{confirmReject?.clinics?.name}</span>? The user will be notified to try again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-100 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="rounded-xl h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold">
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default AdminPayments;