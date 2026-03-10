"use client";

import React, { useEffect, useState } from 'react';
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
      // Direct invocation of the Edge Function
      const { data, error } = await supabase.functions.invoke('verify-admin-pin', {
        body: { pin: pinValue }
      });

      if (error) throw error;

      if (data && data.authorized) {
        setIsAuthorized(true);
        toast.success("Identity Verified", {
          description: "Administrative access granted."
        });
      } else {
        throw new Error("Invalid protocol code");
      }
    } catch (err: any) {
      toast.error("Security Alert", {
        description: "Invalid protocol code. Attempt logged."
      });
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

  const TerminalWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={cn(
      "min-h-screen transition-colors duration-500 overflow-x-hidden",
      terminalTheme === 'dark' ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      <style>{`
        .terminal-scoped {
          ${terminalTheme === 'light' ? `
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 222.2 47.4% 11.2%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 222.2 84% 4.9%;
          ` : `
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 210 40% 98%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 212.7 26.8% 83.9%;
          `}
        }
      `}</style>
      <div className="terminal-scoped">
        {children}
      </div>
    </div>
  );

  if (isAuthenticated === false) {
    return (
      <TerminalWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl max-w-sm">
            <UserX className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-black mb-2 tracking-tight">Auth Required</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">You must be logged in as an administrator to access this terminal.</p>
            <Button onClick={() => navigate('/admin/login')} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white">Go to Login</Button>
          </div>
        </div>
      </TerminalWrapper>
    );
  }

  if (isAuthenticated === null) return null;

  if (!isAuthorized) {
    return (
      <TerminalWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="absolute top-8 right-8">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/5">
              {terminalTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </Button>
          </div>
          
          <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl flex items-center justify-center relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isVerifying ? <Loader2 className="w-10 h-10 text-white animate-spin" /> : <Lock className="w-10 h-10 text-white" />}
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tighter">Terminal Lock</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Enter the protocol code to unlock management.</p>
              </div>
            </div>
            
            <form onSubmit={handleVerify} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="Enter 6-digit code" 
                  value={pinValue}
                  onChange={(e) => setPinValue(e.target.value)}
                  className="h-14 rounded-2xl text-center text-2xl font-black tracking-[0.5em] bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-indigo-500/20"
                  autoFocus
                  maxLength={6}
                />
              </div>
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
              Secure Protocol Active
            </div>
          </div>
        </div>
      </TerminalWrapper>
    );
  }

  return (
    <TerminalWrapper>
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-10 selection:bg-indigo-500/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Admin Terminal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Payment Manager</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Directly control clinic plan activations</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl w-12 h-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {terminalTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </Button>
            <Button onClick={fetchPayments} variant="outline" className="rounded-xl h-12 px-6 font-bold flex-1 md:flex-none border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Loader2 className={loading ? "animate-spin w-4 h-4 mr-2" : "hidden"} />
              Refresh Requests
            </Button>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-800">
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
                    <TableRow key={p.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <TableCell className="px-8 py-6">
                        <p className="font-bold">{p.clinics?.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 truncate max-w-[150px] font-mono uppercase">{p.clinic_id}</p>
                      </TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge className={`rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider border-none ${
                          p.plan_requested === 'Pro' ? 'bg-indigo-600 text-white' : 
                          p.plan_requested === 'Basic' ? 'bg-slate-700 dark:bg-slate-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {p.plan_requested}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-6 font-mono text-xs text-slate-500 dark:text-slate-400">{p.transaction_id}</TableCell>
                      <TableCell className="px-4 py-6">
                        <Badge variant="outline" className={`rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider ${
                          p.status === 'pending' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
                          p.status === 'approved' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-500 border-rose-500/20 bg-rose-500/5'
                        }`}>
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
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
                          <CheckCircle2 className="w-8 h-8 text-slate-200 dark:text-slate-800" />
                        </div>
                        No pending requests
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <AlertDialog open={!!confirmApprove} onOpenChange={() => setConfirmApprove(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Approve Plan Upgrade?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500 dark:text-slate-400">
              This will activate the <span className="text-indigo-600 font-bold">{confirmApprove?.plan_requested}</span> plan for <strong>{confirmApprove?.clinics?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-transparent font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">Confirm Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!confirmReject} onOpenChange={() => setConfirmReject(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight text-rose-600">Reject Payment?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500 dark:text-slate-400">
              The user will see a rejection message and can resubmit with a correct TID.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-xl h-12 border-slate-200 dark:border-slate-800 bg-transparent font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="rounded-xl h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8">Confirm Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TerminalWrapper>
  );
};

export default AdminPayments;