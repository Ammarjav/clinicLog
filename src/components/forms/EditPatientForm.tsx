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
import { Loader2, Save, Phone } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  age: z.coerce.number().min(0, "Age cannot be negative").max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  visit_type: z.enum(['New', 'Follow-up']),
  visit_date: z.string().min(1, "Date is required"),
});

interface EditPatientFormProps {
  patient: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPatientForm = ({ patient, onSuccess, onCancel }: EditPatientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient.name || '',
      phone: patient.phone || '',
      age: patient.age,
      gender: patient.gender,
      diagnosis: patient.diagnosis,
      visit_type: patient.visit_type,
      visit_date: patient.visit_date,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update(values)
        .eq('id', patient.id);
        
      if (error) throw error;
      
      toast.success("Record updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <AutocompleteInput 
                  value={field.value} 
                  onChange={field.onChange} 
                  fieldName="name" 
                  clinicId={patient.clinic_id} 
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="0300 1234567" 
                    className="rounded-xl h-12 pl-12 bg-gray-50/50 dark:bg-slate-800" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" className="rounded-xl h-12" {...field} />
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
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Select" />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="visit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visit Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
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
                <FormLabel>Visit Date</FormLabel>
                <FormControl>
                  <Input type="date" className="rounded-xl h-12" {...field} />
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
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <AutocompleteInput 
                  value={field.value} 
                  onChange={field.onChange} 
                  fieldName="diagnosis" 
                  clinicId={patient.clinic_id} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 h-12 rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPatientForm;