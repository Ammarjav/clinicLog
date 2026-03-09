import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const Logo = ({ className, iconClassName }: LogoProps) => {
  return (
    <div className={cn("bg-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className={cn("w-full h-full text-white p-2", iconClassName)}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="14" 
        strokeLinecap="round"
      >
        <path d="M50 20v60M20 50h60" />
      </svg>
    </div>
  );
};

export default Logo;