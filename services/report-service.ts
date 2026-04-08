import { ReportStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ResearchRequest } from "@/lib/validators";

export type ReportFilters = {
  status?: ReportStatus;
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
};

function buildReportWhere(filters: ReportFilters = {}): Prisma.ReportWhereInput {
  const where: Prisma.ReportWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.city) where.city = { contains: filters.city };
  if (filters.state) where.state = { equals: filters.state.toUpperCase() };

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) {
      where.createdAt.gte = new Date(`${filters.dateFrom}T00:00:00.000Z`);
    }
    if (filters.dateTo) {
      where.createdAt.lte = new Date(`${filters.dateTo}T23:59:59.999Z`);
    }
  }

  return where;
}

export async function createResearchRequest(input: ResearchRequest) {
  return prisma.report.create({
    data: {
      agencyName: input.agencyName,
      city: input.city,
      state: input.state,
      status: ReportStatus.QUEUED,
      companySnapshot: {
        description: "Prospect profile is being assembled.",
      },
      talkingPoints: ["Ask about primary commercial lines focus.", "Confirm renewal timeline and incumbent carrier mix."],
    },
  });
}

export async function listRecentReports(limit = 8) {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listAdminReports(filters: ReportFilters, limit = 25) {
  return prisma.report.findMany({
    where: buildReportWhere(filters),
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

export async function getAdminSummary(filters: ReportFilters = {}) {
  const where = buildReportWhere(filters);

  const [totalRequested, queued, researching, drafted, completed, failed] = await Promise.all([
    prisma.report.count({ where }),
    prisma.report.count({
      where: {
        ...where,
        OR: [{ status: ReportStatus.QUEUED }, { status: ReportStatus.PENDING }],
      },
    }),
    prisma.report.count({ where: { ...where, status: ReportStatus.RESEARCHING } }),
    prisma.report.count({ where: { ...where, status: ReportStatus.DRAFTED } }),
    prisma.report.count({ where: { ...where, status: ReportStatus.COMPLETED } }),
    prisma.report.count({ where: { ...where, status: ReportStatus.FAILED } }),
  ]);

  return { totalRequested, queued, researching, drafted, completed, failed };
}

export async function getWeeklyVolumeData(days = 14, filters: ReportFilters = {}) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const baseWhere = buildReportWhere(filters);

  const reports = await prisma.report.findMany({
    where: {
      AND: [baseWhere, { createdAt: { gte: start } }],
    },
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

export async function updateReportStatus(id: string, status: ReportStatus) {
  return prisma.report.update({
    where: { id },
    data: {
      status,
      generatedAt: status === ReportStatus.COMPLETED ? new Date() : undefined,
    },
  });
}

export function formatLocation(report: { city: string; state: string }) {
  return `${report.city}, ${report.state}`;
}
