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
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

interface ClinicLayoutProps {
  children: React.ReactNode;
}

export const ClinicLayout = ({ children }: ClinicLayoutProps) => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState('Clinic Portal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchClinic = async () => {
      const { data } = await supabase
        .from('clinics')
        .select('name')
        .eq('slug', slug)
        .single();
      if (data) setClinicName(data.name);
    };
    fetchClinic();
  }, [slug]);

  const navItems = [
    { name: 'Dashboard', path: `/clinic/${slug}/dashboard`, icon: LayoutDashboard },
    { name: 'Patients', path: `/clinic/${slug}/patients`, icon: Users },
    { name: 'Analytics', path: `/clinic/${slug}/analytics`, icon: BarChart3 },
    { name: 'New Entry', path: `/clinic/${slug}/entry`, icon: UserPlus },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-100 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-gray-900 truncate">{clinicName}</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm",
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="w-full justify-start rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 h-12"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-gray-900">{clinicName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-white pt-20">
          <nav className="p-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-3xl font-semibold text-lg",
                  location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-500"
                )}
              >
                <item.icon className="w-6 h-6" />
                {item.name}
              </Link>
            ))}
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              className="w-full justify-start rounded-3xl text-red-500 text-lg h-14"
            >
              <LogOut className="w-6 h-6 mr-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default ClinicLayout;