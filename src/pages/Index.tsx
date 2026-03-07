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
  ArrowRight, 
  Sparkles,
  Stethoscope,
  Activity,
  ChevronRight
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-100">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]" />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-100/20 rounded-[2rem] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 rounded-xl" />
            <span className="text-xl font-black text-slate-900 tracking-tighter">Clinic<span className="text-indigo-600">Log</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-500 text-sm">
            <a href="#vision" className="hover:text-indigo-600 transition-colors">Vision</a>
            <a href="#technology" className="hover:text-indigo-600 transition-colors">Technology</a>
            <a href="#security" className="hover:text-indigo-600 transition-colors">Compliance</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="rounded-xl font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600">
              <Link to="/admin/login">Sign In</Link>
            </Button>
            <Button asChild className="rounded-xl bg-slate-900 hover:bg-indigo-600 text-white shadow-lg transition-all px-6">
              <Link to="/admin/signup">Join Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Immersive Centered */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">The Future of Patient Logging</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Efficiency for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Modern Clinics.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            Ditch the paperwork. A high-performance database for medical professionals who value speed, accuracy, and beautiful data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Button asChild size="lg" className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-16 px-10 text-lg font-bold shadow-2xl shadow-indigo-200 group">
              <Link to="/admin/signup">
                Claim Your Clinic Portal <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold border-slate-200 hover:bg-slate-50">
              <Link to="/admin/login">Explore Demo</Link>
            </Button>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto animate-in zoom-in-95 duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-[3rem] blur-2xl opacity-20" />
            <div className="relative bg-white/40 backdrop-blur-sm p-4 rounded-[3rem] border border-white shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000" 
                alt="ClinicLog Interface" 
                className="rounded-[2.5rem] w-full shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Floating Stat Widget */}
              <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl">
                    <Activity className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-black text-slate-900">99.8%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="technology" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">The Stack</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Precision tools for precision medicine.</p>
            </div>
            <p className="text-lg text-slate-500 max-w-sm">We've architected a system that anticipates clinical needs before they arise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Large Card */}
            <div className="md:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8">
                  <BarChart4 className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Real-time Clinical Intelligence</h3>
                <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                  Transform every entry into a data point. Visualize diagnosis trends, age demographics, and patient volume without leaving the dashboard.
                </p>
              </div>
            </div>

            {/* Square Card */}
            <div className="md:col-span-2 bg-slate-900 p-10 rounded-[3rem] text-white hover:bg-indigo-900 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">Isolated Privacy</h3>
              <p className="text-slate-400 leading-relaxed">
                Bank-grade RLS (Row Level Security) ensures your clinic's data is visible only to your team. Always.
              </p>
            </div>

            {/* Column Cards */}
            <div className="md:col-span-2 bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100 hover:border-indigo-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8">
                <Zap className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Zero-Latency Entry</h3>
              <p className="text-indigo-900/60 leading-relaxed">
                Smart autocomplete learns your common diagnoses, cutting entry time by up to 70%.
              </p>
            </div>

            <div className="md:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8">
                  <Users className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Multi-Provider Sync</h3>
                <p className="text-slate-500 leading-relaxed">
                  Collaborate across your entire practice. Synchronize reports between doctors, nurses, and administrative staff instantly.
                </p>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="grid grid-cols-2 gap-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            Elevate your <br/>
            <span className="text-indigo-600 underline decoration-emerald-400 decoration-8 underline-offset-8">practice standard.</span>
          </h2>
          <p className="text-xl text-slate-500 mb-12 max-w-xl mx-auto">
            Join the elite circle of data-driven clinics today. No credit card required to start your portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-2xl bg-slate-900 hover:bg-black h-16 px-12 text-lg font-bold">
              <Link to="/admin/signup">Start My Free Portal</Link>
            </Button>
            <Button variant="ghost" className="h-16 px-8 text-lg font-bold text-slate-500 hover:text-indigo-600">
              Talk to Clinical Support
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-20 border-t border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="text-2xl font-black text-slate-900 tracking-tighter">ClinicLog</span>
            </div>
            <p className="text-sm text-slate-400 font-medium tracking-wide">THE CLINICAL LOGGING STANDARD.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Protocol</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors uppercase tracking-widest">Status</a>
          </div>

          <div className="text-slate-300 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} DATA IS SECURE.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;