import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * RequireAuth
 *
 * Wraps a route to ensure the user is authenticated.
 * If `adminOnly` is true, it also verifies the user has an admin role.
 *
 * Usage:
 *   <Route path="/admin/payments-management" element={
 *     <RequireAuth adminOnly={true}><AdminPayments /></RequireAuth>
 *   } />
 */
export const RequireAuth = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);

          // If adminOnly is required, verify the user is an admin
          if (adminOnly) {
            const { data: userData, error } = await supabase              .from("users")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (error) throw error;
            setIsAdmin(data.role === "admin");
          } else {
            setIsAdmin(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
        setIsAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // While loading, show a simple placeholder (or nothing)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Checking permissions…</p>
    </div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast.error("You must log in to access this page");
    navigate("/admin/login", { replace: true });
    return null;
  }

  // If adminOnly is required but user is not an admin, redirect
  if (adminOnly && !isAdmin) {
    toast.error("Access denied – insufficient permissions");
    navigate("/", { replace: true });
    return null;
  }

  // Otherwise, render the protected component
  return <>{children}</>;
};