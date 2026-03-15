"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { 
  ShieldCheck, 
  BarChart4, 
  Sparkles,
  Activity,
  ChevronRight,
  Target,
  Heart,
  Globe,
  FileText,
  MousePointer2,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Vision', href: '#vision' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 overflow-x-hidden scroll-smooth">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[5%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[50%] md:w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-2xl md:rounded-[2rem] px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 md:gap-3">
            <Logo className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl" />
            <span className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic<span className="text-indigo-600">Log</span></span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-500 dark:text-slate-400 text-sm">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a key={link.name} href={link.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.name}</a>
              ) : (
                <Link key={link.name} to={link.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.name}</Link>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <ModeToggle />
              <Button variant="ghost" asChild className="rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm h-10">
                <Link to="/admin/login">Sign In</Link>
              </Button>
            </div>
            
            <Button asChild className="hidden sm:flex rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400 text-white shadow-lg dark:shadow-none transition-all px-6 text-sm h-10">
              <Link to="/admin/signup">Join Now</Link>
            </Button>

            {/* Hamburger Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-xl h-10 w-10 text-slate-600 dark:text-slate-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-white dark:bg-slate-950 backdrop-blur-2xl flex flex-col p-6 pt-24">
              <div className="space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {link.href.startsWith('#') ? (
                      <a 
                        href={link.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xl font-semibold text-slate-600 dark:text-slate-300 block px-4 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link 
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xl font-semibold text-slate-600 dark:text-slate-300 block px-4 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-4 pb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-500">Appearance</span>
                  <ModeToggle />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" asChild className="rounded-xl h-12 font-bold text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/admin/login">Sign In</Link>
                  </Button>
                  <Button asChild className="rounded-xl h-12 font-bold bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/admin/signup">Join Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-24 md:pt-36 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 md:px-4 py-1.5 rounded-full shadow-sm mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">The Future of Patient Logging</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.2] md:leading-[1.2] tracking-tight mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            Efficiency for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Modern Clinics.</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4">
            Ditch the paperwork. A high-performance database for medical professionals who value speed, accuracy, and beautiful data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 animate-in fade-in slide-in-from-bottom-16 duration-1000 px-4">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold shadow-2xl shadow-indigo-200 dark:shadow-none group">
              <Link to="/admin/signup" className="flex items-center justify-center">
                Get Started <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
              <Link to="/admin/signup">Explore Demo</Link>
            </Button>
          </div>

          {/* Floating Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto animate-in zoom-in-95 duration-1000 px-2 md:px-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl md:rounded-[3rem] blur-xl md:blur-2xl opacity-20" />
            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-2 md:p-4 rounded-3xl md:rounded-[3rem] border border-white dark:border-slate-800 shadow-2xl dark:shadow-none overflow-hidden group">
              <div className="absolute inset-0 bg-slate-900/5 dark:bg-white/5 group-hover:bg-transparent transition-colors duration-700" />
              <img 
                src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                alt="ClinicLog Interface" 
                className="rounded-2xl md:rounded-[2.5rem] w-full shadow-2xl dark:shadow-none transition-all duration-700 object-cover aspect-[21/9]"
              />
              {/* Floating Stat Widget */}
              <div className="hidden sm:block absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl dark:shadow-none border border-white/50 dark:border-slate-800 animate-bounce-slow">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">99.8%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-indigo-100/50 dark:bg-indigo-900/10 rounded-[3rem] blur-2xl -z-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/20 dark:shadow-none border border-slate-50 dark:border-slate-800">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Clarity</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Removing noise to focus on patient outcomes.</p>
              </div>
              <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl dark:shadow-none text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-xl font-black mb-2">Empathy</h4>
                <p className="text-sm text-slate-400 font-medium">Built with the medical journey in mind.</p>
              </div>
              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl dark:shadow-none text-white sm:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-black">Universal Access</h4>
                </div>
                <p className="text-base text-indigo-50 font-medium">Empowering healthcare providers globally with enterprise-grade tools, simplified for every scale.</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Our Vision</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              The Protocol of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Human Connection.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              We believe technology shouldn't come between a doctor and their patient. Our vision is to create a seamless digital layer that handles the complexity of data while leaving the space for care.
            </p>
            <div className="pt-2 flex items-center gap-8">
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">50k+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Daily Logs</p>
              </div>
              <div className="w-px h-12 bg-slate-100 dark:bg-slate-800" />
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white">200+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinics Syncing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-12 md:py-20 px-4 md:px-6 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-8 md:mb-12 px-2">
            <div className="max-w-2xl">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 md:mb-3">The Platform</h2>
              <p className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Precision tools for modern medicine.</p>
            </div>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-sm">We've architected a system that simplifies clinical data management forever.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 px-2">
            {/* Professional Reporting */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6 md:mb-8">
                  <FileText className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight">Professional Reports</h3>
                <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                  Generate beautiful PDF or Excel reports instantly. Filter by month or custom date ranges to document your clinic's performance for administration.
                </p>
              </div>
            </div>

            {/* Smart Security */}
            <div className="md:col-span-2 bg-slate-900 dark:bg-indigo-950 p-8 md:p-10 rounded-3xl md:rounded-[3rem] text-white hover:bg-indigo-900 transition-colors group">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center mb-6 md:mb-8">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 tracking-tight">Secure RLS Privacy</h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                Bank-grade Row Level Security ensures your clinic's data is isolated and visible only to your authorized team members.
              </p>
            </div>

            {/* Smart Autocomplete */}
            <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-950/40 p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-indigo-100 dark:border-indigo-900/50">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 md:mb-8">
                <MousePointer2 className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight">Smart Entry</h3>
              <p className="text-sm md:text-base text-indigo-900/60 dark:text-indigo-300 leading-relaxed">
                Our smart autocomplete engine learns your most common diagnoses, cutting down patient registration time to seconds.
              </p>
            </div>

            {/* Live Analytics */}
            <div className="md:col-span-4 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center overflow-hidden relative">
              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 md:mb-8 mx-auto md:mx-0">
                  <BarChart4 className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-3 md:mb-4 tracking-tight">Live Analytics</h3>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  Visualize your patient volume trends, gender distribution, and age demographics in real-time with high-performance charts.
                </p>
              </div>
              <div className="hidden sm:flex justify-center flex-1">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 w-full rotate-2">
                  <div className="flex gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-100 dark:bg-indigo-900/40 rounded-full w-[80%]" />
                    <div className="h-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-full w-[60%]" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-[90%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 md:mb-8 tracking-tighter">
            Elevate your <br className="hidden sm:block" />
            <span className="text-indigo-600 dark:text-indigo-400 underline decoration-emerald-400 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">practice standard.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 mb-8 md:mb-10 max-w-xl mx-auto">
            Join the elite circle of data-driven clinics today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-indigo-100 h-14 md:h-16 px-10 md:px-12 text-base md:text-lg font-bold shadow-xl shadow-slate-200 dark:shadow-none transition-all active:scale-[0.98]">
              <Link to="/admin/signup">Create Your Portal</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-14 md:h-16 px-8 text-base md:text-lg font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 md:py-16 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Logo className="w-7 md:w-8 h-7 md:h-8 rounded-lg" />
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter">ClinicLog</span>
            </div>
            <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">The clinical logging standard.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500">
            <a href="#vision" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Protocol</a>
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Features</a>
            <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Contact</Link>
            <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase tracking-widest">Terms</Link>
          </div>

          <div className="text-slate-300 dark:text-slate-700 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">
            © {new Date().getFullYear()} DATA IS SECURE.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;