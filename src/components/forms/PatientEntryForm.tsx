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
import { Loader2, UserPlus, Save, Phone } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import { Link, useParams } from 'react-router-dom';

const COUNTRIES = [
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+1', name: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
];

const formSchema = z.object({
  name: z.string().min(1, "Patient name is required"),
  countryCode: z.string().default('+92'),
  phone: z.string().optional(),
  age: z.coerce.number({ 
    required_error: "Age is required",
    invalid_type_error: "Age must be a number" 
  }).min(0, "Age cannot be negative").max(120, "Age cannot exceed 120"),
  gender: z.enum(['Male', 'Female', 'Other']),
  visit_type: z.enum(['New', 'Follow-up']),
  visit_date: z.string(),
  clinic_id: z.string().uuid(),
});

const PatientEntryForm = () => {
  const { slug } = useParams();
  const [clinicData, setClinicData] = useState<any>(null);
  const [currentPatients, setCurrentPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatientNotes, setSelectedPatientNotes] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      countryCode: '+92',
      phone: '',
      // @ts-ignore
      age: '',
      gender: 'Male',
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

  useEffect(() => { fetchData(); }, []);

  const isLimitReached = clinicData && currentPatients >= clinicData.patient_limit;

  const handleRecordSelect = (record: any) => {
    if (record) {
      if (record.phone) {
        const fullPhone = record.phone;
        const matchedCountry = COUNTRIES.find(c => fullPhone.startsWith(c.code));
        if (matchedCountry) {
          form.setValue('countryCode', matchedCountry.code);
          form.setValue('phone', fullPhone.replace(matchedCountry.code, ''));
        } else {
          form.setValue('phone', fullPhone);
        }
      }
      
      form.setValue('age', record.age);
      form.setValue('gender', record.gender);
      form.setValue('visit_type', 'Follow-up');
      
      // Store clinical notes to be copied to the new record
      setSelectedPatientNotes({
        diagnosis: record.diagnosis,
        chief_complaint: record.chief_complaint,
        past_history: record.past_history,
        physical_exam: record.physical_exam,
        treatment_plan: record.treatment_plan,
        home_plan: record.home_plan
      });
      
      toast.success(`Patient selected. Clinical notes will be synced.`);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLimitReached) {
      toast.error("You have reached your plan limit. Upgrade to continue.");
      return;
    }

    let rawNumber = values.phone?.trim() || '';
    let formattedPhone = null;

    if (rawNumber) {
      let cleaned = rawNumber.replace(/\D/g, '');
      if (values.countryCode === '+92') {
        if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
        if (cleaned.startsWith('92')) cleaned = cleaned.substring(2);
      }
      formattedPhone = values.countryCode + cleaned;
    }

    try {
      const { countryCode, ...dbValues } = values;
      
      // If it's a returning patient, we use the stored notes. Otherwise, it's pending.
      const entryData = {
        ...dbValues,
        phone: formattedPhone,
        diagnosis: selectedPatientNotes?.diagnosis || 'Pending Documentation',
        chief_complaint: selectedPatientNotes?.chief_complaint || '',
        past_history: selectedPatientNotes?.past_history || '',
        physical_exam: selectedPatientNotes?.physical_exam || '',
        treatment_plan: selectedPatientNotes?.treatment_plan || '',
        home_plan: selectedPatientNotes?.home_plan || ''
      };

      const { error } = await supabase.from('patients').insert([entryData]);
      
      if (error) throw error;
      
      toast.success("Patient entry saved", {
        description: selectedPatientNotes ? "Follow-up notes inherited from previous visit." : "New patient log created."
      });

      // Reset form but keep clinic_id and date
      form.reset({
        name: '',
        countryCode: values.countryCode,
        phone: '',
        // @ts-ignore
        age: '',
        gender: 'Male',
        visit_type: 'New',
        visit_date: values.visit_date,
        clinic_id: values.clinic_id,
      });
      setSelectedPatientNotes(null);
      setCurrentPatients(prev => prev + 1);
      
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 dark:text-slate-400 font-medium">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-50/50 dark:shadow-none border border-gray-100 dark:border-slate-800 relative overflow-hidden">
      {isLimitReached && (
        <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 text-center max-w-sm animate-in zoom-in-95 duration-300">
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
          <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base mt-2">Capture basic patient information</p>
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
                      clinicId={clinicData?.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <FormLabel className="text-sm font-bold text-gray-700 dark:text-slate-300">Phone Number</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[100px] h-12 sm:h-14 rounded-2xl bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 text-xs sm:text-sm font-bold">
                          <SelectValue placeholder="+92" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl dark:bg-slate-900">
                        {COUNTRIES.map(c => (
                          <SelectItem key={c.code} value={c.code} className="text-xs sm:text-sm">
                            <span className="mr-2">{c.flag}</span> {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="310 1234567" 
                          className="rounded-2xl h-12 sm:h-14 bg-gray-50/50 dark:bg-slate-800 border-gray-100 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all text-base" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

          <Button 
            type="submit" 
            className="w-full h-14 sm:h-16 text-lg sm:text-xl font-bold rounded-[1.25rem] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 active:scale-[0.98] mt-4 shadow-xl shadow-blue-200 dark:shadow-none"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" /> Save Patient Data
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PatientEntryForm;