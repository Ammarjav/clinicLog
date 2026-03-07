"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import PatientTable from '@/components/dashboard/PatientTable';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import EditPatientForm from '@/components/forms/EditPatientForm';
import { toast } from 'sonner';
import { Users, FileText } from 'lucide-react';
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
      const matchesDate = !filters.date || p.visit_date === filters.date;
      
      const age = parseInt(p.age);
      const minAge = filters.minAge === '' ? 0 : parseInt(filters.minAge);
      const maxAge = filters.maxAge === '' ? Infinity : parseInt(filters.maxAge);
      const matchesAge = age >= minAge && age <= maxAge;

      return matchesSearch && matchesGender && matchesVisit && matchesAge && matchesDate;
    });
  }, [patients, filters]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('patients').delete().eq('id', deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Record removed successfully");
      setPatients(patients.filter(p => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Patient Records</h1>
          <p className="text-slate-500 font-medium mt-1">Complete searchable database of clinic visits</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-xl">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Database Size</p>
            <p className="text-lg font-black text-slate-900">{filteredPatients.length} Patients</p>
          </div>
        </div>
      </div>

      <DashboardFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={() => setFilters({ search: '', gender: 'all', visitType: 'all', minAge: '', maxAge: '', date: '' })} 
      />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Management Console</h2>
        </div>
        <PatientTable 
          patients={filteredPatients} 
          onEdit={(p) => setEditPatient(p)} 
          onDelete={(id) => setDeleteId(id)} 
        />
      </div>

      <Sheet open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <SheetContent className="sm:max-w-md rounded-l-[3rem] border-none shadow-2xl">
          <SheetHeader className="pb-6 border-b border-slate-50">
            <SheetTitle className="text-2xl font-black tracking-tight text-slate-900">Edit Patient</SheetTitle>
            <SheetDescription className="font-medium">
              Updating medical record for <span className="text-indigo-600 font-bold">{editPatient?.name}</span>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-8">
            {editPatient && (
              <EditPatientForm 
                patient={editPatient} 
                onCancel={() => setEditPatient(null)}
                onSuccess={() => { setEditPatient(null); fetchPatients(); }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This will permanently remove the patient log from the database. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl h-14 px-8 border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-2xl h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xl shadow-rose-100 transition-all">Delete Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClinicPatients;