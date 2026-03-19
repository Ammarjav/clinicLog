"use client";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const ModemFooter = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}: FooterProps) => {
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer className="border-t bg-background mt-20 relative">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full">
            <div className="w-full flex flex-col items-center">
              <div className="space-y-2 flex flex-col items-center flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-4xl font-black tracking-tighter">
                    {brandName}
                  </span>
                </div>
                <p className="text-muted-foreground font-semibold text-center w-full max-w-sm sm:w-96 px-4 sm:px-0 text-sm">
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-6 gap-6">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-indigo-600 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-6 h-6 hover:scale-125 duration-300">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs font-black uppercase tracking-widest text-muted-foreground max-w-full px-4">
                  {navLinks.map((link, index) => (
                    link.href.startsWith('#') || link.href.startsWith('/#') ? (
                       <a
                        key={index}
                        className="hover:text-indigo-600 duration-300 transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        className="hover:text-indigo-600 duration-300 transition-colors"
                        to={link.href}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col gap-2 md:gap-1 items-center justify-center md:flex-row md:items-center md:justify-between px-4 md:px-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-center md:text-left">
              ©{new Date().getFullYear()} {brandName.toUpperCase()} PROTOCOL. ALL RIGHTS RESERVED.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground hover:text-indigo-600 transition-colors duration-300"
                >
                  Crafted by {creatorName}
                </a>
              </nav>
            )}
          </div>
        </div>

        {/* Large background text */}
        <div 
          className="bg-gradient-to-b from-foreground/10 via-foreground/5 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-40 md:bottom-32 font-black tracking-tighter pointer-events-none select-none text-center px-4"
          style={{
            fontSize: 'clamp(3rem, 15vw, 12rem)',
            maxWidth: '95vw'
          }}
        >
          {brandName.toUpperCase()}
        </div>

        {/* Bottom logo */}
        <div className="absolute hover:border-indigo-600 duration-500 drop-shadow-[0_0px_25px_rgba(99,102,241,0.2)] bottom-24 md:bottom-20 backdrop-blur-md rounded-[2rem] bg-background/60 left-1/2 border border-border flex items-center justify-center p-4 -translate-x-1/2 z-10 group">
          <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
             {brandIcon}
          </div>
        </div>

        {/* Decoration lines */}
        <div className="absolute bottom-32 sm:bottom-34 backdrop-blur-sm h-px bg-gradient-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2"></div>
        <div className="bg-gradient-to-t from-background via-background/90 blur-[2em] to-transparent absolute bottom-0 w-full h-48 pointer-events-none"></div>
      </footer>
    </section>
  );
};