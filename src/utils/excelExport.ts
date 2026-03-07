"use client";

import * as XLSX from 'xlsx';
import { Patient } from '@/lib/supabase';

export const exportToExcel = (data: Patient[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(p => ({
      'Patient Name': p.name,
      'Age': p.age,
      'Gender': p.gender,
      'Condition': p.diagnosis,
      'Visit Type': p.visit_type,
      'Visit Date': p.visit_date
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
  
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};