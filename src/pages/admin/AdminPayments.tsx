"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, XCircle, Landmark, CreditCard, Smartphone, Loader2, AlertTriangle
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
  
  const [confirmApprove, setConfirmApprove] = useState<any | null>(null);
  const [confirmReject, setConfirmReject] = useState<any | null>(null);

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

  useEffect(() => { fetchPayments(); }, []);

  const handleApprove = async () => {
    const payment = confirmApprove;
    if (!payment) return;
    
    setProcessingId(payment.id);
    setConfirmApprove(null);
    
    try {
      // 1. Determine plan limits
      let limit = 50;
      if (payment.plan_requested === 'Basic') limit = 200;
      if (payment.plan_requested === 'Pro') limit = 2147483647;

      // 2. Update Clinic Table
      const { error: clinicError } = await supabase
        .from('clinics')
        .update({
          plan: payment.plan_requested,
          patient_limit: limit,
          subscription_status: 'active'
        })
        .eq('id', payment.clinic_id);

      if (clinicError) {
        console.error("Clinic update error:", clinicError);
        throw new Error("Could not update clinic plan. Check RLS policies.");
      }

      // 3. Update Payment Status
      const { error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'approved' })
        .eq('id', payment.id);

      if (paymentError) {
        console.error("Payment status error:", paymentError);
        throw new Error("Clinic plan updated, but payment status failed to sync.");
      }

      toast.success(`Plan upgraded to ${payment.plan_requested}!`);
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

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Payment Manager</h1>
          <p className="text-slate-500 font-medium mt-1">Directly control clinic plan activations</p>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/20 overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Clinic</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Requested Plan</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Transaction ID</TableHead>
                <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id} className="border-b border-slate-50">
                  <TableCell className="px-8 py-6 font-bold">{p.clinics?.name}</TableCell>
                  <TableCell className="px-4 py-6">
                    <Badge className={p.plan_requested === 'Pro' ? 'bg-indigo-600' : 'bg-slate-900'}>
                      {p.plan_requested}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-6 font-mono text-xs">{p.transaction_id}</TableCell>
                  <TableCell className="px-4 py-6">
                    <Badge variant="outline" className={
                      p.status === 'pending' ? 'text-amber-500 border-amber-200' : 
                      p.status === 'approved' ? 'text-emerald-500 border-emerald-200' : 'text-rose-500 border-rose-200'
                    }>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    {p.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setConfirmReject(p)} className="text-rose-500">
                          <XCircle className="w-5 h-5" />
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold" onClick={() => setConfirmApprove(p)}>
                          Approve
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AlertDialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Plan Upgrade?</AlertDialogTitle>
            <AlertDialogDescription>
              This will upgrade <strong>{confirmApprove?.clinics?.name}</strong> to the <strong>{confirmApprove?.plan_requested}</strong> plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-emerald-600">Approve Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              The user will see a rejection message and can resubmit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-rose-600">Confirm Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;