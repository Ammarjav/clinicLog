"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  ShieldCheck, 
  BarChart4, 
  Users, 
  Sparkles,
  Activity,
  ChevronRight
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[5%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[50%] md:w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-100/20 rounded-2xl md:rounded-[2rem] px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Logo className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl" />
            <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter">Clinic<span className="text-indigo-600">Log</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-500 text-sm">
            <a href="#vision" className="hover:text-indigo-600 transition-colors">Vision</a>
            <a href="#technology" className="hover:text-indigo-600 transition-colors">Technology</a>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="rounded-xl font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 text-xs md:text-sm px-3 h-9 md:h-10">
              <Link to="/admin/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white shadow-lg transition-all px-4 md:px-6 text-xs md:text-sm h-9 md:h-10">
              <Link to="/admin/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-3 md:px-4 py-1.5 rounded-full shadow-sm mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-widest text-center">The Future of Patient Logging</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] tracking-tight mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Efficiency for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Modern Clinics.</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4">
            Ditch the paperwork. A high-performance database for medical professionals who value speed, accuracy, and beautiful data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 px-4">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold shadow-2xl shadow-indigo-200 group">
              <Link to="/admin/signup" className="flex items-center justify-center">
                Get Started <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold border-slate-200 hover:bg-slate-50">
              <Link to="/admin/login">Explore Demo</Link>
            </Button>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto animate-in zoom-in-95 duration-1000 px-2 md:px-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl md:rounded-[3rem] blur-xl md:blur-2xl opacity-20" />
            <div className="relative bg-white/40 backdrop-blur-sm p-2 md:p-4 rounded-3xl md:rounded-[3rem] border border-white shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000" 
                alt="ClinicLog Interface" 
                className="rounded-2xl md:rounded-[2.5rem] w-full shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Floating Stat Widget - Hidden on very small screens */}
              <div className="hidden sm:block absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 animate-bounce-slow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-emerald-100 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl md:text-2xl font-black text-slate-900">99.8%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="technology" className="py-20 md:py-32 px-4 md:px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-12 md:mb-20 px-2">
            <div className="max-w-2xl">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-3 md:mb-4">The Stack</h2>
              <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">Precision tools for precision medicine.</p>
            </div>
            <p className="text-base md:text-lg text-slate-500 max-w-sm">We've architected a system that anticipates clinical needs before they arise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 px-2">
            {/* Large Card */}
            <div className="md:col-span-4 bg-white p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-50 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 md:mb-8">
                  <BarChart4 className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Real-time Analytics</h3>
                <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md">
                  Transform every entry into a data point. Visualize diagnosis trends and patient volume without leaving the dashboard.
                </p>
              </div>
            </div>

            {/* Square Card */}
            <div className="md:col-span-2 bg-slate-900 p-8 md:p-10 rounded-3xl md:rounded-[3rem] text-white hover:bg-indigo-900 transition-colors group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center mb-6 md:mb-8">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 tracking-tight">Isolated Privacy</h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                Bank-grade Row Level Security ensures your clinic's data is visible only to your team.
              </p>
            </div>

            {/* Column Cards */}
            <div className="md:col-span-2 bg-indigo-50 p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-indigo-100">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white flex items-center justify-center mb-6 md:mb-8">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Zero-Latency</h3>
              <p className="text-sm md:text-base text-indigo-900/60 leading-relaxed">
                Smart autocomplete learns your common diagnoses, cutting entry time significantly.
              </p>
            </div>

            <div className="md:col-span-4 bg-white p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center mb-6 md:mb-8 mx-auto md:mx-0">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-slate-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Multi-Provider Sync</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                  Collaborate across your entire practice. Synchronize reports between staff instantly.
                </p>
              </div>
              <div className="hidden sm:flex justify-center">
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA */}
      <section className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter">
            Elevate your <br className="hidden sm:block" />
            <span className="text-indigo-600 underline decoration-emerald-400 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">practice standard.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-500 mb-10 md:mb-12 max-w-xl mx-auto">
            Join the elite circle of data-driven clinics today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-2xl bg-slate-900 hover:bg-black h-14 md:h-16 px-10 md:px-12 text-base md:text-lg font-bold">
              <Link to="/admin/signup">Create Your Portal</Link>
            </Button>
            <Button variant="ghost" className="h-14 md:h-16 px-8 text-base md:text-lg font-bold text-slate-500 hover:text-indigo-600">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 md:py-20 border-t border-slate-50 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Logo className="w-7 md:w-8 h-7 md:h-8 rounded-lg" />
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">ClinicLog</span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide">THE CLINICAL LOGGING STANDARD.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs md:text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Protocol</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Status</a>
          </div>

          <div className="text-slate-300 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">
            © {new Date().getFullYear()} DATA IS SECURE.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;