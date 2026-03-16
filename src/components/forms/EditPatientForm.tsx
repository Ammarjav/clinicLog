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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, FileText, Activity, Stethoscope, Tags, Banknote } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  name: z.string().min(1, "Name is required"),
  countryCode: z.string().default('+92'),
  phone: z.string().optional(),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  visit_type: z.enum(['New', 'Follow-up']),
  visit_date: z.string().min(1),
  category: z.string().optional(),
  fee_paid: z.coerce.number().min(0),
  chief_complaint: z.string().optional(),
  past_history: z.string().optional(),
  physical_exam: z.string().optional(),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  treatment_plan: z.string().optional(),
  home_plan: z.string().optional(),
});

interface EditPatientFormProps {
  patient: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPatientForm = ({ patient, onSuccess, onCancel }: EditPatientFormProps) => {
  const getInitialPhone = () => {
    if (!patient.phone) return { code: '+92', number: '' };
    const matched = COUNTRIES.find(c => patient.phone.startsWith(c.code));
    if (matched) return { code: matched.code, number: patient.phone.replace(matched.code, '') };
    return { code: '+92', number: patient.phone };
  };

  const initialPhone = getInitialPhone();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient.name || '',
      countryCode: initialPhone.code,
      phone: initialPhone.number,
      age: patient.age,
      gender: patient.gender,
      visit_type: patient.visit_type,
      visit_date: patient.visit_date,
      category: patient.category || '',
      fee_paid: patient.fee_paid || 0,
      chief_complaint: patient.chief_complaint || '',
      past_history: patient.past_history || '',
      physical_exam: patient.physical_exam || '',
      diagnosis: patient.diagnosis === 'Pending Documentation' ? '' : patient.diagnosis,
      treatment_plan: patient.treatment_plan || '',
      home_plan: patient.home_plan || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const { error } = await supabase
        .from('patients')
        .update({
          ...dbValues,
          phone: formattedPhone
        })
        .eq('id', patient.id);
        
      if (error) throw error;
      toast.success("Clinical record updated");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid grid-cols-2 bg-slate-100 dark:bg-slate-900 h-12 rounded-2xl mb-6">
            <TabsTrigger value="demographics" className="rounded-xl font-bold">Demographics</TabsTrigger>
            <TabsTrigger value="clinical" className="rounded-xl font-bold">Clinical Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics" className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Patient Name</FormLabel>
                    <FormControl><AutocompleteInput value={field.value} onChange={field.onChange} fieldName="name" clinicId={patient.clinic_id} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Category</FormLabel>
                    <FormControl><AutocompleteInput value={field.value || ''} onChange={field.onChange} fieldName="category" clinicId={patient.clinic_id} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="visit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="Follow-up">Follow-up</SelectItem></SelectContent></Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fee_paid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-emerald-500">Fee Charged (Rs.)</FormLabel>
                    <FormControl><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rs.</span><Input type="number" className="h-12 pl-12 rounded-xl font-bold bg-emerald-50/30 border-none" {...field} /></div></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Number</FormLabel>
              <div className="flex gap-2">
                <FormField control={form.control} name="countryCode" render={({ field }) => (<Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="w-[90px] h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"><SelectValue /></SelectTrigger></FormControl><SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}</SelectContent></Select>)} />
                <FormField control={form.control} name="phone" render={({ field }) => (<FormItem className="flex-1"><FormControl><Input className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none" {...field} /></FormControl></FormItem>)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Age</FormLabel><FormControl><Input type="number" className="rounded-xl h-12" {...field} /></FormControl></FormItem>)} />
              <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></FormItem>)} />
            </div>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-5">
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 space-y-6">
              <FormField control={form.control} name="diagnosis" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-rose-600">Diagnosis</FormLabel><FormControl><AutocompleteInput value={field.value} onChange={field.onChange} fieldName="diagnosis" clinicId={patient.clinic_id} /></FormControl></FormItem>)} />
              
              <FormField control={form.control} name="chief_complaint" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Chief Complaints</FormLabel><FormControl><Textarea className="rounded-2xl border-none min-h-[80px]" {...field} /></FormControl></FormItem>)} />
              
              <FormField control={form.control} name="physical_exam" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-indigo-600">Objective Examination</FormLabel><FormControl><Textarea className="rounded-2xl border-none min-h-[80px]" {...field} /></FormControl></FormItem>)} />

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="treatment_plan" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-emerald-600">Treatment</FormLabel><FormControl><Textarea className="rounded-2xl border-none min-h-[100px]" {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="home_plan" render={({ field }) => (<FormItem><FormLabel className="text-xs font-black uppercase tracking-widest text-emerald-600">Home Care</FormLabel><FormControl><Textarea className="rounded-2xl border-none min-h-[100px]" {...field} /></FormControl></FormItem>)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2" /> Update Record</>}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPatientForm;