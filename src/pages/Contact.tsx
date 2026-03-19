"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ModeToggle } from '@/components/ModeToggle';
import { MessageCircle, Mail, Phone, Sparkles, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', info: '', message: '' });

  const navLinks = [
    { name: 'Vision', href: '/#vision' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "923106960468"; 
    const text = `Hello ClinicLog! %0A%0AMy Name: ${form.name}%0AContact Info: ${form.info}%0A%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 flex flex-col items-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Blurs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[30%] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Modern Navigation */}
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

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 mt-28 md:mt-32">
        <div className="space-y-6 md:space-y-8 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Logo className="w-12 h-12 sm:w-14 sm:h-14" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
              Let's Start a <br />
              <span className="text-indigo-600">Conversation.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto lg:mx-0">
              Whether you're looking for enterprise solutions or have a quick question, our team is ready to help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 pt-2">
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Email Us</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">drammarjaved17@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Line</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">+92 310 6960468</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/20 dark:shadow-none mb-10 lg:mb-0">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Your Identity</label>
              <Input 
                required
                placeholder="Dr. Alexander Wright" 
                className="h-12 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-sm sm:text-base"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Contact Details</label>
              <Input 
                required
                placeholder="alex@clinic.com" 
                className="h-12 sm:h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-sm sm:text-base"
                value={form.info}
                onChange={(e) => setForm({...form, info: e.target.value})}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">The Inquiry</label>
              <Textarea 
                required
                placeholder="How can ClinicLog transform your practice?" 
                className="min-h-[120px] sm:min-h-[140px] rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-indigo-500/20 dark:text-white text-sm sm:text-base resize-none"
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-14 sm:h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-lg shadow-xl shadow-indigo-100/50 dark:shadow-none transition-all active:scale-[0.98] mt-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Start WhatsApp Chat
            </Button>
            <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] pt-1 sm:pt-2">
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