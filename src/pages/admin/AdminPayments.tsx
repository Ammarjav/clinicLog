"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, XCircle, Landmark, CreditCard, Smartphone, Loader2, AlertTriangle, Lock, ShieldCheck, UserX, Sun, Moon, ArrowRight
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
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminPayments = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [terminalTheme, setTerminalTheme] = useState<'light' | 'dark'>('dark');
  
  const [confirmApprove, setConfirmApprove] = useState<any | null>(null);
  const [confirmReject, setConfirmReject] = useState<any | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkUser();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, clinics(name, plan)')
      .order('created_at', { ascending: false });
    
    if (error) toast.error("Database access denied: " + error.message);
    else setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => { 
    if (isAuthorized && isAuthenticated) {
      fetchPayments(); 
    }
  }, [isAuthorized, isAuthenticated]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinValue.length < 4) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-pin', {
        body: { pin: pinValue }
      });

      if (error) throw error;

      if (data && data.authorized) {
        setIsAuthorized(true);
        toast.success("Identity Verified");
      } else {
        throw new Error("Invalid protocol code");
      }
    } catch (err: any) {
      toast.error("Invalid protocol code");
      setPinValue("");
    } finally {
      setIsVerifying(false);
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
      const { error: clinicError } = await supabase.from('clinics').update({ plan: payment.plan_requested, patient_limit: limit, subscription_status: 'active' }).eq('id', payment.clinic_id);
      if (clinicError) throw clinicError;
      const { error: paymentError } = await supabase.from('payments').update({ status: 'approved' }).eq('id', payment.id);
      if (paymentError) throw paymentError;
      toast.success("Clinic plan updated successfully");
      await fetchPayments();
    } catch (err: any) {
      toast.error("Operation failed: " + err.message);
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
      const { error } = await supabase.from('payments').update({ status: 'rejected' }).eq('id', payment.id);
      if (error) throw error;
      toast.success("Payment request rejected");
      await fetchPayments();
    } catch (err: any) {
      toast.error("Operation failed");
    } finally {
      setProcessingId(null);
    }
  };

  const toggleTheme = () => {
    setTerminalTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Content for when user is not logged in
  if (isAuthenticated === false) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-300",
        terminalTheme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      )}>
        <div className={cn(
          "border p-10 rounded-[2.5rem] shadow-2xl max-w-sm",
          terminalTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        )}>
          <UserX className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2 tracking-tight">Auth Required</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">Login as admin to access this terminal.</p>
          <Button onClick={() => navigate('/admin/login')} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white">Go to Login</Button>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) return null;

  // PIN entry screen
  if (!isAuthorized) {
    return (
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-300",
        terminalTheme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      )}>
        <div className="absolute top-8 right-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleTheme} 
            className={cn(
              "rounded-full w-12 h-12 border transition-all",
              terminalTheme === 'dark' ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-slate-600"
            )}
          >
            {terminalTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
        
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl flex items-center justify-center">
              {isVerifying ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : <Lock className="w-10 h-10 text-white" />}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter">Terminal Lock</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Enter the protocol code to unlock.</p>
            </div>
          </div>
          
          <form onSubmit={handleVerify} className={cn(
            "p-8 rounded-[2.5rem] border shadow-xl space-y-4",
            terminalTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          )}>
            <Input 
              type="password" 
              placeholder="Enter pin" 
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value)}
              className={cn(
                "h-14 rounded-2xl text-center text-lg font-medium border-none shadow-inner",
                terminalTheme === 'dark' ? "bg-slate-800 text-white placeholder:text-slate-500" : "bg-slate-100 text-slate-900 placeholder:text-slate-400"
              )}
              autoFocus
              maxLength={8}
            />
            <Button 
              type="submit" 
              disabled={isVerifying || pinValue.length < 4}
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-500/20"
            >
              {isVerifying ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <span className="flex items-center gap-2">
                  Unlock Portal <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-700 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" />
            Security Protocol Active
          </div>
        </div>
      </div>
    );
  }

  // Authorized Dashboard
  return (
    <div className={cn(
      "min-h-screen p-6 md:p-12 transition-colors duration-300",
      terminalTheme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    )}>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Admin Terminal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Payment Manager</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Directly control clinic plan activations</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme} 
              className={cn(
                "rounded-xl w-12 h-12 border",
                terminalTheme === 'dark' ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-slate-600"
              )}
            >
              {terminalTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={fetchPayments} 
              variant="outline" 
              className={cn(
                "rounded-xl h-12 px-6 font-bold flex-1 md:flex-none border transition-all",
                terminalTheme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              )}
            >
              <Loader2 className={loading ? "animate-spin w-4 h-4 mr-2" : "hidden"} />
              Refresh Requests
            </Button>
          </div>
        </div>

        <Card className={cn(
          "rounded-[2.5rem] border shadow-2xl overflow-hidden",
          terminalTheme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        )}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={cn(
                  "border-none",
                  terminalTheme === 'dark' ? "bg-slate-800/50" : "bg-slate-50"
                )}>
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
                    <TableRow key={p.id} className={cn(
                      "transition-colors",
                      terminalTheme === 'dark' ? "border-slate-800 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50"
                    )}>
                      <TableCell className="px-8 py-6">
                        <p className="font-bold">{p.clinics?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase truncate max-w-[120px]">{p.clinic_id}</p>
                      </TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge className={cn(
                          "rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider border-none",
                          p.plan_requested === 'Pro' ? 'bg-indigo-600 text-white' : 
                          p.plan_requested === 'Basic' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-500'
                        )}>
                          {p.plan_requested}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-6 font-mono text-xs text-slate-400">{p.transaction_id}</TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge variant="outline" className={cn(
                          "rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider",
                          p.status === 'pending' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
                          p.status === 'approved' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-500 border-rose-500/20 bg-rose-500/5'
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
                              onClick={() => setConfirmReject(p)} 
                              className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 rounded-xl transition-all"
                              disabled={!!processingId}
                            >
                              <XCircle className="w-5 h-5" />
                            </Button>
                            <Button 
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-indigo-500/20" 
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
                    <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                      No pending requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Approve Alert */}
      <AlertDialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <AlertDialogContent className={cn(
          "rounded-[2.5rem] p-8 shadow-2xl border transition-colors",
          terminalTheme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"
        )}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Approve Plan Upgrade?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              Activating {confirmApprove?.plan_requested} for {confirmApprove?.clinics?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-transparent font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">Confirm Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Alert */}
      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent className={cn(
          "rounded-[2.5rem] p-8 shadow-2xl border transition-colors",
          terminalTheme === 'dark' ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 text-slate-900"
        )}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-rose-600">Reject Payment?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              The user will need to resubmit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-transparent font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="rounded-xl h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8">Confirm Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;