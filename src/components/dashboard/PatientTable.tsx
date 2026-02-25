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
    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-none">
              <TableHead className="py-4 font-bold text-gray-600">Name</TableHead>
              <TableHead className="py-4 font-bold text-gray-600">Age</TableHead>
              <TableHead className="py-4 font-bold text-gray-600">Gender</TableHead>
              <TableHead className="py-4 font-bold text-gray-600">Visit Type</TableHead>
              <TableHead className="py-4 font-bold text-gray-600">Diagnosis</TableHead>
              <TableHead className="py-4 font-bold text-gray-600">Date</TableHead>
              <TableHead className="py-4 text-right font-bold text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                  <TableCell className="font-medium text-gray-900">{patient.name || 'Anonymous'}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      patient.gender === 'Male' ? 'bg-blue-50 text-blue-700' : 
                      patient.gender === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {patient.gender}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={patient.visit_type === 'New' ? 'default' : 'secondary'} className="rounded-lg px-2 shadow-none">
                      {patient.visit_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{patient.diagnosis}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(patient.visit_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} className="rounded-xl text-blue-600 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)} className="rounded-xl text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-400">
                  No patient records found matching the filters.
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