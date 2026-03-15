import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import ClinicGuard from "./components/auth/ClinicGuard";
import ClinicLayout from "./components/layout/ClinicLayout";
import ClinicDashboard from "./pages/clinic/ClinicDashboard";
import ClinicPatients from "./pages/clinic/ClinicPatients";
import ClinicAnalytics from "./pages/clinic/ClinicAnalytics";
import ClinicReports from "./pages/clinic/ClinicReports";
import ClinicEntry from "./pages/clinic/ClinicEntry";
import ClinicBilling from "./pages/clinic/ClinicBilling";
import ClinicFollowups from "./pages/clinic/ClinicFollowups";
import ClinicFeeSettings from "./pages/clinic/ClinicFeeSettings";
import ClinicPatientEdit from "./pages/clinic/ClinicPatientEdit";
import AdminPayments from "./pages/admin/AdminPayments";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="clinic-log-theme" attribute="class">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Internal Admin Payment Tool */}
              <Route path="/admin/payments-management" element={<AdminPayments />} />

              {/* Protected Clinic Routes */}
              <Route path="/clinic/:slug" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <Navigate to="dashboard" replace />
                  </ClinicLayout>
                </ClinicGuard>
              } />
              
              <Route path="/clinic/:slug/dashboard" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicDashboard />
                  </ClinicLayout>
                </ClinicGuard>
              } />
              
              <Route path="/clinic/:slug/patients" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicPatients />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="/clinic/:slug/patients/:id/edit" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicPatientEdit />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="/clinic/:slug/patients/followups" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicFollowups />
                  </ClinicLayout>
                </ClinicGuard>
              } />
              
              <Route path="/clinic/:slug/analytics" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicAnalytics />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="/clinic/:slug/reports" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicReports />
                  </ClinicLayout>
                </ClinicGuard>
              } />
              
              <Route path="/clinic/:slug/entry" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicEntry />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="/clinic/:slug/billing" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicBilling />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="/clinic/:slug/settings/fees" element={
                <ClinicGuard>
                  <ClinicLayout>
                    <ClinicFeeSettings />
                  </ClinicLayout>
                </ClinicGuard>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;