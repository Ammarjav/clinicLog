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
import { Loader2, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
      
      // Fetch clinic slug for redirect if possible
      const { data: userData } = await supabase
        .from('users')
        .select('clinics(slug)')
        .eq('id', data.user.id)
        .single();

      toast.success("Welcome back");
      
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2">Sign in to manage patient reports</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-50/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@clinic.com" className="h-12 rounded-xl" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold rounded-xl bg-blue-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Don't have a clinic account?{' '}
                  <Link to="/admin/signup" className="text-blue-600 font-bold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;