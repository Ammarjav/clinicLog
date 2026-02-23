"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import StatCards from '@/components/dashboard/StatCards';
import Charts from '@/components/dashboard/Charts';
import PatientTable from '@/components/dashboard/PatientTable';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action is permanent.")) return;
    const { error } = await supabase.from('patients').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success("Record deleted");
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-900 tracking-tight">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={fetchPatients} className="rounded-xl">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <StatCards data={patients} />
        <Charts data={patients} />
        <PatientTable 
          patients={patients} 
          onEdit={(p) => toast.info("Edit feature: " + p.name)} 
          onDelete={handleDelete} 
        />
      </main>
    </div>
  );
};

export default Dashboard;