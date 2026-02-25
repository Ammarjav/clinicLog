"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Check, Search, History, Loader2, AlertCircle } from 'lucide-react';
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
    try {
      // Fetch unique diagnoses that have already been entered
      const { data, error } = await supabase
        .from('patients')
        .select('diagnosis')
        .order('diagnosis', { ascending: true });
        
      if (error) throw error;

      if (data) {
        // Filter out nulls/empties and create a unique list
        const unique = Array.from(new Set(
          data.map(p => p.diagnosis?.trim()).filter(Boolean)
        )) as string[];
        setSuggestions(unique);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions. Check your Supabase RLS policies.", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // Filter logic whenever input or suggestions change
  useEffect(() => {
    const query = (value || '').toLowerCase().trim();
    
    if (query === '') {
      // If empty, show top 5 most recent or just any 5
      setFiltered(suggestions.slice(0, 5));
      return;
    }
    
    // Search for matches anywhere in the string
    const matches = suggestions.filter(s => 
      s.toLowerCase().includes(query)
    );
    
    setFiltered(matches);
  }, [value, suggestions]);

  // Handle clicking outside to close the dropdown
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
      <div className="relative group">
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            fetchDiagnoses(); // Refresh to catch new entries
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="rounded-xl h-11 sm:h-12 pr-10 focus-visible:ring-blue-500 w-full transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          ) : (
            <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          )}
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-[999] w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1 max-h-[280px] overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 mb-1">
              <History className="w-3 h-3" />
              {value ? 'Suggestions' : 'Previous Entries'}
            </div>
            {filtered.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-3 text-sm hover:bg-blue-50/80 rounded-xl transition-all flex items-center justify-between group/item",
                  value.toLowerCase() === suggestion.toLowerCase() && "bg-blue-50"
                )}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                <span className="text-gray-700 group-hover/item:text-blue-700 font-medium truncate pr-4">
                  {suggestion}
                </span>
                {value.toLowerCase() === suggestion.toLowerCase() ? (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-200 group-hover/item:border-blue-300 shrink-0 transition-colors" />
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