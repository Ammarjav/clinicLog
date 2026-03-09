"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/form/ui/form';
import { toast } from 'sonner';
import { Loader2, UserPlus, Info, CheckCircle2, History } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';

const formSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  age: z.coerce.number({ 
    required_error: "Age is required",
    invalid_type_error: "Age must be a number" 
  }).min(0, "Age cannot be negative").max(120, "Age cannot exceed 120"),
  gender: z.enum(['Male', 'Female', 'Other']),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  visit_type: z.enum(['New', 'Follow-up']),
  visit_date: z.string(),
  clinic_id: z.string().uuid(),
});

const PatientEntryForm = () => {
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // @ts-ignore
      age: '',
      gender: 'Male',
      diagnosis: '',
      visit_type: 'New',
      visit_date: new Date().toISOString().split('T')[0],
      clinic_id: '',
    },
  });

  useEffect(() => {
    const fetchUserClinic = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('users')
            .select('clinic_id')
            .eq('id', user.id)
            .single();
          
          if (data?.clinic_id) {
            setClinicId(data.clinic_id);
            form.setValue('clinic_id', data.clinic_id);
          }
        }
      } catch (err) {
        console.error("Auth fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserClinic();
  }, [form]);

  // Handle autofill when a returning patient is selected
  const handleRecordSelect = (record: any) => {
    if (record) {
      form.setValue('age', record.age);
      form.setValue('gender', record.gender);
      form.setValue('diagnosis', record.diagnosis);
      form.setValue('visit_type', 'Follow-up'); // Default to follow-up for returning patients
      
      toast.success(`Imported data for returning patient: ${record.name}`, {
        icon: <History className="w-4 h-4 text-blue-500" />,
        duration: 3000
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.from('patients').insert([values]);
      if (error) throw error;
      
      toast.success("Patient recorded successfully", {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
      });

      // Reset for next entry but keep clinic_id and date
      form.reset({
        name: '',
        // @ts-ignore
        age: '',
        gender: 'Male',
        diagnosis: '',
        visit_type: 'New',
        visit_date: values.visit_date,
        clinic_id: values.clinic_id,
      });
      
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading session...</p>
      </div>
    );
  }

  if (!clinicId) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center text-center">
        <div className="bg-amber-50 p-5 rounded-3xl mb-6">
          <Info className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Portal Access Required</h2>
        <p className="text-gray-500 mt-3 max-w-sm">Please log in to your clinic's admin account to start recording patient data.</p>
        <Button className="mt-8 px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100" asChild>
          <a href="/admin/login">Log in to Clinic Portal</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50/50 border border-gray-100">
      <div className="flex items-center gap-4 mb-8 sm:mb-10">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-none">Record Entry</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2">Instantly add a patient to your database</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700">Patient Name</FormLabel>
                  <FormControl>
                    <AutocompleteInput 
                      value={field.value} 
                      onChange={field.onChange} 
                      onSelectRecord={handleRecordSelect}
                      placeholder="e.g. John Doe" 
                      fieldName="name"
                      clinicId={clinicId}
                    />
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
                  <FormLabel className="text-sm font-bold text-gray-700">Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="120" 
                      placeholder="Years" 
                      className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 border-gray-100 focus:bg-white transition-all text-lg" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700">Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 border-gray-100 focus:bg-white text-base">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl">
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
                  <FormLabel className="text-sm font-bold text-gray-700">Visit Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 border-gray-100 focus:bg-white text-base">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="New">New Patient</SelectItem>
                      <SelectItem value="Follow-up">Follow-up Visit</SelectItem>
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
                <FormLabel className="text-sm font-bold text-gray-700">Diagnosis / Reason</FormLabel>
                <FormControl>
                  <AutocompleteInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="e.g. Hypertension, Routine checkup..." 
                    fieldName="diagnosis"
                    clinicId={clinicId}
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
                <FormLabel className="text-sm font-bold text-gray-700">Visit Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 border-gray-100 focus:bg-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-[1.25rem] bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all duration-300 active:scale-[0.98] mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : "Save Patient Entry"}
          </Button>
          
          <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest mt-4">
            Secured for clinic portal
          </p>
        </form>
      </Form>
    </div>
  );
};

export default PatientEntryForm;