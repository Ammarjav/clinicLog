"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import PatientTable from '@/components/dashboard/PatientTable';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import EditPatientForm from '@/components/forms/EditPatientForm';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const ClinicPatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editPatient, setEditPatient] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    visitType: 'all',
    minAge: '',
    maxAge: '',
    date: '',
  });

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('visit_date', { ascending: false });
    if (error) toast.error(error.message);
    else setPatients(data || []);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = !filters.search || 
        p.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
        p.diagnosis.toLowerCase().includes(filters.search.toLowerCase());
      const matchesGender = filters.gender === 'all' || p.gender === filters.gender;
      const matchesVisit = filters.visitType === 'all' || p.visit_type === filters.visitType;
      const age = parseInt(p.age);
      const minAge = filters.minAge === '' ? 0 : parseInt(filters.minAge);
      const maxAge = filters.maxAge === '' ? Infinity : parseInt(filters.maxAge);
      return matchesSearch && matchesGender && matchesVisit && age >= minAge && age <= maxAge;
    });
  }, [patients, filters]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('patients').delete().eq('id', deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Record removed");
      setPatients(patients.filter(p => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Records</h1>
        <p className="text-gray-500">Manage your clinical database</p>
      </div>

      <DashboardFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={() => setFilters({ search: '', gender: 'all', visitType: 'all', minAge: '', maxAge: '', date: '' })} 
      />

      <PatientTable 
        patients={filteredPatients} 
        onEdit={(p) => setEditPatient(p)} 
        onDelete={(id) => setDeleteId(id)} 
      />

      <Sheet open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <SheetContent className="sm:max-w-md rounded-l-[2.5rem]">
          <SheetHeader>
            <SheetTitle>Edit Patient</SheetTitle>
            <SheetDescription>Update record for {editPatient?.name}</SheetDescription>
          </SheetHeader>
          {editPatient && (
            <EditPatientForm 
              patient={editPatient} 
              onCancel={() => setEditPatient(null)}
              onSuccess={() => { setEditPatient(null); fetchPatients(); }}
            />
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClinicPatients;