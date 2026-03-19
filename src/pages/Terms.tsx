"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import Footer from '@/components/landing/Footer';
import { ShieldCheck, HelpCircle, FileText, Ban, RefreshCw, Menu, X, CreditCard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Terms = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Vision', href: '/#vision' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center py-20 px-6 relative overflow-hidden transition-colors duration-500 text-left">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Modern Navigation */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[94%] max-w-6xl z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none rounded-2xl md:rounded-[2rem] px-4 md:px-6 h-14 md:h-16 flex items-center justify-between text-left">
          <Link to="/" className="flex items-center gap-1.5 md:gap-3">
            <Logo className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl" />
            <span className="text-base md:text-xl font-black text-slate-900 dark:text-white tracking-tighter">Clinic<span className="text-indigo-600">Log</span></span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 font-semibold text-slate-500 dark:text-slate-400 text-sm">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 text-left">
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

      {/* Mobile Menu Overlay */}
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
                      className="text-xl font-semibold text-slate-600 dark:text-slate-300 block px-4 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-left"
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

      <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-16 md:mt-24 mb-20 text-left">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Logo className="w-14 h-14" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            Legal <span className="text-indigo-600">Framework.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Last Updated: March 2024</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none space-y-10 text-left">
          
          <section className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">1. Acceptable Use</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              ClinicLog is a clinical logging tool designed for medical professionals. By creating a clinic portal, you represent that you are a qualified medical practitioner or authorized administrator. You are responsible for maintaining the confidentiality of your clinic's login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-emerald-600">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">2. Data Privacy & HIPAA</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We employ enterprise-grade Row Level Security (RLS) to ensure your patient data is isolated. While ClinicLog provides the infrastructure for secure logging, users are responsible for ensuring their use of the platform complies with local healthcare regulations (e.g., HIPAA in the USA, local medical council rules).
            </p>
          </section>

          <section className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-indigo-600">
              <RefreshCw className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">3. Subscription & Payments</h2>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>ClinicLog offers tiered subscription plans (Free, Basic, Pro). Payments are processed by our secure billing partners. By subscribing to a paid plan, you agree to provide valid payment information and authorize recurring billing if applicable.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Paid plans are activated immediately upon successful transaction verification.</li>
                <li>Subscriptions are billed in advance on a recurring monthly basis unless canceled.</li>
                <li>Prices are subject to change with 30 days' notice to active subscribers.</li>
              </ul>
            </div>
          </section>

          {/* Optimized for Paddle Verification */}
          <section className="space-y-6 p-8 md:p-10 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/20 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard size={120} className="text-indigo-600" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                <Ban className="w-6 h-6" />
                <h2 className="text-2xl font-black tracking-tight text-left">4. Refund and Cancellation Policy</h2>
              </div>
              
              <div className="space-y-6 text-slate-700 dark:text-slate-300 font-medium">
                <div className="space-y-2">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" /> 14-Day Refund Guarantee
                  </h3>
                  <p className="leading-relaxed">
                    We want you to be confident in your clinical tools. If ClinicLog does not meet your expectations, you may request a full refund within **14 calendar days** of your initial purchase or upgrade. 
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black">Subscription Cancellation</h3>
                  <p className="leading-relaxed">
                    You may cancel your subscription at any time. To cancel, navigate to the **Subscription** tab in your clinic dashboard and select "Cancel Plan" or contact our support team. Upon cancellation, your plan will remain active for the remainder of your current paid billing period, after which no further charges will occur.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black">Refund Eligibility</h3>
                  <p className="leading-relaxed text-sm md:text-base">
                    Refunds are issued to the original payment method. To remain eligible for a refund within the 14-day window:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                    <li>The request must be for the initial subscription term.</li>
                    <li>The clinic must not have utilized bulk data export features or generated more than 10 professional PDF reports.</li>
                    <li>Subscription renewals are generally non-refundable unless required by local law.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black">How to Request a Refund</h3>
                  <p className="leading-relaxed">
                    To request a refund, please email <span className="font-black text-indigo-600 dark:text-indigo-400">billing@cliniclog.com</span> from your registered administrator email address. Please include your Clinic Name and the Order ID provided in your receipt.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black">Refund Processing</h3>
                  <p className="leading-relaxed text-sm">
                    Approved refunds are processed immediately. Depending on your financial institution, the funds typically appear on your original payment statement within **5 to 10 business days**.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-slate-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight text-left">5. Contact Support</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              For any legal inquiries, technical support, or billing disputes, please contact our administrative team via the <Link to="/contact" className="text-indigo-600 hover:underline">Contact Page</Link> or email <span className="text-indigo-600">support@cliniclog.com</span>.
            </p>
          </section>

        </div>

        <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] mt-12 mb-20 text-center w-full">
          PROTECTING CLINICAL INTEGRITY SINCE 2024
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;