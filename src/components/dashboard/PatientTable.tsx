"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatientTableProps {
  patients: any[];
  onEdit: (patient: any) => void;
  onDelete: (id: string) => void;
}

const PatientTable = ({ patients, onEdit, onDelete }: PatientTableProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/20 overflow-hidden border-none animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-none">
              <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Patient Name</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Age</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Gender</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Visit Status</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Diagnosis</TableHead>
              <TableHead className="py-6 px-4 font-black text-[10px] uppercase tracking-widest text-slate-400">Visit Date</TableHead>
              <TableHead className="py-6 px-8 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-indigo-50/30 transition-all border-b border-slate-50 group">
                  <TableCell className="px-8 py-5">
                    <span className="font-bold text-slate-900 text-base">{patient.name || 'Anonymous'}</span>
                  </TableCell>
                  <TableCell className="px-4 py-5 font-semibold text-slate-500">{patient.age}</TableCell>
                  <TableCell className="px-4 py-5">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      patient.gender === 'Male' ? 'bg-blue-50 text-blue-600' : 
                      patient.gender === 'Female' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {patient.gender}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    <Badge variant={patient.visit_type === 'New' ? 'default' : 'secondary'} className="rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-none border-none">
                      {patient.visit_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-5">
                    <span className="text-slate-600 font-medium line-clamp-1 max-w-[200px]">{patient.diagnosis}</span>
                  </TableCell>
                  <TableCell className="px-4 py-5 text-slate-400 text-sm font-medium">
                    {new Date(patient.visit_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} className="rounded-xl text-indigo-600 hover:bg-indigo-50 h-9 w-9">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)} className="rounded-xl text-rose-600 hover:bg-rose-50 h-9 w-9">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching records</p>
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