"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageCircle, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', info: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "923106960468"; 
    const text = `Hello ClinicLog! %0A%0AMy Name: ${form.name}%0AContact Info: ${form.info}%0A%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
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

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-8 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Logo className="w-14 h-14" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              Let's Start a <br />
              <span className="text-indigo-600">Conversation.</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto lg:mx-0">
              Whether you're looking for enterprise solutions or have a quick question, our team is ready to help.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Us</p>
                <p className="font-bold text-slate-900 dark:text-white">hello@cliniclog.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Line</p>
                <p className="font-bold text-slate-900 dark:text-white">+92 310 6960468</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Your Identity</label>
              <Input 
                required
                placeholder="Dr. Alexander Wright" 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-base"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Contact Details</label>
              <Input 
                required
                placeholder="alex@clinic.com" 
                className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-base"
                value={form.info}
                onChange={(e) => setForm({...form, info: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">The Inquiry</label>
              <Textarea 
                required
                placeholder="How can ClinicLog transform your practice?" 
                className="min-h-[140px] rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-base resize-none"
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-100/50 dark:shadow-none transition-all active:scale-[0.98] mt-2">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat on WhatsApp
            </Button>
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] pt-2">
              <Sparkles className="w-3 h-3" />
              Priority Response Protocol
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;