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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Patient Records</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Complete searchable database of clinic visits</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            asChild
            className="rounded-xl border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-700 h-11 px-5 font-bold shadow-sm"
          >
            <Link to={`/clinic/${slug}/patients/followups`}>
              <CalendarClock className="w-4 h-4 mr-2" />
              Follow-ups
            </Link>
          </Button>
          <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm dark:shadow-none border border-slate-50 dark:border-slate-800 flex items-center gap-3 h-11">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-black text-slate-900 dark:text-white">{filteredPatients.length} Total</span>
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
          <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Management Console</h2>
        </div>
        <PatientTable 
          patients={filteredPatients} 
          onEdit={(p) => setEditPatient(p)} 
          onDelete={(id) => setDeleteId(id)} 
        />
      </div>

      <Sheet open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <SheetContent className="sm:max-w-md rounded-l-[3rem] border-none shadow-2xl dark:bg-slate-950">
          <SheetHeader className="pb-6 border-b border-slate-50 dark:border-slate-800">
            <SheetTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Patient</SheetTitle>
            <SheetDescription className="font-medium">
              Updating medical record for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{editPatient?.name}</span>
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
        <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
              This will permanently remove the patient log from the database. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl h-14 px-8 border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-2xl h-14 px-8 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xl shadow-rose-100 dark:shadow-none transition-all">Delete Record</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClinicPatients;