import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PatientTableProps {
  patients: any[];
  onEdit: (patient: any) => void;
  onDelete: (id: string) => void;
}

const PatientTable = ({ patients, onEdit, onDelete }: PatientTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = patients.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
      <div className="p-6 flex justify-between items-center border-b border-gray-50">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search patients..." 
            className="pl-10 rounded-xl bg-gray-50 border-none h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-none">
              <TableHead className="py-4">Name</TableHead>
              <TableHead className="py-4">Age</TableHead>
              <TableHead className="py-4">Gender</TableHead>
              <TableHead className="py-4">Visit Type</TableHead>
              <TableHead className="py-4">Diagnosis</TableHead>
              <TableHead className="py-4">Date</TableHead>
              <TableHead className="py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((patient) => (
              <TableRow key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{patient.name || 'Anonymous'}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>
                  <Badge variant={patient.visit_type === 'New' ? 'default' : 'secondary'} className="rounded-lg px-2">
                    {patient.visit_type}
                  </Badge>
                </TableCell>
                <TableCell>{patient.diagnosis}</TableCell>
                <TableCell>{patient.visit_date}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(patient)} className="rounded-xl text-blue-600 hover:bg-blue-50">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(patient.id)} className="rounded-xl text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PatientTable;