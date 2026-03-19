"use client";

import { Patient } from "@/lib/supabase";

export interface ReportAnalytics {
  totalPatients: number;
  newPatients: number;
  malePatients: number;
  femalePatients: number;
  otherPatients: number;
  avgAge: number;
  totalVisits: number;
  topConditions: { name: string; count: number }[];
  busiestDay: string;
  returningPatientPercent: number;
  growthRate: number;
  totalRevenue: number;
  avgRevenuePerPatient: number;
  retentionRate: number;
  avgSessionsPerPatient: number;
  ageGroups: {
    pediatric: number; // 0-18
    youngAdult: number; // 19-35
    adult: number; // 36-60
    geriatric: number; // 60+
  };
  aiInsights: string[];
}

export const computeReportAnalytics = (data: Patient[]): ReportAnalytics => {
  if (data.length === 0) {
    return {
      totalPatients: 0,
      newPatients: 0,
      malePatients: 0,
      femalePatients: 0,
      otherPatients: 0,
      avgAge: 0,
      totalVisits: 0,
      topConditions: [],
      busiestDay: 'N/A',
      returningPatientPercent: 0,
      growthRate: 0,
      totalRevenue: 0,
      avgRevenuePerPatient: 0,
      retentionRate: 0,
      avgSessionsPerPatient: 0,
      ageGroups: { pediatric: 0, youngAdult: 0, adult: 0, geriatric: 0 },
      aiInsights: []
    };
  }

  const total = data.length;
  const newCount = data.filter(p => p.visit_type === 'New').length;
  const male = data.filter(p => p.gender === 'Male').length;
  const female = data.filter(p => p.gender === 'Female').length;
  const other = data.filter(p => p.gender === 'Other').length;
  const avgAge = data.reduce((acc, curr) => acc + curr.age, 0) / total;
  
  // Financials
  const totalRevenue = data.reduce((acc, curr) => acc + (Number(curr.fee_paid) || 0), 0);

  // Identity grouping for retention
  const patientGroups: Record<string, any[]> = {};
  data.forEach(p => {
    const key = `${p.name.toLowerCase().trim()}|${p.phone || ''}`;
    if (!patientGroups[key]) patientGroups[key] = [];
    patientGroups[key].push(p);
  });

  const uniqueCount = Object.keys(patientGroups).length;
  const returningCount = Object.values(patientGroups).filter(g => g.length > 1).length;
  const retentionRate = uniqueCount > 0 ? (returningCount / uniqueCount) * 100 : 0;
  const avgSessions = uniqueCount > 0 ? total / uniqueCount : 0;

  // Age Groups
  const ageGroups = { pediatric: 0, youngAdult: 0, adult: 0, geriatric: 0 };
  data.forEach(p => {
    if (p.age <= 18) ageGroups.pediatric++;
    else if (p.age <= 35) ageGroups.youngAdult++;
    else if (p.age <= 60) ageGroups.adult++;
    else ageGroups.geriatric++;
  });

  // Top Conditions
  const condMap: Record<string, number> = {};
  data.forEach(p => {
    const d = p.diagnosis?.trim().toLowerCase() || 'unspecified';
    condMap[d] = (condMap[d] || 0) + 1;
  });
  const topConditions = Object.entries(condMap)
    .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const busiestDay = Object.entries(
    data.reduce((acc: any, p) => {
      acc[p.visit_date] = (acc[p.visit_date] || 0) + 1;
      return acc;
    }, {})
  ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

  const insights = [
    `Retention analysis shows a ${Math.round(retentionRate)}% loyalty rate across clinical sessions.`,
    `Financial yield per unique patient is averaging Rs. ${Math.round(totalRevenue / (uniqueCount || 1))}.`,
    `Clinical volume is primarily driven by ${topConditions[0]?.name || 'various'} cases.`
  ];

  return {
    totalPatients: total,
    newPatients: newCount,
    malePatients: male,
    femalePatients: female,
    otherPatients: other,
    avgAge: Math.round(avgAge * 10) / 10,
    totalVisits: total,
    topConditions,
    busiestDay: busiestDay !== 'N/A' ? new Date(busiestDay).toLocaleDateString() : 'N/A',
    returningPatientPercent: Math.round(((total - newCount) / total) * 100),
    growthRate: Math.round((newCount / total) * 100),
    totalRevenue,
    avgRevenuePerPatient: Math.round(totalRevenue / (uniqueCount || 1)),
    retentionRate: Math.round(retentionRate),
    avgSessionsPerPatient: Math.round(avgSessions * 10) / 10,
    ageGroups,
    aiInsights: insights
  };
};