"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Charts from '@/components/dashboard/Charts';
import { toast } from 'sonner';

const ClinicAnalytics = () => {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('patients').select('*');
      if (error) toast.error(error.message);
      else setPatients(data || []);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Detailed Analytics</h1>
        <p className="text-gray-500">Trends and population distribution</p>
      </div>
      <Charts data={patients} />
    </div>
  );
};

export default ClinicAnalytics;