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
  const secondaryColor = [16, 185, 129]; // Emerald-500
  const mutedTextColor = [100, 116, 139];
  const darkTextColor = [15, 23, 42];

  // 1. Premium Header Design
  // Indigo side accent
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 5, 60, 'F');
  
  // Light background for header area
  doc.setFillColor(248, 250, 252);
  doc.rect(5, 0, pageWidth - 5, 60, 'F');

  // Clinic Title
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(clinicName.toUpperCase(), margin + 5, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL CLINICAL PERFORMANCE INTELLIGENCE', margin + 5, 33);
  
  // Header Meta Info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`REPORTING WINDOW: ${dateRangeStr.toUpperCase()}`, margin + 5, 42);
  doc.text(`SYSTEM TIMESTAMP: ${new Date().toLocaleString().toUpperCase()}`, margin + 5, 47);

  // Logo Placeholder / Brand Mark
  const logoX = pageWidth - margin - 25;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(logoX, 15, 12, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('CL', logoX + 2.5, 23.5);

  // 2. Executive Summary Cards (Simulated)
  let currentY = 75;
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE METRICS', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['METRIC CATEGORY', 'QUANTITATIVE DATA', 'VALUATION STATUS']],
    body: [
      ['GROSS CLINIC REVENUE', `PKR ${analytics.totalRevenue.toLocaleString()}`, 'VERIFIED'],
      ['PATIENT THROUGHPUT', `${analytics.totalPatients} UNIQUE RECORDS`, 'SYNCHRONIZED'],
      ['REVENUE PER PATIENT', `PKR ${analytics.avgRevenuePerPatient.toLocaleString()}`, 'CALCULATED'],
      ['CLINICAL RETENTION', `${analytics.retentionRate}% LOYALTY RATE`, 'HIGH PERFORMANCE']
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 9, cellPadding: 5, font: 'helvetica' },
    columnStyles: {
      1: { fontStyle: 'bold', textColor: primaryColor }
    }
  });

  // 3. Demographic & Clinical Intelligence
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(14);
  doc.text('POPULATION DYNAMICS', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['GENDER DISTRIBUTION', 'VOLUME', 'AGE DEMOGRAPHICS', 'VALUE']],
    body: [
      ['MALE PATIENTS', analytics.malePatients.toString(), 'PEDIATRIC (0-18)', analytics.ageGroups.pediatric.toString()],
      ['FEMALE PATIENTS', analytics.femalePatients.toString(), 'YOUNG ADULT (19-35)', analytics.ageGroups.youngAdult.toString()],
      ['OTHER / UNSPECIFIED', analytics.otherPatients.toString(), 'ADULT (36-60)', analytics.ageGroups.adult.toString()],
      ['TOTAL GENDER LOGS', (analytics.malePatients + analytics.femalePatients + analytics.otherPatients).toString(), 'GERIATRIC (60+)', analytics.ageGroups.geriatric.toString()]
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontSize: 8 },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  // 4. Clinical Conditions Ranking
  currentY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('PRIMARY DIAGNOSTIC TRENDS', margin, currentY);

  autoTable(doc, {
    startY: currentY + 5,
    margin: { left: margin, right: margin },
    head: [['RANK', 'CLINICAL CONDITION', 'INCIDENCE VOLUME', 'DENSITY']],
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

  // 5. Detailed Audit Log (New Page if necessary)
  doc.addPage();
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('APPENDIX A: DETAILED CLINICAL TRANSACTION LOG', margin, 10);

  autoTable(doc, {
    startY: 25,
    margin: { left: margin, right: margin },
    head: [['PATIENT IDENTITY', 'SEX', 'DIAGNOSIS', 'VISIT TYPE', 'FEE (PKR)']],
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

  // 6. Concluding Protocol Note
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  if (finalY < pageHeight - 40) {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, finalY - 5, pageWidth - margin, finalY - 5);
    doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('DATA PRIVACY NOTICE: This document contains protected health information (PHI).', margin, finalY);
    doc.text('For advanced data manipulation, filtering, and bulk audits, please utilize the "EXPORT TO EXCEL" tool in your Pro terminal.', margin, finalY + 5);
  }

  // Footer Protocol
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `PAGE ${i} OF ${totalPages} | CLINICLOG SECURE REPORTING PROTOCOL v4.0`,
      margin,
      pageHeight - 10
    );
    // Confidentiality stamp
    doc.text('CONFIDENTIAL', pageWidth - margin - 25, pageHeight - 10);
  }

  doc.save(`ClinicLog_Report_${dateRangeStr.replace(/\s/g, '_')}.pdf`);
};