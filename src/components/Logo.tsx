import React from 'react';
import { cn } from '@/lib/utils';
import { Stethoscope } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
}

export const Logo = ({ className, iconClassName }: LogoProps) => {
  return (
    <div className={cn("bg-indigo-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none", className)}>
      <Stethoscope 
        className={cn("w-full h-full text-white p-2.5", iconClassName)}
      />
    </div>
  );
};

export default Logo;