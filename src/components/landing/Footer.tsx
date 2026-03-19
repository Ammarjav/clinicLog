"use client";

import React from 'react';
import { ModemFooter } from '@/components/ui/modem-animated-footer';
import { Mail, Linkedin, MessageCircle, Stethoscope } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = "923106960468";
  
  const navLinks = [
    { label: 'Protocol', href: '/#vision' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
    { label: 'Terms', href: '/terms' },
  ];

  const socialLinks = [
    { 
      icon: <Linkedin className="w-full h-full" />, 
      href: "https://www.linkedin.com/in/m-ammar-javed-07161b394", 
      label: "LinkedIn" 
    },
    { 
      icon: <MessageCircle className="w-full h-full" />, 
      href: `https://wa.me/${whatsappNumber}`, 
      label: "WhatsApp" 
    },
    { 
      icon: <Mail className="w-full h-full" />, 
      href: "mailto:drammarjaved17@gmail.com", 
      label: "Email" 
    },
  ];

  return (
    <ModemFooter
      brandName="ClinicLog"
      brandDescription="The high-performance clinical logging standard. Engineered for precision, privacy, and modern medical practitioners."
      socialLinks={socialLinks}
      navLinks={navLinks}
      creatorName="M. Ammar Javed"
      creatorUrl="https://www.linkedin.com/in/m-ammar-javed-07161b394"
      brandIcon={<Stethoscope className="w-8 h-8 md:w-10 md:h-10 text-white" />}
    />
  );
};

export default Footer;