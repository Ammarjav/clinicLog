"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, XCircle, Clock, Search, 
  ExternalLink, CreditCard, Landmark, Smartphone, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleApprove = async (payment: any) => {
    setProcessingId(payment.id);
    try {
      // 1. Determine plan limits
      let limit = 50;
      if (payment.plan_requested === 'Basic') limit = 200;
      if (payment.plan_requested === 'Pro') limit = 2147483647; // Unlimited

      // 2. Update Clinic Plan & Limits
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

      // 3. Mark Payment as Approved
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

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('payments')
      .update({ status: 'rejected' })
      .eq('id', id);
    
    if (error) toast.error(error.message);
    else {
      toast.success("Payment rejected");
      fetchPayments();
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
          <Button onClick={fetchPayments} variant="outline" className="rounded-xl">
            Refresh List
          </Button>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/20 overflow-hidden">
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
              {loading ? (
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
                        "rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest",
                        p.status === 'pending' ? 'border-amber-400 text-amber-500' : 
                        p.status === 'approved' ? 'border-emerald-400 text-emerald-500' : 'border-rose-400 text-rose-500'
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
                            className="rounded-xl text-rose-500 hover:bg-rose-50"
                            onClick={() => handleReject(p.id)}
                            disabled={!!processingId}
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                          <Button 
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-10 px-4 font-bold"
                            onClick={() => handleApprove(p)}
                            disabled={!!processingId}
                          >
                            {processingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300 uppercase italic">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default AdminPayments;