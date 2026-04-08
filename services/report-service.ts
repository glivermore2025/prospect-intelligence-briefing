import { ReportStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ResearchRequest } from "@/lib/validators";

export async function createResearchRequest(input: ResearchRequest) {
  return prisma.report.create({
    data: {
      agencyName: input.agencyName,
      city: input.city,
      state: input.state,
      status: ReportStatus.PENDING,
    },
  });
}

export async function listRecentReports(limit = 8) {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { sources: true },
  });
}

export async function getAdminSummary() {
  const [totalRequested, completed, pending, failed] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { status: ReportStatus.COMPLETED } }),
    prisma.report.count({ where: { status: ReportStatus.PENDING } }),
    prisma.report.count({ where: { status: ReportStatus.FAILED } }),
  ]);

  return { totalRequested, completed, pending, failed };
}

export async function getWeeklyVolumeData(days = 14) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const reports = await prisma.report.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const counts = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    const key = day.toISOString().slice(0, 10);
    counts.set(key, 0);
  }

  for (const report of reports) {
    const key = report.createdAt.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([date, reportCount]) => ({ date, reports: reportCount }));
}

export function formatLocation(report: { city: string; state: string }) {
  return `${report.city}, ${report.state}`;
}
