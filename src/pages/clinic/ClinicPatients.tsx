"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import PatientTable from '@/components/dashboard/PatientTable';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import EditPatientForm from '@/components/forms/EditPatientForm';
import { toast } from 'sonner';
import { Users, FileText, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { slug } = useParams();
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

  useEffect(() => { 
    fetchPatients(); 
  }, [slug]);

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
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Patient Records</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm sm:text-base">Complete searchable database of clinic visits</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <Button 
            variant="outline" 
            asChild
            className="rounded-2xl border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400 h-12 px-6 font-bold shadow-sm hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 group"
          >
            <Link to={`/clinic/${slug}/patients/followups`}>
              <CalendarClock className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Follow-ups
            </Link>
          </Button>
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm dark:shadow-none border border-slate-50 dark:border-slate-800 flex items-center justify-center gap-3 h-12">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white whitespace-nowrap">{filteredPatients.length} Total</span>
          </div>
        </div>
      </div>

      <DashboardFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        onReset={() => setFilters({ search: '', gender: 'all', visitType: 'all', minAge: '', maxAge: '', date: '' })} 
      />

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">Management Console</h2>
        </div>
        <div className="px-1">
          <PatientTable 
            patients={filteredPatients} 
            onEdit={(p) => setEditPatient(p)} 
            onDelete={(id) => setDeleteId(id)} 
          />
        </div>
      </div>

      <Sheet open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <SheetContent className="w-full sm:max-w-md rounded-l-none sm:rounded-l-[3rem] border-none shadow-2xl dark:bg-slate-950">
          <SheetHeader className="pb-6 border-b border-slate-50 dark:border-slate-800">
            <SheetTitle className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Patient</SheetTitle>
            <SheetDescription className="font-medium text-sm">
              Updating medical record for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{editPatient?.name}</span>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 sm:mt-8">
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
        <AlertDialogContent className="w-[90%] max-w-sm sm:max-w-md rounded-[2rem] sm:rounded-[2.5rem] border-none shadow-2xl p-6 sm:p-8 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm">
              This will permanently remove the patient log from the database. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 sm:mt-8 flex-col sm:flex-row gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl h-12 sm:h-14 px-8 border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-2xl h-12 sm:h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xl shadow-rose-100 dark:shadow-none transition-all text-sm">Delete Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClinicPatients;