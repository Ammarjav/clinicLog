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
import { Loader2, ArrowLeft, Building2 } from 'lucide-react';
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
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("rate limit")) {
          toast.error("Security limit reached. Please wait 10 minutes or try a different email address.");
          return;
        }
        throw authError;
      }
      
      if (!authData.user) throw new Error("Signup failed");

      const userId = authData.user.id;
      const slug = generateSlug(values.clinicName);

      // 2. Create the clinic record
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

      // 3. Associate user with clinic
      const { error: userTableError } = await supabase
        .from('users')
        .insert({
          id: userId,
          clinic_id: clinicData.id,
          role: 'admin'
        });

      if (userTableError) throw userTableError;

      if (!authData.session) {
        toast.info("Registration successful! Please verify your email or wait a few minutes before logging in.");
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-blue-600 transition-colors">
        <ArrowLeft size={24} />
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-500 mt-2 text-center">Create your clinic account today</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="clinicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="General Hospital" className="h-12 rounded-xl pl-10" {...field} />
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
                    <FormLabel>Admin Email</FormLabel>
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
                {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Create Clinic Account"}
              </Button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Already have an account? <Link to="/admin/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;