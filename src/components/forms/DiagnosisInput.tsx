"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Check, Search, History } from 'lucide-react';
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

  const fetchDiagnoses = async () => {
    const { data } = await supabase
      .from('patients')
      .select('diagnosis')
      .order('created_at', { ascending: false });
      
    if (data) {
      // Get unique diagnoses, filtered for non-nulls and non-empties
      const unique = Array.from(new Set(data.map(p => p.diagnosis)))
        .filter(Boolean) as string[];
      setSuggestions(unique);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    const query = (value || '').toLowerCase().trim();
    if (query === '') {
      // Show top 5 recent unique diagnoses when input is empty but focused
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
    <div className="relative" ref={containerRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          fetchDiagnoses(); // Refresh list on focus
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="rounded-xl h-11 sm:h-12 pr-10 focus-visible:ring-blue-500"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-4 h-4" />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1 max-h-[240px] overflow-y-auto custom-scrollbar">
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
                <span className="text-gray-700 group-hover:text-blue-700 font-medium">{suggestion}</span>
                {value.toLowerCase() === suggestion.toLowerCase() ? (
                  <Check className="w-4 h-4 text-blue-600" />
                ) : (
                  <Check className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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