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
import { Loader2, ArrowLeft, Building2, Mail, Lock } from 'lucide-react';
import Logo from '@/components/Logo';

const signupSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { clinicName: '', email: '', password: '' },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  };

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("rate limit")) {
          toast.error("Security limit reached. Please wait 10 minutes.");
          return;
        }
        throw authError;
      }
      
      if (!authData.user) throw new Error("Signup failed");

      const userId = authData.user.id;
      const slug = generateSlug(values.clinicName);

      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: values.clinicName,
          slug: slug,
          owner_id: userId
        })
        .select()
        .single();

      if (clinicError) throw clinicError;

      const { error: userTableError } = await supabase
        .from('users')
        .insert({
          id: userId,
          clinic_id: clinicData.id,
          role: 'admin'
        });

      if (userTableError) throw userTableError;

      if (!authData.session) {
        toast.info("Registration successful! Please verify your email.");
        navigate('/admin/login');
      } else {
        toast.success("Clinic registered successfully!");
        navigate(`/clinic/${slug}/dashboard`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[80px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-sm group focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50">
          <ArrowLeft size={16} />
        </div>
        Back to Home
      </Link>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-10 text-center">
          <Logo className="w-14 h-14 mb-6" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Get Started</h1>
          <p className="text-slate-500 mt-2 font-medium">Create your clinic's digital hub</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-indigo-100/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Clinic Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="General Hospital" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-indigo-500/20 transition-all text-base" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Admin Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input placeholder="admin@clinic.com" className="h-14 rounded-2xl pl-12 bg-slate-50/50 border-slate-100 focus:bg-white focus:ring-indigo-500/20 transition-all text-base" {...field} />
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
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Secure Password</FormLabel>
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
                className="w-full h-14 text-base font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100/50 transition-all active:scale-[0.98] mt-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Create Clinic Portal"}
              </Button>
              <div className="text-center pt-2">
                <p className="text-sm text-slate-400 font-medium">
                  Already have an account?{' '}
                  <Link to="/admin/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          DATA ENCRYPTED & HIPAA READY
        </p>
      </div>
    </div>
  );
};

export default Signup;