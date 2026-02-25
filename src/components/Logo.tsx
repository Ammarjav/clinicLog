import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const Logo = ({ className, iconClassName }: LogoProps) => {
  return (
    <div className={cn("bg-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-200", className)}>
      <svg 
        viewBox="0 0 100 100" 
        className={cn("w-full h-full text-white p-1.5", iconClassName)}
        fill="none" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="round"
      >
        <path d="M50 20v60M20 50h60" />
      </svg>
    </div>
  );
};

export default Logo;