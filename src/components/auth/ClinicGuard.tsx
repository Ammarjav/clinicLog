"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface ClinicGuardProps {
  children: React.ReactNode;
}

export const ClinicGuard = ({ children }: ClinicGuardProps) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Verify the user belongs to the clinic with this slug
      const { data, error } = await supabase
        .from('users')
        .select('clinic_id, clinics!inner(slug)')
        .eq('id', user.id)
        .single();

      if (error || !data || data.clinics.slug !== slug) {
        console.error("Unauthorized access attempt to clinic:", slug);
        // Redirect to their actual clinic if they have one
        if (data?.clinics?.slug) {
          navigate(`/clinic/${data.clinics.slug}/dashboard`);
        } else {
          navigate('/admin/login');
        }
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default ClinicGuard;