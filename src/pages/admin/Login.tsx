"use client";

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Lock, Mail } from 'lucide-react';
import Logo from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword(values);
      if (error) throw error;
      
      const { data: userData } = await supabase
        .from('users')
        .select('clinics(slug)')
        .eq('id', data.user.id)
        .single();

      toast.success("Welcome back to ClinicLog");
      
      if (userData?.clinics?.slug) {
        navigate(`/clinic/${userData.clinics.slug}/dashboard`);
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[80px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm group focus:outline-none z-50"
      >
        <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white shadow-md md:shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50">
          <ArrowLeft size={20} className="md:w-4 md:h-4" />
        </div>
        <span className="hidden md:block">Back to Home</span>
      </Link>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-10 text-center">
          <Logo className="w-14 h-14 mb-6" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Access your clinical portal</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="dr.smith@clinic.com" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-indigo-500/20 transition-all text-base" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input type="password" placeholder="••••••••" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-indigo-500/20 transition-all text-base" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold rounded-2xl bg-slate-900 hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In to Portal"}
              </Button>

              <div className="text-center pt-2">
                <p className="text-sm text-slate-400 font-medium">
                  Don't have a clinic account?{' '}
                  <Link to="/admin/signup" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                    Register Now
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          SECURE CLINICAL LOGGING PROTOCOL
        </p>
      </div>
    </div>
  );
};

export default Login;