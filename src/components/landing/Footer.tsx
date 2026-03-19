"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Mail, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "923106960468";
  
  const navLinks = [
    { name: 'Protocol', href: '/#vision' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
    { name: 'Terms', href: '/terms' },
  ];

  const contactLinks = [
    { 
      name: 'Email', 
      label: 'drammarjaved17@gmail.com', 
      href: 'mailto:drammarjaved17@gmail.com', 
      icon: Mail 
    },
    { 
      name: 'LinkedIn', 
      label: 'Professional Profile', 
      href: 'https://www.linkedin.com/in/m-ammar-javed-07161b394', 
      icon: Linkedin 
    },
    { 
      name: 'WhatsApp', 
      label: 'Start a Chat', 
      href: `https://wa.me/${whatsappNumber}`, 
      icon: MessageCircle 
    },
  ];

  return (
    <footer className="py-16 md:py-24 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="w-9 h-9 rounded-xl" />
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">ClinicLog</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-xs">
              Setting the standard for clinical data management. Built for practitioners who value precision and privacy.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 w-fit rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-widest">Database Secure</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:pl-12">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">Platform</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/#') ? (
                    <a href={link.href} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-8">Direct Access</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactLinks.map((contact) => (
                <a 
                  key={contact.name}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                      <contact.icon size={20} />
                    </div>
                    <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-all" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contact.name}</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{contact.label}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} CLINICLOG PROTOCOL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/terms" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest">Privacy</Link>
            <Link to="/terms" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;