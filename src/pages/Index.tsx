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
  CheckCircle2,
  Stethoscope,
  Clock
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">ClinicLog</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Solutions</a>
            <a href="#security" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="rounded-xl font-semibold">
              <Link to="/admin/login">Login</Link>
            </Button>
            <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-semibold px-6">
              <Link to="/admin/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Now HIPAA Compliant</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Streamline your <span className="text-blue-600">Clinic Workflow.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
              The ultimate patient logging system designed for modern healthcare practices. Capture data in seconds, analyze trends in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-2xl bg-blue-600 hover:bg-blue-700 h-16 px-8 text-lg shadow-xl shadow-blue-100">
                <Link to="/admin/signup">
                  Register Your Clinic <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-8 text-lg border-gray-200">
                <Link to="/admin/login">View Demo</Link>
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Joined by <span className="text-gray-900 font-bold">500+</span> Medical Practitioners
              </p>
            </div>
          </div>
          <div className="relative animate-in zoom-in duration-1000">
            <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-3xl -z-10" />
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-gray-50">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
                alt="Clinic Management" 
                className="rounded-[2rem] shadow-inner"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-50 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Success Rate</p>
                    <p className="text-xs text-gray-500">99.9% Data Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</h2>
            <p className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Everything you need to run a data-driven practice</p>
            <p className="text-lg text-gray-500">Built by clinicians, for clinicians. We've stripped away the complexity of traditional EMRs to focus on speed and insight.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "Rapid Entry", 
                desc: "Smart autocomplete and keyboard shortcuts for lightning-fast patient logging.", 
                icon: Zap, 
                color: "text-amber-600", 
                bg: "bg-amber-50" 
              },
              { 
                title: "Advanced Analytics", 
                desc: "Visualize patient volume, demographics, and diagnosis trends instantly.", 
                icon: BarChart4, 
                color: "text-blue-600", 
                bg: "bg-blue-50" 
              },
              { 
                title: "Private & Secure", 
                desc: "Bank-grade encryption and individual clinic isolation with Row Level Security.", 
                icon: ShieldCheck, 
                color: "text-green-600", 
                bg: "bg-green-50" 
              },
              { 
                title: "Multi-Provider", 
                desc: "Easily manage multiple practitioners and staff under a single clinic umbrella.", 
                icon: Users, 
                color: "text-purple-600", 
                bg: "bg-purple-50" 
              },
              { 
                title: "Cross-Device", 
                desc: "Record entries from your mobile or desktop seamlessly during patient visits.", 
                icon: Stethoscope, 
                color: "text-red-600", 
                bg: "bg-red-50" 
              },
              { 
                title: "Automatic History", 
                desc: "Never type the same diagnosis twice. Smart learning improves your speed over time.", 
                icon: Clock, 
                color: "text-indigo-600", 
                bg: "bg-indigo-50" 
              },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">Ready to modernize your clinic?</h2>
            <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto">
              Join hundreds of medical professionals who have ditched paper logs for ClinicLog. Setup takes less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="rounded-2xl bg-white text-blue-600 hover:bg-blue-50 h-16 px-10 text-lg font-bold">
                <Link to="/admin/signup">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold border-white/20 text-white hover:bg-white/10">
                <Link to="/admin/login">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">ClinicLog</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ClinicLog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;