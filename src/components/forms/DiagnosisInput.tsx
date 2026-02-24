"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosisInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DiagnosisInput = ({ value, onChange, placeholder }: DiagnosisInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const { data } = await supabase.from('patients').select('diagnosis');
      if (data) {
        const unique = Array.from(new Set(data.map(p => p.diagnosis))).filter(Boolean);
        setSuggestions(unique);
      }
    };
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    if (value.trim() === '') {
      setFiltered([]);
      return;
    }
    const matches = suggestions.filter(s => 
      s.toLowerCase().includes(value.toLowerCase()) && 
      s.toLowerCase() !== value.toLowerCase()
    );
    setFiltered(matches);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="rounded-xl h-12 pr-10"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-4 h-4" />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 max-h-[200px] overflow-y-auto">
            {filtered.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group"
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                <span className="text-gray-700 group-hover:text-blue-700 font-medium">{suggestion}</span>
                <Check className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisInput;