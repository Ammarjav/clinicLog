import React from 'react';
import PatientEntryForm from '@/components/forms/PatientEntryForm';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl mb-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">ClinicLog</span>
        </div>
        <Link to="/admin/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          Admin Portal
        </Link>
      </div>
      
      <main className="w-full max-w-2xl">
        <PatientEntryForm />
      </main>
    </div>
  );
};

export default Index;