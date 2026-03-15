"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, UserPlus, Save, Lock } from 'lucide-react';
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
  
  // Cache of existing identities to trigger Follow-up mode
  const [existingIdentities, setExistingIdentities] = useState<Set<string>>(new Set());

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

  const watchName = form.watch('name');
  const watchPhone = form.watch('phone');
  const watchCountryCode = form.watch('countryCode');

  // Check if current Name + Phone exists in our database
  const isExistingPatient = useMemo(() => {
    const nameKey = watchName.toLowerCase().trim();
    if (!nameKey) return false;

    let rawNumber = watchPhone?.trim() || '';
    let currentFormattedPhone = '';
    if (rawNumber) {
      let cleaned = rawNumber.replace(/\D/g, '');
      if (watchCountryCode === '+92') {
        if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
        if (cleaned.startsWith('92')) cleaned = cleaned.substring(2);
      }
      currentFormattedPhone = watchCountryCode + cleaned;
    }

    return existingIdentities.has(`${nameKey}|${currentFormattedPhone}`);
  }, [watchName, watchPhone, watchCountryCode, existingIdentities]);

  // Lock status to Follow-up if patient is recognized
  useEffect(() => {
    if (isExistingPatient) {
      form.setValue('visit_type', 'Follow-up');
    }
  }, [isExistingPatient, form]);

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
          
          const { data: identities, count } = await supabase
            .from('patients')
            .select('name, phone')
            .eq('clinic_id', data.clinic_id);
            
          if (identities) {
            const set = new Set(identities.map(i => 
              `${i.name.toLowerCase().trim()}|${i.phone || ''}`
            ));
            setExistingIdentities(set);
          }
          setCurrentPatients(count || 0);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
      form.setValue('name', record.name);
      form.setValue('age', record.age);
      form.setValue('gender', record.gender);
      form.setValue('visit_type', 'Follow-up');
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (clinicData && currentPatients >= clinicData.patient_limit) {
      toast.error("Plan limit reached.");
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
      // Destructure countryCode out so we don't send it to the database
      const { countryCode, ...baseValues } = values;

      let clinicalData = {
        diagnosis: 'Pending Documentation',
        chief_complaint: '',
        past_history: '',
        physical_exam: '',
        treatment_plan: '',
        home_plan: ''
      };

      // If it's a Follow-up, fetch the most recent data for this patient to clone it
      if (values.visit_type === 'Follow-up') {
        const { data: history } = await supabase
          .from('patients')
          .select('*')
          .eq('name', values.name)
          .eq('phone', formattedPhone || '')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (history) {
          clinicalData = {
            diagnosis: history.diagnosis,
            chief_complaint: history.chief_complaint,
            past_history: history.past_history,
            physical_exam: history.physical_exam,
            treatment_plan: history.treatment_plan,
            home_plan: history.home_plan
          };
        }
      }

      const { error } = await supabase.from('patients').insert([{
        ...baseValues,
        phone: formattedPhone,
        ...clinicalData
      }]);
      
      if (error) throw error;
      
      toast.success(values.visit_type === 'Follow-up' ? "Follow-up record synced" : "New patient saved");

      if (!isExistingPatient) {
        const newKey = `${values.name.toLowerCase().trim()}|${formattedPhone || ''}`;
        setExistingIdentities(prev => new Set(prev).add(newKey));
        setCurrentPatients(prev => prev + 1);
      }

      form.reset({
        name: '',
        countryCode: values.countryCode,
        phone: '',
        // @ts-ignore
        age: '',
        gender: values.gender,
        visit_type: 'New',
        visit_date: values.visit_date,
        clinic_id: values.clinic_id,
      });
      
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Record Entry</h1>
          <p className="text-gray-500 text-sm">Capture basic patient information</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Patient Name</FormLabel>
                  <FormControl>
                    <AutocompleteInput 
                      value={field.value} 
                      onChange={field.onChange} 
                      onSelectRecord={handleRecordSelect}
                      fieldName="name"
                      clinicId={clinicData?.id}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <FormLabel className="text-sm font-bold">Phone Number</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="w-[100px] h-12 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl><Input className="rounded-xl h-12" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Age</FormLabel>
                  <FormControl><Input type="number" className="rounded-xl h-12" {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold flex items-center gap-2">
                    Visit Status
                    {isExistingPatient && <Lock className="w-3 h-3 text-indigo-500" />}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isExistingPatient}>
                    <FormControl>
                      <SelectTrigger className={`rounded-xl h-12 ${isExistingPatient ? 'bg-indigo-50 text-indigo-700 font-bold border-indigo-100' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isExistingPatient && <SelectItem value="New">New Patient</SelectItem>}
                      <SelectItem value="Follow-up">Follow-up Visit</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visit_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold">Visit Date</FormLabel>
                  <FormControl><Input type="date" className="rounded-xl h-12" {...field} /></FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold shadow-xl" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Save Patient Data"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PatientEntryForm;