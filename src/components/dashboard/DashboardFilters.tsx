"use client";

import React from 'react';
import { Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by name or diagnosis..." 
            className="pl-10 rounded-xl bg-gray-50 border-none h-11 focus-visible:ring-blue-500"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input 
            type="date" 
            className="pl-10 w-[180px] rounded-xl bg-gray-50 border-none h-11 focus-visible:ring-blue-500"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
          />
        </div>

        {/* Gender Filter */}
        <Select value={filters.gender} onValueChange={(v) => onFilterChange('gender', v)}>
          <SelectTrigger className="w-[140px] rounded-xl bg-gray-50 border-none h-11">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Visit Type Filter */}
        <Select value={filters.visitType} onValueChange={(v) => onFilterChange('visitType', v)}>
          <SelectTrigger className="w-[160px] rounded-xl bg-gray-50 border-none h-11">
            <SelectValue placeholder="Visit Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Visits</SelectItem>
            <SelectItem value="New">New Patient</SelectItem>
            <SelectItem value="Follow-up">Follow-up</SelectItem>
          </SelectContent>
        </Select>

        {/* Age Range */}
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
          <Input 
            type="number" 
            placeholder="Min Age" 
            className="w-20 rounded-lg border-none bg-white h-9 text-sm"
            value={filters.minAge}
            onChange={(e) => onFilterChange('minAge', e.target.value)}
          />
          <span className="text-gray-400 text-xs font-bold px-1">to</span>
          <Input 
            type="number" 
            placeholder="Max Age" 
            className="w-20 rounded-lg border-none bg-white h-9 text-sm"
            value={filters.maxAge}
            onChange={(e) => onFilterChange('maxAge', e.target.value)}
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onReset}
          className="rounded-xl hover:bg-gray-100 text-gray-400"
          title="Reset Filters"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardFilters;