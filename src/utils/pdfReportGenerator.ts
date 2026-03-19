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
  const margin = 15;
  const primaryColor = [79, 70, 229]; // Indigo-600

  // 1. Header
  doc.setFillColor(252, 252, 253);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(clinicName, margin, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('COMPREHENSIVE CLINICAL & FINANCIAL PERFORMANCE REPORT', margin, 28);
  
  doc.setFontSize(9);
  doc.text(`Reporting Period: ${dateRangeStr}`, margin, 34);
  doc.text(`Generation Protocol: ${new Date().toLocaleString()}`, margin, 38);

  const logoX = pageWidth - margin - 35;
  doc.setFillColor(79, 70, 229);
  doc.roundedRect(logoX, 12, 8, 8, 2, 2, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(logoX + 4, 14, logoX + 4, 18);
  doc.line(logoX + 2, 16, logoX + 6, 16);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ClinicLog', logoX + 10, 18);

  // 2. Financial & Volume Summary
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text('Core Metrics Summary', margin, 55);

  autoTable(doc, {
    startY: 60,
    margin: { left: margin, right: margin },
    head: [['Clinical Category', 'Volume/Value', 'Status']],
    body: [
      ['Total Patient Records', analytics.totalPatients.toString(), 'Synchronized'],
      ['Gross Revenue (PKR)', `Rs. ${analytics.totalRevenue.toLocaleString()}`, 'Verified'],
      ['Average Revenue Per Patient', `Rs. ${analytics.avgRevenuePerPatient.toLocaleString()}`, 'Calculated'],
      ['New Patient Intake', analytics.newPatients.toString(), `${analytics.growthRate}% Growth`],
      ['Patient Retention Rate', `${analytics.retentionRate}%`, 'High Loyalty']
    ],
    theme: 'grid',
    headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  // 3. Clinical Analytics Breakdown
  const clinicalY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Advanced Clinical Intelligence', margin, clinicalY);

  autoTable(doc, {
    startY: clinicalY + 5,
    margin: { left: margin, right: margin },
    head: [['Clinical KPI', 'Metric Value']],
    body: [
      ['Avg. Sessions Per Patient', `${analytics.avgSessionsPerPatient} Sessions`],
      ['Busiest Clinical Day', analytics.busiestDay],
      ['Returning Patient Volume', `${analytics.returningPatientPercent}% of Total`],
      ['Average Patient Age', `${analytics.avgAge} Years`],
      ['Top Clinical Condition', analytics.topConditions[0]?.name || 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255] },
    styles: { fontSize: 9 }
  });

  // 4. Demographic Distribution
  const demoY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Population Demographics', margin, demoY);

  autoTable(doc, {
    startY: demoY + 5,
    margin: { left: margin, right: margin },
    head: [['Pediatric (0-18)', 'Young Adult (19-35)', 'Adult (36-60)', 'Geriatric (60+)']],
    body: [[
      analytics.ageGroups.pediatric,
      analytics.ageGroups.youngAdult,
      analytics.ageGroups.adult,
      analytics.ageGroups.geriatric
    ]],
    theme: 'grid',
    headStyles: { fillColor: [248, 250, 252], textColor: [15, 23, 42] },
    styles: { fontSize: 9, halign: 'center' }
  });

  // 5. Patient Logs (Start of new page if needed)
  const logY = (doc as any).lastAutoTable.finalY + 15;
  doc.text('Detailed Patient Logs', margin, logY);

  autoTable(doc, {
    startY: logY + 5,
    margin: { left: margin, right: margin },
    head: [['Name', 'Gender', 'Condition', 'Visit Type', 'Fee (Rs.)']],
    body: data.map(p => [
      p.name,
      p.gender,
      p.diagnosis,
      p.visit_type,
      (Number(p.fee_paid) || 0).toLocaleString()
    ]),
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 8 }
  });

  // 6. Final Concluding Note
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  if (finalY < 270) { // Check if space on current page
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'italic');
    doc.text('Note: For advanced data manipulation and bulk filtering, please use the "Export to Excel" feature in your Pro terminal.', margin, finalY);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount} | Private & Confidential`,
      pageWidth - margin - 45,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(`ClinicReport_${dateRangeStr.replace(/\s/g, '_')}.pdf`);
};