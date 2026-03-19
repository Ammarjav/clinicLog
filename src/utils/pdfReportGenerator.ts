"use client";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Patient } from '@/lib/supabase';
import { ReportAnalytics } from './reportDataUtils';

export const generatePdfReport = (
  data: Patient[], 
  analytics: ReportAnalytics, 
  clinicName: string, 
  dateRangeStr: string
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const primaryColor = [79, 70, 229]; // Indigo-600
  const mutedTextColor = [100, 116, 139];
  const darkTextColor = [15, 23, 42];

  // 1. Header Section
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // Indigo side accent
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 4, 55, 'F');

  // Brand Typography (Top Right)
  const brandX = pageWidth - margin - 35;
  const brandY = 22;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Clinic', brandX, brandY);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Log', brandX + 16, brandY);

  // Clinic Header (Top Left)
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(22);
  doc.text(clinicName.toUpperCase(), margin + 5, 22);
  
  doc.setFontSize(9);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('CLINICAL PERFORMANCE & FINANCIAL AUDIT', margin + 5, 29);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`WINDOW: ${dateRangeStr.toUpperCase()}`, margin + 5, 38);
  doc.text(`ISSUED: ${new Date().toLocaleString().toUpperCase()}`, margin + 5, 43);

  // 2. Performance Summary Grid
  let currentY = 70;
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('CORE PERFORMANCE SUMMARY', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['CATEGORY', 'DATA POINT', 'STATUS / BENCHMARK']],
    body: [
      ['GROSS REVENUE', `PKR ${analytics.totalRevenue.toLocaleString()}`, 'VERIFIED'],
      ['PATIENT VOLUME', `${analytics.totalPatients} UNIQUE LOGS`, 'SYNCHRONIZED'],
      ['FINANCIAL YIELD', `PKR ${analytics.avgRevenuePerPatient.toLocaleString()} / PATIENT`, 'OPTIMIZED'],
      ['CLINICAL RETENTION', `${analytics.retentionRate}% LOYALTY RATE`, 'HIGH PERFORMANCE']
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: { 1: { fontStyle: 'bold', textColor: primaryColor } }
  });

  // 3. Demographic Insights
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(13);
  doc.text('POPULATION INTELLIGENCE', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['GENDER', 'COUNT', 'AGE BRACKET', 'COUNT']],
    body: [
      ['MALE', analytics.malePatients.toString(), 'PEDIATRIC (0-18)', analytics.ageGroups.pediatric.toString()],
      ['FEMALE', analytics.femalePatients.toString(), 'YOUNG ADULT (19-35)', analytics.ageGroups.youngAdult.toString()],
      ['OTHER', analytics.otherPatients.toString(), 'ADULT (36-60)', analytics.ageGroups.adult.toString()],
      ['TOTAL', analytics.totalPatients.toString(), 'GERIATRIC (60+)', analytics.ageGroups.geriatric.toString()]
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  // 4. Clinical Distribution
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('DIAGNOSTIC DISTRIBUTION', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['RANK', 'CLINICAL CONDITION', 'VOLUME', 'DENSITY']],
    body: analytics.topConditions.map((c, i) => [
      `#${i + 1}`,
      c.name.toUpperCase(),
      c.count.toString(),
      `${Math.round((c.count / analytics.totalPatients) * 100)}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [241, 245, 249], textColor: darkTextColor, fontSize: 8 },
    styles: { fontSize: 9 }
  });

  // 5. Detailed Appendix (Audit Log)
  currentY = (doc as any).lastAutoTable.finalY + 15;
  
  if (currentY > 230) {
    doc.addPage();
    currentY = 25;
  }

  doc.setFontSize(13);
  doc.text('APPENDIX: DETAILED TRANSACTION LOG', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['NAME', 'GENDER', 'DIAGNOSIS', 'STATUS', 'FEE (PKR)']],
    body: data.map(p => [
      p.name.toUpperCase(),
      p.gender.charAt(0),
      p.diagnosis.toUpperCase(),
      p.visit_type.toUpperCase(),
      Number(p.fee_paid || 0).toLocaleString()
    ]),
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 8, cellPadding: 3 }
  });

  // 6. Professional Footer
  currentY = (doc as any).lastAutoTable.finalY + 15;
  if (currentY > pageHeight - 30) {
    doc.addPage();
    currentY = 25;
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('CONFIDENTIALITY NOTICE: This document contains protected health information (PHI).', margin, currentY + 8);
  doc.text('NOTE: For advanced data manipulation, filtering, and bulk audits, please use the "EXPORT TO EXCEL" tool in your Pro terminal.', margin, currentY + 13);

  // Page Numbers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`PAGE ${i} OF ${totalPages} | CLINICLOG SECURE AUDIT PROTOCOL`, margin, pageHeight - 10);
    doc.text('OFFICIAL DOCUMENT', pageWidth - margin - 35, pageHeight - 10);
  }

  doc.save(`ClinicLog_Audit_${dateRangeStr.replace(/\s/g, '_')}.pdf`);
};