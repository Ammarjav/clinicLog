"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { ArrowLeft, ShieldCheck, HelpCircle, FileText, Ban, RefreshCw } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center py-20 px-6 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-bold text-sm group z-50"
      >
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden md:block">Back to Home</span>
      </Link>

      <div className="w-full max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <Logo className="w-14 h-14" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            Legal <span className="text-indigo-600">Framework.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Last Updated: March 2024</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none space-y-10">
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">1. Acceptable Use</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              ClinicLog is a clinical logging tool designed for medical professionals. By creating a clinic portal, you represent that you are a qualified medical practitioner or authorized administrator. You are responsible for maintaining the confidentiality of your clinic's login credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">2. Data Privacy & HIPAA</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              We employ enterprise-grade Row Level Security (RLS) to ensure your patient data is isolated. While ClinicLog provides the infrastructure for secure logging, users are responsible for ensuring their use of the platform complies with local healthcare regulations (e.g., HIPAA in the USA, local medical council rules).
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-indigo-600">
              <RefreshCw className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">3. Subscription & Payments</h2>
            </div>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              <p>ClinicLog offers tiered subscription plans (Free, Basic, Pro). Payments are processed manually via JazzCash, Easypaisa, or Bank Transfer for transparency and local accessibility.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Activation occurs only after manual verification of the transaction ID.</li>
                <li>Verification typically takes up to 24 hours.</li>
                <li>Your subscription period begins the moment your payment is verified and your plan is activated.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
              <Ban className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">4. Refund Policy</h2>
            </div>
            <div className="space-y-4 text-indigo-900/70 dark:text-indigo-300 font-medium">
              <p>Due to the manual verification process and the nature of digital SaaS services:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All payments submitted for verification are final once approved.</li>
                <li>If a payment is rejected, the user will be notified and may resubmit a valid transaction ID. No funds are held by ClinicLog for rejected IDs.</li>
                <li>No refunds are provided for partially used subscription months.</li>
                <li>If you wish to cancel your plan, you may do so at any time; however, access will remain until the end of the current billing cycle and no pro-rata refund will be issued.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-400">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight">5. Contact Support</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              For any legal inquiries or payment disputes, please contact our administrative team directly via the <Link to="/contact" className="text-indigo-600 hover:underline">Contact Page</Link>.
            </p>
          </section>

        </div>

        <p className="text-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
          PROTECTING CLINICAL INTEGRITY SINCE 2024
        </p>
      </div>
    </div>
  );
};

export default Terms;