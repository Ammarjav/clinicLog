"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, UserPlus, CheckCircle2, History, AlertTriangle, Phone } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import { Link, useParams } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  phone: z.string().optional(),
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
  const { slug } = useParams();
  const [clinicData, setClinicData] = useState<any>(null);
  const [currentPatients, setCurrentPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      // @ts-ignore
      age: '',
      gender: 'Male',
      diagnosis: '',
      visit_type: 'New',
      visit_date: new Date().toISOString().split('T')[0],
      clinic_id: '',
    },
  });

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('clinic_id, clinics(*)')
          .eq('id', user.id)
          .single();
        
        if (data?.clinics) {
          setClinicData(data.clinics);
          form.setValue('clinic_id', data.clinic_id);
          
          const { count } = await supabase
            .from('patients')
            .select('*', { count: 'exact', head: true });
          setCurrentPatients(count || 0);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [form]);

  const isLimitReached = clinicData && currentPatients >= clinicData.patient_limit;

  const handleRecordSelect = (record: any) => {
    if (record) {
      form.setValue('phone', record.phone?.replace('+92', '') || '');
      form.setValue('age', record.age);
      form.setValue('gender', record.gender);
      form.setValue('diagnosis', record.diagnosis);
      form.setValue('visit_type', 'Follow-up');
      
      toast.success(`Imported data for returning patient: ${record.name}`, {
        icon: <History className="w-4 h-4 text-blue-500" />,
        duration: 3000
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLimitReached) {
      toast.error("You have reached your plan limit. Upgrade to continue.");
      return;
    }

    // Format phone number logic
    let formattedPhone = values.phone?.trim() || '';
    if (formattedPhone) {
      // Remove any non-numeric characters
      cleanedPhone = formattedPhone.replace(/\D/g, '');
      // If starts with 0, remove it
      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.substring(1);
      }
      // If starts with 92, remove it to normalize
      if (cleanedPhone.startsWith('92')) {
        cleanedPhone = cleanedPhone.substring(2);
      }
      formattedPhone = '+92' + cleanedPhone;
    }

    try {
      const { error } = await supabase.from('patients').insert([{
        ...values,
        phone: formattedPhone || null
      }]);
      
      if (error) throw error;
      
      toast.success("Patient recorded successfully", {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
      });

      setCurrentPatients(prev => prev + 1);

      form.reset({
        name: '',
        phone: '',
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

  let cleanedPhone = ""; // Helper for scope

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-slate-400 font-medium">Loading session...</p>
      </div>
    );
  }

  if (!clinicData) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portal Access Required</h2>
        <Button className="mt-8 px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700" asChild>
          <a href="/admin/login">Log in to Clinic Portal</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-50/50 dark:shadow-none border border-gray-100 dark:border-slate-800 relative overflow-hidden">
      {isLimitReached && (
        <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 text-center max-w-sm animate-in zoom-in-95 duration-300">
            <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-2xl inline-block mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Limit Reached</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6">
              You've hit your plan limit of {clinicData.patient_limit} patients.
            </p>
            <Button asChild className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold">
              <Link to={`/clinic/${slug}/billing`}>Upgrade Now</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 sm:mb-10">
        <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-2xl shadow-lg dark:shadow-none">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">Record Entry</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base mt-2">Instantly add a patient to your database</p>
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
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Patient Name</FormLabel>
                  <FormControl>
                    <AutocompleteInput 
                      value={field.value} 
                      onChange={field.onChange} 
                      onSelectRecord={handleRecordSelect}
                      placeholder="e.g. John Doe" 
                      fieldName="name"
                      clinicId={clinicData.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 font-bold text-sm border-r border-slate-200 dark:border-slate-700 pr-2">+92</span>
                      </div>
                      <Input 
                        placeholder="310 1234567" 
                        className="rounded-2xl h-12 sm:h-14 pl-20 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all text-base" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Age</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="120" 
                      placeholder="Years" 
                      className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 text-base dark:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl dark:bg-slate-900">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Visit Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 text-base dark:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-2xl dark:bg-slate-900">
                      <SelectItem value="New">New Patient</SelectItem>
                      <SelectItem value="Follow-up">Follow-up Visit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Visit Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 dark:text-white" 
                      {...field} 
                    />
                  </FormControl>
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
                <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Diagnosis / Reason</FormLabel>
                <FormControl>
                  <AutocompleteInput 
                    value={field.value} 
                    onChange={field.onChange} 
                    placeholder="e.g. Hypertension, Routine checkup..." 
                    fieldName="diagnosis"
                    clinicId={clinicData.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-[1.25rem] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 active:scale-[0.98] mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : "Save Patient Entry"}
          </Button>
          
          <p className="text-center text-xs text-gray-400 dark:text-slate-600 font-medium uppercase tracking-widest mt-4">
            Secured for clinic portal
          </p>
        </form>
      </Form>
    </div>
  );
};

export default PatientEntryForm;