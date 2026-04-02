"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
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
  Menu,
  X,
  CalendarClock,
  Banknote,
  Stethoscope,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    viewport: { once: true, margin: "-50px" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { 
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1 
      } 
    },
    viewport: { once: true, amount: 0.2 }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 overflow-x-hidden scroll-smooth text-left">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[5%] -left-[10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[50%] md:w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-2xl md:rounded-[2rem] px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 md:gap-3">
            <Logo className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl" />
            <span className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic<span className="text-indigo-600">Log</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-500 dark:text-slate-400 text-sm">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.name}</Link>
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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-white dark:bg-slate-950 backdrop-blur-2xl flex flex-col p-6 pt-24 text-left">
              <div className="space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link 
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-semibold text-slate-600 dark:text-slate-300 block px-4 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-auto space-y-4 pb-8">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" asChild className="rounded-xl h-12 font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
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

      <section className="pt-24 md:pt-36 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 md:px-4 py-1.5 rounded-full shadow-sm mb-6 md:mb-8"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest text-center">10-Day Full Access Trial Now Live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.2] md:leading-[1.2] tracking-tight mb-6 md:mb-8"
          >
            Efficiency for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Modern Clinics.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12"
          >
            Ditch the paperwork. A high-performance database for medical professionals. Start your <strong>unrestricted 10-day trial</strong> today.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16"
          >
            <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold shadow-2xl shadow-indigo-100 dark:shadow-none group">
              <Link to="/admin/signup" className="flex items-center justify-center">
                Start 10-Day Trial <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
              <Link to="/pricing">View Plans</Link>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl blur-xl md:blur-2xl opacity-20" />
            <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-2 md:p-4 rounded-3xl border border-white dark:border-slate-800 shadow-2xl dark:shadow-none overflow-hidden group text-center">
              <img 
                src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                alt="ClinicLog Interface" 
                className="rounded-3xl w-full shadow-2xl dark:shadow-none transition-all duration-700 object-cover aspect-[21/9]"
              />
              <div className="hidden sm:block absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 md:p-6 rounded-3xl shadow-2xl dark:shadow-none border border-white/50 dark:border-slate-800 animate-bounce-slow text-left">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 md:p-3 rounded-2xl">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">99.8%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-6 bg-slate-50/50 dark:bg-slate-950/50 text-left">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-12 md:mb-16 px-2"
          >
            <div className="max-w-2xl text-left">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-2 md:mb-3">Clinical Engine</h2>
              <p className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Tools that think like <span className="text-indigo-600">you.</span></p>
            </div>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-sm">Try every feature for free for 10 days. No restrictions, just pure performance.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 px-2"
          >
            <motion.div variants={fadeInUp} className="md:col-span-3 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CalendarClock size={160} className="text-indigo-600" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                  <CalendarClock className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4">One-Click Protocol</div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Recovery Monitoring</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Identify patients who haven't returned for care. Send personalized WhatsApp check-ins or snooze reminders with a single click.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-3 bg-slate-900 dark:bg-indigo-950 p-8 md:p-10 rounded-[2.5rem] text-white hover:shadow-2xl hover:shadow-indigo-500/20 transition-all group relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-6 opacity-20">
                <TrendingUp size={140} className="text-emerald-400" />
              </div>
              <div className="relative z-10 text-left">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <BarChart4 className="w-6 h-6 md:w-7 md:h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Revenue Insights</h3>
                <p className="text-slate-400 leading-relaxed">
                  Deep-dive into your practice's financial health. Track revenue splits between new visits and follow-ups with automated daily trends.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Banknote className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Fee Settings</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Configure custom rates for consultations and sessions. Analytics sync instantly with your pricing logic.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="md:col-span-4 bg-indigo-50 dark:bg-indigo-950/40 p-8 md:p-10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
              <div className="flex-1 text-left relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6">
                  <Stethoscope className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Patient Clinical Notes</h3>
                <p className="text-indigo-900/60 dark:text-indigo-300 leading-relaxed">
                  Comprehensive documentation including chief complaints, physical examination, and detailed treatment plans for every patient visit.
                </p>
              </div>
              <div className="hidden sm:flex justify-center flex-1 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-800 w-full">
                  <div className="space-y-2">
                    <div className="h-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full w-[40%]" />
                    <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-full" />
                    <div className="h-4 bg-slate-50 dark:bg-slate-800 rounded-lg w-[80%]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <PricingSection />

      <Footer />
    </div>
  );
};

export default Index;