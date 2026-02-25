"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';
import DiagnosisInput from './DiagnosisInput';

const formSchema = z.object({
  name: z.string().min(2, "Patient name is required (min 2 characters)"),
  age: z.coerce.number({ required_error: "Age is required" }).min(0, "Age must be positive").max(120),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Please select a gender" }),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  visit_type: z.enum(['New', 'Follow-up'], { required_error: "Please select a visit type" }),
  visit_date: z.string().min(1, "Visit date is required"),
});

const PatientEntryForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 0,
      gender: 'Male',
      diagnosis: '',
      visit_type: 'New',
      visit_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from('patients').insert([values]);
      if (error) throw error;
      
      toast.success("Patient recorded successfully");
      form.reset({
        name: '',
        age: 0,
        gender: 'Male',
        diagnosis: '',
        visit_type: 'New',
        visit_date: new Date().toISOString().split('T')[0],
      });
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5 sm:p-8 bg-white rounded-[2rem] shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-blue-50 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl">
          <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none">Quick Patient Entry</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-1.5">All fields are mandatory</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Patient Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" className="rounded-xl h-11 sm:h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Age *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" className="rounded-xl h-11 sm:h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Gender *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11 sm:h-12">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Visit Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-11 sm:h-12">
                        <SelectValue placeholder="Visit Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="New">New Patient</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Diagnosis *</FormLabel>
                <FormControl>
                  <DiagnosisInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="Enter or select diagnosis..." 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visit_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Visit Date *</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl h-11 sm:h-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all duration-200 mt-2"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : "Submit Entry"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PatientEntryForm;