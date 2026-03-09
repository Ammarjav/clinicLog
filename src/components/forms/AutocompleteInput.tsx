"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Check, Search, History, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectRecord?: (record: any) => void;
  placeholder?: string;
  fieldName: 'name' | 'diagnosis';
  clinicId?: string;
}

const AutocompleteInput = ({ value, onChange, onSelectRecord, placeholder, fieldName, clinicId }: AutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fullDataMap, setFullDataMap] = useState<Record<string, any>>({});
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async () => {
    if (!clinicId) return;
    setIsLoading(true);
    try {
      // If it's a name field, we fetch all columns to enable autofill
      const selectQuery = fieldName === 'name' ? '*' : fieldName;
      
      const { data, error } = await supabase
        .from('patients')
        .select(selectQuery)
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      if (data) {
        const counts: Record<string, number> = {};
        const casings: Record<string, string> = {};
        const records: Record<string, any> = {};
        
        data.forEach((p: any) => {
          const d = p[fieldName]?.trim();
          if (d) {
            const key = d.toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
            if (!casings[key]) {
              casings[key] = d;
              records[key] = p; // Store the latest record for this unique entry
            }
          }
        });

        const sortedNames = Object.keys(counts)
          .sort((a, b) => counts[b] - counts[a])
          .map(key => casings[key]);

        setSuggestions(sortedNames);
        setFullDataMap(records);
      }
    } catch (err) {
      console.error(`${fieldName} fetch error:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [clinicId]);

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
            fetchSuggestions();
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="rounded-xl h-11 sm:h-12 pr-10 focus-visible:ring-blue-500 w-full shadow-sm"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-1 max-h-[240px] overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-50 mb-1">
              <History className="w-3 h-3" />
              {value ? 'Suggestions' : 'Previous Entries'}
            </div>
            {filtered.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className={cn(
                  "w-full text-left px-4 py-3 text-sm hover:bg-blue-50 rounded-xl transition-all flex items-center justify-between group",
                  value.toLowerCase() === suggestion.toLowerCase() && "bg-blue-50"
                )}
                onClick={() => {
                  onChange(suggestion);
                  // Pass the full record back if requested (for autofill)
                  if (onSelectRecord) {
                    onSelectRecord(fullDataMap[suggestion.toLowerCase()]);
                  }
                  setIsOpen(false);
                }}
              >
                <span className="text-gray-700 group-hover:text-blue-700 font-medium truncate pr-2">
                  {suggestion}
                </span>
                {value.toLowerCase() === suggestion.toLowerCase() && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;