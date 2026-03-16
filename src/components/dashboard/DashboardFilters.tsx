"use client";

import React from 'react';
import { Search, Calendar as CalendarIcon, FilterX, Tags } from 'lucide-react';
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
  category: string;
}

interface DashboardFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  availableCategories?: string[];
}

const DashboardFilters = ({ filters, onFilterChange, onReset, availableCategories = [] }: DashboardFiltersProps) => {
  return (
    <Card className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-3xl shadow-sm dark:shadow-none border-none mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] md:text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Filters</h3>
          <Button 
            variant="ghost" 
            onClick={onReset}
            className="h-8 md:h-10 px-3 md:px-4 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-rose-600 font-bold text-[10px] md:text-xs transition-colors"
          >
            <FilterX className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            Clear
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input 
              placeholder="Search patients or conditions..." 
              className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-indigo-500/20 text-base w-full dark:text-white"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-center gap-3">
            <div className="relative w-full lg:w-[180px]">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <Input 
                type="date" 
                className="pl-12 w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-indigo-500/20 dark:text-white"
                value={filters.date}
                onChange={(e) => onFilterChange('date', e.target.value)}
              />
            </div>

            <Select value={filters.category} onValueChange={(v) => onFilterChange('category', v)}>
              <SelectTrigger className="w-full lg:w-[160px] h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-900">
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.gender} onValueChange={(v) => onFilterChange('gender', v)}>
              <SelectTrigger className="w-full lg:w-[150px] h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 font-medium">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-900">
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.visitType} onValueChange={(v) => onFilterChange('visitType', v)}>
              <SelectTrigger className="w-full lg:w-[160px] h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 font-medium">
                <SelectValue placeholder="Visit Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl dark:bg-slate-900">
                <SelectItem value="all">All Visits</SelectItem>
                <SelectItem value="New">New Patient</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl w-full lg:w-auto">
              <Input 
                type="number" 
                placeholder="Min" 
                className="w-full sm:w-20 h-10 rounded-xl border-none bg-white dark:bg-slate-900 text-sm font-bold dark:text-white"
                value={filters.minAge}
                onChange={(e) => onFilterChange('minAge', e.target.value)}
              />
              <span className="text-slate-300 dark:text-slate-600 font-black text-[10px]">TO</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="w-full sm:w-20 h-10 rounded-xl border-none bg-white dark:bg-slate-900 text-sm font-bold dark:text-white"
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