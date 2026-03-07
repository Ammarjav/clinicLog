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
    const d = p.diagnosis.trim().toLowerCase();
    condMap[d] = (condMap[d] || 0) + 1;
  });
  const topConditions = Object.entries(condMap)
    .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Busiest Day
  const dayMap: Record<string, number> = {};
  data.forEach(p => {
    dayMap[p.visit_date] = (dayMap[p.visit_date] || 0) + 1;
  });
  const busiestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const returningPercent = ((total - newCount) / total) * 100;

  // Simple Insights
  const insights = [
    `Most common condition this period was "${topConditions[0]?.name || 'N/A'}".`,
    `${Math.round(returningPercent)}% of your volume came from returning patients.`,
    `Patient demographic is primarily ${Object.entries(ageGroups).sort((a, b) => b[1] - a[1])[0][0].replace(/([A-Z])/g, ' $1').toLowerCase()}.`
  ];

  return {
    totalPatients: total,
    newPatients: newCount,
    malePatients: male,
    femalePatients: female,
    otherPatients: other,
    avgAge: Math.round(avgAge * 10) / 10,
    totalVisits: total, // For this simplified model, visits = patient records
    topConditions,
    busiestDay: busiestDay !== 'N/A' ? new Date(busiestDay).toLocaleDateString() : 'N/A',
    returningPatientPercent: Math.round(returningPercent),
    growthRate: Math.round((newCount / total) * 100), // Simple proxy for growth
    ageGroups,
    aiInsights: insights
  };
};