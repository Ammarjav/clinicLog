"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/Logo';

const signupSchema = z.object({
  clinicName: z.string().min(2, "Clinic name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-sm group focus:outline-none z-50"
      >
        <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white dark:bg-slate-900 shadow-md md:shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:border-indigo-100 dark:group-hover:border-indigo-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
          <ArrowLeft size={20} className="md:w-4 md:h-4" />
        </div>
        <span className="hidden md:block">Back to Home</span>
      </Link>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-10 text-center">
          <Logo className="w-14 h-14 mb-6" />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Get Started</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create your clinic's digital hub</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Clinic Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                        <Input placeholder="General Hospital" className="h-14 rounded-2xl pl-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-indigo-500/20 dark:text-white transition-all text-base" {...field} />
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
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Admin Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                        <Input placeholder="admin@clinic.com" className="h-14 rounded-2xl pl-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-indigo-500/20 dark:text-white transition-all text-base" {...field} />
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
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secure Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="h-14 rounded-2xl pl-12 pr-12 bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-indigo-500/20 dark:text-white transition-all text-base" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-14 text-base font-bold rounded-2xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white shadow-lg shadow-indigo-100/50 dark:shadow-none transition-all active:scale-[0.98] mt-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Create Clinic Portal"}
              </Button>
              <div className="text-center pt-2">
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                  Already have an account?{' '}
                  <Link to="/admin/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline underline-offset-4">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]">
          DATA ENCRYPTED & HIPAA READY
        </p>
      </div>
    </div>
  );
};

export default Signup;