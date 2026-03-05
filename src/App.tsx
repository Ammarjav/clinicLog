import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import ClinicGuard from "./components/auth/ClinicGuard";
import ClinicLayout from "./components/layout/ClinicLayout";
import ClinicDashboard from "./pages/clinic/ClinicDashboard";
import ClinicPatients from "./pages/clinic/ClinicPatients";
import ClinicAnalytics from "./pages/clinic/ClinicAnalytics";
import ClinicEntry from "./pages/clinic/ClinicEntry";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/signup" element={<Signup />} />
          
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
          
          <Route path="/clinic/:slug/analytics" element={
            <ClinicGuard>
              <ClinicLayout>
                <ClinicAnalytics />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;