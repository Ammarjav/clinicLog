"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import PricingSection from '@/components/landing/PricingSection';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PricingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Vision', href: '/#vision' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 overflow-x-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
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

      {/* Mobile Menu */}
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

      <main className="pt-20">
        <PricingSection />
        
        {/* Support Section */}
        <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">Need a custom plan?</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-lg mx-auto">
              If you operate a hospital network or require specialized clinical features, our team can architect a solution tailored to your needs.
            </p>
            <Button asChild size="lg" variant="outline" className="rounded-2xl h-14 px-10 border-slate-200 dark:border-slate-800 font-bold hover:bg-white dark:hover:bg-slate-800">
              <Link to="/contact">Contact Enterprise Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">ClinicLog</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© {new Date().getFullYear()} DATA ENCRYPTED & SECURE.</p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;