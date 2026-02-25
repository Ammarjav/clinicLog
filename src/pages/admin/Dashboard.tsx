"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import PatientTable from '@/components/dashboard/PatientTable';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import EditPatientForm from '@/components/forms/EditPatientForm';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, RefreshCcw } from 'lucide-react';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editPatient, setEditPatient] = useState<any | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    visitType: 'all',
    minAge: '',
    maxAge: '',
    date: '',
  });

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('visit_date', { ascending: false });
    
    if (error) {
      toast.error(error.message);
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
      } else {
        fetchPatients();
      }
    };
    checkUser();
  }, [navigate]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      gender: 'all',
      visitType: 'all',
      minAge: '',
      maxAge: '',
      date: '',
    });
  };

  // Computed filtered patients
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    const { error } = await supabase.from('patients').delete().eq('id', deleteId);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Record deleted successfully");
      setPatients(patients.filter(p => p.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900 tracking-tight">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={fetchPatients} className="rounded-xl">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 pb-20">
        <DashboardFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onReset={resetFilters} 
        />
        
        <StatCards data={filteredPatients} />
        
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Charts data={filteredPatients} />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Patient Records
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {filteredPatients.length}
            </span>
          </h2>
          <PatientTable 
            patients={filteredPatients} 
            onEdit={(p) => setEditPatient(p)} 
            onDelete={(id) => setDeleteId(id)} 
          />
        </div>
      </main>

      {/* Edit Patient Side Sheet */}
      <Sheet open={!!editPatient} onOpenChange={(open) => !open && setEditPatient(null)}>
        <SheetContent className="sm:max-w-md rounded-l-[2.5rem] border-none shadow-2xl">
          <SheetHeader className="pb-4 border-b border-gray-50">
            <SheetTitle className="text-2xl font-bold">Edit Patient Entry</SheetTitle>
            <SheetDescription>
              Modify the details of the selected patient record.
            </SheetDescription>
          </SheetHeader>
          {editPatient && (
            <EditPatientForm 
              patient={editPatient} 
              onCancel={() => setEditPatient(null)}
              onSuccess={() => {
                setEditPatient(null);
                fetchPatients();
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2rem] border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently delete the patient record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl border-gray-100 hover:bg-gray-50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;