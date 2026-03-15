"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Phone, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';

interface PatientTableProps {
  patients: any[];
  onEdit: (patient: any) => void;
  onDelete: (id: string) => void;
}

const PatientTable = ({ patients, onEdit, onDelete }: PatientTableProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 dark:shadow-none border border-slate-50 dark:border-slate-800 animate-in fade-in duration-700 overflow-hidden">
      {/* Scrollable Container with Fixed Max Height */}
      <div className="max-h-[650px] overflow-y-auto overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-md">
            <TableRow className="border-none">
              <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Patient Name</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Contact</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Age / Gender</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Visit Status</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Primary Diagnosis</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Visit Date</TableHead>
              <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => {
                const isPending = patient.diagnosis === 'Pending Documentation';
                
                return (
                  <TableRow key={patient.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all border-b border-slate-50 dark:border-slate-800 group">
                    <TableCell className="px-8 py-5">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{patient.name || 'Anonymous'}</span>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-sm font-medium">{patient.phone || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 text-sm">{patient.age} Yrs</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          patient.gender === 'Male' ? 'text-blue-600 dark:text-blue-400' : 
                          patient.gender === 'Female' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {patient.gender}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <Badge variant={patient.visit_type === 'New' ? 'default' : 'secondary'} className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-none border-none">
                        {patient.visit_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      {isPending ? (
                        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs animate-pulse">
                          <AlertCircle className="w-4 h-4" />
                          <span>Action Required</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-medium line-clamp-1 max-w-[150px]">{patient.diagnosis}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-5 text-slate-400 dark:text-slate-500 text-sm font-medium">
                      {new Date(patient.visit_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(patient)} 
                          className={cn(
                            "rounded-xl h-9 w-9 transition-all",
                            isPending 
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100 ring-2 ring-rose-200" 
                            : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          )}
                          title={isPending ? "Complete Prescription" : "Edit Record"}
                        >
                          {isPending ? <FileText className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)} className="rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 h-9 w-9">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <p className="text-slate-400 dark:text-slate-600 font-bold uppercase text-xs tracking-widest">No matching records</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientTable;