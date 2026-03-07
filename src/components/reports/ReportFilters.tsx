"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, CalendarRange } from 'lucide-react';

interface ReportFiltersProps {
  filterType: 'monthly' | 'custom';
  setFilterType: (type: 'monthly' | 'custom') => void;
  filters: {
    month: string;
    year: string;
    startDate: string;
    endDate: string;
  };
  onChange: (key: string, value: string) => void;
}

const ReportFilters = ({ filterType, setFilterType, filters, onChange }: ReportFiltersProps) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <Card className="p-5 md:p-8 rounded-[2.5rem] border-none shadow-sm bg-white mb-8">
      <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <TabsList className="bg-slate-50 p-1 rounded-2xl h-12 w-full sm:w-auto">
            <TabsTrigger value="monthly" className="flex-1 sm:flex-none rounded-xl px-4 md:px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex-1 sm:flex-none rounded-xl px-4 md:px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CalendarRange className="w-4 h-4 mr-2" />
              Custom
            </TabsTrigger>
          </TabsList>
          
          <div className="md:text-right w-full md:w-auto">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Configuration</h3>
            <p className="text-xs text-slate-500">Define your analytics boundary</p>
          </div>
        </div>

        <TabsContent value="monthly" className="mt-0 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Month</Label>
              <Select value={filters.month} onValueChange={(v) => onChange('month', v)}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-indigo-500/20">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Year</Label>
              <Select value={filters.year} onValueChange={(v) => onChange('year', v)}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-indigo-500/20">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-0 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Date</Label>
              <Input 
                type="date" 
                className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-indigo-500/20"
                value={filters.startDate}
                onChange={(e) => onChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">End Date</Label>
              <Input 
                type="date" 
                className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-indigo-500/20"
                value={filters.endDate}
                onChange={(e) => onChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ReportFilters;