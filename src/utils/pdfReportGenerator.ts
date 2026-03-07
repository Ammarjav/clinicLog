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

  // Helper for colors
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
  doc.text('CLINICAL ANALYTICS PERFORMANCE REPORT', margin, 28);
  
  doc.setFontSize(9);
  doc.text(`Period: ${dateRangeStr}`, margin, 34);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 38);

  // 2. Summary Cards (Top row) - Now 4 cards
  const cardGap = 4;
  const cardWidth = (pageWidth - (margin * 2) - (cardGap * 3)) / 4;
  const cardY = 55;

  const drawCard = (x: number, y: number, title: string, value: string, color: number[]) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.roundedRect(x, y, cardWidth, 25, 3, 3, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(title.toUpperCase(), x + 4, y + 8);
    
    doc.setFontSize(12);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(value, x + 4, y + 18);
  };

  drawCard(margin, cardY, 'Total Patients', analytics.totalPatients.toString(), primaryColor);
  drawCard(margin + (cardWidth + cardGap), cardY, 'New Patients', analytics.newPatients.toString(), [16, 185, 129]);
  drawCard(margin + (cardWidth + cardGap) * 2, cardY, 'Male Patients', analytics.malePatients.toString(), [59, 130, 246]);
  drawCard(margin + (cardWidth + cardGap) * 3, cardY, 'Female Patients', analytics.femalePatients.toString(), [236, 72, 153]);

  // 3. Advanced Insights
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Operational Insights', margin, 95);

  autoTable(doc, {
    startY: 100,
    margin: { left: margin, right: margin },
    head: [['Key Performance Indicator', 'Value']],
    body: [
      ['Busiest Day of Period', analytics.busiestDay],
      ['Average Patient Age', `${analytics.avgAge} Years`],
      ['Returning Patient Rate', `${analytics.returningPatientPercent}%`],
      ['Patient Growth (New/Total)', `${analytics.growthRate}%`],
      ['Top Condition', analytics.topConditions[0]?.name || 'N/A']
    ],
    theme: 'striped',
    headStyles: { fillGray: 245, textColor: [71, 85, 105], fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  // 4. Demographic Breakdown
  const tableEnd = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Demographic Breakdown', margin, tableEnd);

  autoTable(doc, {
    startY: tableEnd + 5,
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

  // 5. Patient Summary (Top 20)
  const patientTableY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.text('Recent Patient Logs (Top 20)', margin, patientTableY);

  autoTable(doc, {
    startY: patientTableY + 5,
    margin: { left: margin, right: margin },
    head: [['Name', 'Age', 'Gender', 'Condition', 'Visit Date']],
    body: data.slice(0, 20).map(p => [
      p.name,
      p.age,
      p.gender,
      p.diagnosis,
      new Date(p.visit_date).toLocaleDateString()
    ]),
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 8 }
  });

  // 6. Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'Full patient dataset can be exported via Excel from the ClinicLog dashboard.',
      margin,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(`ClinicReport_${dateRangeStr.replace(/\s/g, '_')}.pdf`);
};