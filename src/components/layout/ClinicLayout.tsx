"use client";

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  UserPlus, 
  LogOut, 
  Menu, 
  X,
  FileText,
  CreditCard,
  UserCircle,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';
import UsageStats from '@/components/billing/UsageStats';
import { getClinicStatus } from '@/utils/statusUtils';

interface ClinicLayoutProps {
  children: React.ReactNode;
}

export const ClinicLayout = ({ children }: ClinicLayoutProps) => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<any>(null);
  const [patientCount, setPatientCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: clinicData } = await supabase
        .from('clinics')
        .select('*')
        .eq('slug', slug)
        .single();
      if (clinicData) setClinic(clinicData);

      const { count } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      setPatientCount(count || 0);
    };
    fetchData();
  }, [slug]);

  const { status, daysLeft } = getClinicStatus(clinic);

  const navItems = [
    { name: 'Dashboard', path: `/clinic/${slug}/dashboard`, icon: LayoutDashboard },
    { name: 'Patients', path: `/clinic/${slug}/patients`, icon: Users },
    { name: 'Analytics', path: `/clinic/${slug}/analytics`, icon: BarChart3 },
    { name: 'Reports', path: `/clinic/${slug}/reports`, icon: FileText },
    { name: 'New Entry', path: `/clinic/${slug}/entry`, icon: UserPlus },
    { name: 'Subscription', path: `/clinic/${slug}/billing`, icon: CreditCard },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 sticky top-0 h-screen transition-colors overflow-hidden">
        {/* Clickable Header Section - ClinicLog Branding */}
        <Link 
          to={`/clinic/${slug}/profile`}
          className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center gap-3 shrink-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <div className="relative shrink-0">
            {clinic?.logo_url ? (
              <img src={clinic.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <h2 className="font-black text-gray-900 dark:text-white tracking-tighter truncate text-sm leading-tight">
              {clinic?.name || 'ClinicLog'}
            </h2>
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest truncate mt-0.5">
              {clinic?.doctor_name ? `Dr. ${clinic.doctor_name}` : 'Practitioner'}
            </p>
          </div>
        </Link>
        
        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm",
                location.pathname === item.path 
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-100/50 dark:shadow-none" 
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-3 border-t border-gray-50 dark:border-slate-800 shrink-0">
          <div className="flex items-center justify-between mb-2 px-1">
             <ModeToggle />
             <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Settings</span>
          </div>
          {clinic && (
            <UsageStats 
              current={patientCount} 
              limit={clinic.patient_limit} 
              plan={clinic.plan}
              isTrial={status === 'trialing'}
              daysLeft={daysLeft}
              status={status}
            />
          )}
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="w-full justify-start rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-300 h-11"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-6 h-16 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <Link to={`/clinic/${slug}/profile`} className="flex items-center gap-2">
          {clinic?.logo_url ? (
            <img src={clinic.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <Logo className="w-8 h-8" />
          )}
          <span className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{clinic?.name || 'ClinicLog'}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="dark:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-white dark:bg-slate-900 pt-20 transition-colors overflow-y-auto">
          <nav className="p-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-3xl font-semibold text-lg",
                  location.pathname === item.path 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-slate-400"
                )}
              >
                <item.icon className="w-6 h-6" />
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2">
              {clinic && (
                <UsageStats 
                  current={patientCount} 
                  limit={clinic.patient_limit} 
                  plan={clinic.plan}
                  isTrial={status === 'trialing'}
                  daysLeft={daysLeft}
                  status={status}
                />
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="w-full justify-start rounded-3xl text-red-500 dark:text-red-400 text-lg h-14"
            >
              <LogOut className="w-6 h-6 mr-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden dark:bg-slate-950 transition-colors">
        {children}
      </main>
    </div>
  );
};

export default ClinicLayout;