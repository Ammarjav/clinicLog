"use client";

import React from 'react';
import { Search, Calendar as CalendarIcon, FilterX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FilterState {
  search: string;
  gender: string;
  visitType: string;
  minAge: string;
  maxAge: string;
  date: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const DashboardFilters = ({ filters, onFilterChange, onReset }: DashboardFiltersProps) => {
  return (
    <Card className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border-none mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Filters</h3>
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="h-10 px-4 rounded-xl hover:bg-rose-50 text-rose-500 hover:text-rose-600 font-bold text-xs transition-colors"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search patients or conditions..." 
              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-indigo-500/20 text-base"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Date Filter */}
            <div className="relative flex-1 sm:flex-none">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input 
                type="date" 
                className="pl-12 w-full sm:w-[180px] h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-indigo-500/20"
                value={filters.date}
                onChange={(e) => onFilterChange('date', e.target.value)}
              />
            </div>

            {/* Gender Filter */}
            <Select value={filters.gender} onValueChange={(v) => onFilterChange('gender', v)}>
              <SelectTrigger className="flex-1 sm:flex-none w-full sm:w-[150px] h-14 rounded-2xl bg-slate-50 border-none text-slate-600 font-medium">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Visit Type Filter */}
            <Select value={filters.visitType} onValueChange={(v) => onFilterChange('visitType', v)}>
              <SelectTrigger className="flex-1 sm:flex-none w-full sm:w-[160px] h-14 rounded-2xl bg-slate-50 border-none text-slate-600 font-medium">
                <SelectValue placeholder="Visit Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl">
                <SelectItem value="all">All Visits</SelectItem>
                <SelectItem value="New">New Patient</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            {/* Age Range */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl flex-1 sm:flex-none">
              <Input 
                type="number" 
                placeholder="Min Age" 
                className="w-full sm:w-20 h-10 rounded-xl border-none bg-white text-sm font-bold"
                value={filters.minAge}
                onChange={(e) => onFilterChange('minAge', e.target.value)}
              />
              <span className="text-slate-300 font-black text-[10px]">TO</span>
              <Input 
                type="number" 
                placeholder="Max Age" 
                className="w-full sm:w-20 h-10 rounded-xl border-none bg-white text-sm font-bold"
                value={filters.maxAge}
                onChange={(e) => onFilterChange('maxAge', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardFilters;