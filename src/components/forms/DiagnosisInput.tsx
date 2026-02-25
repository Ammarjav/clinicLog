"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Check, Search, History, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchDiagnoses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('diagnosis')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching diagnoses:", error.message);
    } else if (data) {
      const unique = Array.from(new Set(data.map(p => p.diagnosis)))
        .filter(Boolean) as string[];
      setSuggestions(unique);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    const query = (value || '').toLowerCase().trim();
    if (query === '') {
      setFiltered(suggestions.slice(0, 5));
      return;
    }
    
    const matches = suggestions.filter(s => 
      s.toLowerCase().includes(query)
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
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            fetchDiagnoses();
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="rounded-xl h-11 sm:h-12 pr-10 focus-visible:ring-blue-500 w-full"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1 max-h-[240px] overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3 h-3" />
              {value ? 'Matching Diagnoses' : 'Recent Diagnoses'}
            </div>
            {filtered.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-3 text-sm hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-between group",
                  value.toLowerCase() === suggestion.toLowerCase() && "bg-blue-50/50"
                )}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                <span className="text-gray-700 group-hover:text-blue-700 font-medium truncate pr-2">
                  {suggestion}
                </span>
                {value.toLowerCase() === suggestion.toLowerCase() ? (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisInput;